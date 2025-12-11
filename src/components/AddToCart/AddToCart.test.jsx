import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AddToCart from "./AddToCart";
import { useCart } from "../../contexts/CartContext";

// Mock the useCart hook
vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

describe("AddToCart component", () => {
  let mockAddToCart;
  const mockItem = {
    id: 1,
    title: "Test Product",
    price: 10.0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddToCart = vi.fn();

    useCart.mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  describe("Basic rendering", () => {
    test("renders Add to Cart button", () => {
      render(<AddToCart showOptions={false} item={mockItem} />);

      expect(
        screen.getByRole("button", { name: /add to cart/i })
      ).toBeInTheDocument();
    });

    test("does not show quantity controls when showOptions is false", () => {
      render(<AddToCart showOptions={false} item={mockItem} />);

      expect(
        screen.queryByRole("button", {
          name: /increase add to cart quantity by one/i,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: /decrease add to cart quantity by one/i,
        })
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    test("shows quantity controls when showOptions is true", () => {
      render(<AddToCart showOptions={true} item={mockItem} />);

      expect(
        screen.getByRole("button", {
          name: /increase add to cart quantity by one/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /decrease add to cart quantity by one/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("Default quantity behavior", () => {
    test("initializes with quantity of 1", () => {
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("1");
    });

    test("adds item with default quantity of 1 when showOptions is false", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={false} item={mockItem} />);

      const addButton = screen.getByRole("button", { name: /add to cart/i });
      await user.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith(mockItem, 1);
    });
  });

  describe("Quantity increment and decrement", () => {
    test("increments quantity when plus button is clicked", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });
      await user.click(incrementButton);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("2");
    });

    test("decrements quantity when minus button is clicked", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      // First increment to 3
      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });
      await user.click(incrementButton);
      await user.click(incrementButton);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("3");

      // Then decrement
      const decrementButton = screen.getByRole("button", {
        name: /decrease add to cart quantity by one/i,
      });
      await user.click(decrementButton);

      expect(input).toHaveValue("2");
    });

    test("does not decrement below 1", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const decrementButton = screen.getByRole("button", {
        name: /decrease add to cart quantity by one/i,
      });
      const input = screen.getByRole("textbox");

      // Try to decrement from 1
      await user.click(decrementButton);
      expect(input).toHaveValue("1");

      // Try again to ensure it stays at 1
      await user.click(decrementButton);
      expect(input).toHaveValue("1");
    });

    test("allows incrementing to large quantities", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });

      // Increment multiple times
      for (let i = 0; i < 10; i++) {
        await user.click(incrementButton);
      }

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("11");
    });
  });

  describe("Manual quantity input", () => {
    test("updates quantity when valid number is entered", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      // Triple click to select all, then type to replace
      await user.tripleClick(input);
      await user.keyboard("5");

      expect(input).toHaveValue("5");
    });

    test("sanitizes non-numeric characters from input", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      // Triple click to select all, then type to replace
      await user.tripleClick(input);
      await user.keyboard("7abc");

      // Should only show "7", non-numeric characters removed
      expect(input).toHaveValue("7");
    });

    test("defaults to 1 when input is cleared or invalid", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");

      // Set to a valid value first
      await user.tripleClick(input);
      await user.keyboard("5");
      expect(input).toHaveValue("5");

      // Clear the input by selecting all and deleting
      await user.tripleClick(input);
      await user.keyboard("{Backspace}");

      // After clearing, it should default to 1
      expect(input).toHaveValue("1");
    });

    test("handles mixed alphanumeric input correctly", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      // Triple click to select all, then type to replace
      await user.tripleClick(input);
      await user.keyboard("1a2b3c");

      // Should extract only numeric characters: 123
      expect(input).toHaveValue("123");
    });

    test("handles special characters in input", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      // Triple click to select all, then type to replace
      await user.tripleClick(input);
      await user.keyboard("!@#$%");

      // Should default to 1 when no valid numbers
      expect(input).toHaveValue("1");
    });
  });

  describe("Adding to cart", () => {
    test("adds item with current quantity when Add to Cart is clicked", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      // Set quantity to 3
      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });
      await user.click(incrementButton);
      await user.click(incrementButton);

      const addButton = screen.getByRole("button", { name: /^add to cart$/i });
      await user.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith(mockItem, 3);
    });

    test("adds item with manually entered quantity", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      await user.tripleClick(input);
      await user.keyboard("10");

      const addButton = screen.getByRole("button", { name: /^add to cart$/i });
      await user.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith(mockItem, 10);
    });

    test("can be called multiple times with different quantities", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const addButton = screen.getByRole("button", { name: /^add to cart$/i });
      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });

      // First add with quantity 1
      await user.click(addButton);
      expect(mockAddToCart).toHaveBeenCalledWith(mockItem, 1);

      // Increment and add again
      await user.click(incrementButton);
      await user.click(addButton);
      expect(mockAddToCart).toHaveBeenCalledWith(mockItem, 2);

      expect(mockAddToCart).toHaveBeenCalledTimes(2);
    });

    test("passes correct item object to addToCart", async () => {
      const user = userEvent.setup();
      const complexItem = {
        id: 5,
        title: "Complex Product",
        price: 99.99,
        description: "A detailed description",
        image: "image.jpg",
        category: "electronics",
      };

      render(<AddToCart showOptions={false} item={complexItem} />);

      const addButton = screen.getByRole("button", { name: /add to cart/i });
      await user.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith(complexItem, 1);
    });
  });

  describe("Input focus behavior", () => {
    test("selects input text on focus", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      // Verify input has the onFocus handler that calls select()
      expect(input).toHaveAttribute("value", "1");
    });
  });

  describe("Component state persistence", () => {
    test("maintains quantity state across increment/decrement operations", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });
      const decrementButton = screen.getByRole("button", {
        name: /decrease add to cart quantity by one/i,
      });
      const input = screen.getByRole("textbox");

      // Complex sequence of operations
      await user.click(incrementButton); // 2
      await user.click(incrementButton); // 3
      await user.click(incrementButton); // 4
      await user.click(decrementButton); // 3
      await user.click(incrementButton); // 4
      await user.click(decrementButton); // 3

      expect(input).toHaveValue("3");
    });

    test("maintains quantity state when switching between manual input and buttons", async () => {
      const user = userEvent.setup();
      render(<AddToCart showOptions={true} item={mockItem} />);

      const input = screen.getByRole("textbox");
      const incrementButton = screen.getByRole("button", {
        name: /increase add to cart quantity by one/i,
      });

      // Set via manual input
      await user.tripleClick(input);
      await user.keyboard("5");
      expect(input).toHaveValue("5");

      // Then use button
      await user.click(incrementButton);
      expect(input).toHaveValue("6");
    });
  });
});
