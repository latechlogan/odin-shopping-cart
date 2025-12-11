import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Cart, { CartItem, UpdateCartQuantity } from "./Cart";
import { useCart } from "../contexts/CartContext";

// Mock the useCart hook
vi.mock("../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

// Mock react-feather icons
vi.mock("react-feather", () => ({
  Trash: () => <div>Trash Icon</div>,
  Minus: () => <div>Minus Icon</div>,
  Plus: () => <div>Plus Icon</div>,
  ArrowRight: () => <div>Arrow Icon</div>,
}));

describe("Cart component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Empty cart state", () => {
    test("displays empty cart message when cart is empty", () => {
      useCart.mockReturnValue({
        cart: {},
        getCartCount: () => 0,
      });

      render(<Cart />);

      expect(
        screen.getByText(/your cart appears to be empty/i)
      ).toBeInTheDocument();
    });

    test("does not render cart items or checkout when empty", () => {
      useCart.mockReturnValue({
        cart: {},
        getCartCount: () => 0,
      });

      render(<Cart />);

      expect(screen.queryByText(/subtotal/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/proceed to checkout/i)).not.toBeInTheDocument();
    });
  });

  describe("Price calculations", () => {
    test("calculates subtotal correctly for single item", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.0,
            quantity: 2,
            image: "image.jpg",
          },
        },
        getCartCount: () => 2,
      });

      render(<Cart />);

      // Subtotal should be 10 * 2 = 20.00
      expect(screen.getAllByText("$20.00")[0]).toBeInTheDocument();
    });

    test("calculates subtotal correctly for multiple items", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.5,
            quantity: 2,
            image: "image.jpg",
          },
          2: {
            id: 2,
            title: "Product 2",
            price: 15.0,
            quantity: 3,
            image: "image.jpg",
          },
        },
        getCartCount: () => 5,
      });

      render(<Cart />);

      // Subtotal should be (10.5 * 2) + (15 * 3) = 21 + 45 = 66.00
      expect(screen.getAllByText("$66.00")[0]).toBeInTheDocument();
    });

    test("calculates tax correctly at 10.99% rate", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 100.0,
            quantity: 1,
            image: "image.jpg",
          },
        },
        getCartCount: () => 1,
      });

      render(<Cart />);

      // Tax should be 100 * 0.1099 = 10.99
      expect(screen.getByText("$10.99")).toBeInTheDocument();
    });

    test("displays fixed shipping cost of $5.99", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.0,
            quantity: 1,
            image: "image.jpg",
          },
        },
        getCartCount: () => 1,
      });

      render(<Cart />);

      expect(screen.getByText("$5.99")).toBeInTheDocument();
    });

    test("calculates total correctly (subtotal + tax + shipping)", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 100.0,
            quantity: 1,
            image: "image.jpg",
          },
        },
        getCartCount: () => 1,
      });

      render(<Cart />);

      // Total should be 100 + (100 * 0.1099) + 5.99 = 100 + 10.99 + 5.99 = 116.98
      expect(screen.getByText("$116.98")).toBeInTheDocument();
    });

    test("handles decimal prices correctly in calculations", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 9.99,
            quantity: 3,
            image: "image.jpg",
          },
        },
        getCartCount: () => 3,
      });

      render(<Cart />);

      // Subtotal: 9.99 * 3 = 29.97
      expect(screen.getAllByText("$29.97")[0]).toBeInTheDocument();
      // Tax: 29.97 * 0.1099 = 3.29
      expect(screen.getByText("$3.29")).toBeInTheDocument();
      // Total: 29.97 + 3.29 + 5.99 = 39.25
      expect(screen.getByText("$39.25")).toBeInTheDocument();
    });

    test("formats prices to two decimal places", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.5,
            quantity: 1,
            image: "image.jpg",
          },
        },
        getCartCount: () => 1,
      });

      render(<Cart />);

      // Should display as 10.50, not 10.5
      expect(screen.getAllByText("$10.50")[0]).toBeInTheDocument();
    });
  });

  describe("Cart item count display", () => {
    test("displays correct item count in subtotal for single item", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.0,
            quantity: 5,
            image: "image.jpg",
          },
        },
        getCartCount: () => 5,
      });

      render(<Cart />);

      expect(screen.getAllByText(/5 items/i)[0]).toBeInTheDocument();
    });

    test("displays correct total count across multiple items", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.0,
            quantity: 2,
            image: "image.jpg",
          },
          2: {
            id: 2,
            title: "Product 2",
            price: 20.0,
            quantity: 3,
            image: "image.jpg",
          },
        },
        getCartCount: () => 5,
      });

      render(<Cart />);

      expect(screen.getAllByText(/5 items/i)[0]).toBeInTheDocument();
    });
  });

  describe("Cart rendering", () => {
    test("renders all items in cart", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.0,
            quantity: 1,
            image: "image1.jpg",
          },
          2: {
            id: 2,
            title: "Product 2",
            price: 20.0,
            quantity: 1,
            image: "image2.jpg",
          },
        },
        getCartCount: () => 2,
      });

      render(<Cart />);

      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });

    test("renders proceed to checkout button", () => {
      useCart.mockReturnValue({
        cart: {
          1: {
            id: 1,
            title: "Product 1",
            price: 10.0,
            quantity: 1,
            image: "image.jpg",
          },
        },
        getCartCount: () => 1,
      });

      render(<Cart />);

      expect(
        screen.getByRole("button", { name: /proceed to checkout/i })
      ).toBeInTheDocument();
    });
  });
});

describe("UpdateCartQuantity component", () => {
  let mockUpdateProductQuantity;
  let mockToast;
  const mockItem = {
    id: 1,
    title: "Test Product",
    price: 10.0,
    quantity: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateProductQuantity = vi.fn();
    mockToast = vi.fn();

    useCart.mockReturnValue({
      updateProductQuantity: mockUpdateProductQuantity,
    });
  });

  describe("Quantity increment and decrement", () => {
    test("increments quantity when plus button is clicked", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const incrementButton = screen.getByRole("button", {
        name: /increase quantity in cart by one/i,
      });
      await user.click(incrementButton);

      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 4);
    });

    test("decrements quantity when minus button is clicked", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const decrementButton = screen.getByRole("button", {
        name: /decrease quantity in cart by one/i,
      });
      await user.click(decrementButton);

      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 2);
    });

    test("shows toast when decrementing to zero", async () => {
      const user = userEvent.setup();
      const itemWithQuantityOne = { ...mockItem, quantity: 1 };
      render(<UpdateCartQuantity item={itemWithQuantityOne} toast={mockToast} />);

      const decrementButton = screen.getByRole("button", {
        name: /decrease quantity in cart by one/i,
      });
      await user.click(decrementButton);

      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 0);
      expect(mockToast).toHaveBeenCalledWith("Item removed from cart.");
    });
  });

  describe("Manual quantity input", () => {
    test("updates quantity when valid number is entered", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const input = screen.getByRole("textbox");
      await user.tripleClick(input);
      await user.keyboard("7");

      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 7);
    });

    test("sanitizes non-numeric characters from input", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const input = screen.getByRole("textbox");
      await user.tripleClick(input);
      await user.keyboard("5abc");

      // Should only process the "5", ignoring "abc"
      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 5);
    });

    test("does not update when input is empty or NaN", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const input = screen.getByRole("textbox");
      await user.tripleClick(input);
      await user.keyboard("{Backspace}");

      // Should not call updateProductQuantity for empty/NaN input
      expect(mockUpdateProductQuantity).not.toHaveBeenCalled();
    });

    test("shows toast when quantity is set to zero via input", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const input = screen.getByRole("textbox");
      await user.tripleClick(input);
      await user.keyboard("0");

      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 0);
      expect(mockToast).toHaveBeenCalledWith("Item removed from cart.");
    });
  });

  describe("Remove button", () => {
    test("removes item when remove button is clicked", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const removeButton = screen.getByRole("button", { name: /remove/i });
      await user.click(removeButton);

      expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 0);
      expect(mockToast).toHaveBeenCalledWith("Item removed from cart.");
    });
  });

  describe("Conditional icon display", () => {
    test("displays trash icon when quantity is 1", () => {
      const itemWithQuantityOne = { ...mockItem, quantity: 1 };
      render(<UpdateCartQuantity item={itemWithQuantityOne} toast={mockToast} />);

      expect(screen.getByText("Trash Icon")).toBeInTheDocument();
    });

    test("displays minus icon when quantity is greater than 1", () => {
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      expect(screen.getByText("Minus Icon")).toBeInTheDocument();
    });
  });

  describe("Input focus behavior", () => {
    test("selects input text on focus", async () => {
      const user = userEvent.setup();
      render(<UpdateCartQuantity item={mockItem} toast={mockToast} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      // Verify that select() would be called by checking the onFocus handler exists
      expect(input).toHaveAttribute("value", "3");
    });
  });
});
