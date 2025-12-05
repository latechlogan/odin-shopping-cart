import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Nav from "./Nav";
import { useCart } from "../../contexts/CartContext";

// Mock the useCart hook
vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

describe("Nav component", () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.clearAllMocks();
  });

  describe("Navigation links", () => {
    test("renders Home link with correct path", () => {
      useCart.mockReturnValue({
        getCartCount: () => 0,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    test("renders Products link with correct path", () => {
      useCart.mockReturnValue({
        getCartCount: () => 0,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const productsLink = screen.getByRole("link", { name: /products/i });
      expect(productsLink).toHaveAttribute("href", "/products");
    });

    test("renders Cart link with correct path", () => {
      useCart.mockReturnValue({
        getCartCount: () => 0,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const links = screen.getAllByRole("link");
      const cartLink = links.find(link => link.getAttribute("href") === "/cart");
      expect(cartLink).toBeDefined();
    });
  });

  describe("Cart badge", () => {
    test("does not display badge when cart is empty", () => {
      useCart.mockReturnValue({
        getCartCount: () => 0,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.queryByText(/items? in cart/i);
      expect(badge).not.toBeInTheDocument();
    });

    test("displays exact count for single item", () => {
      useCart.mockReturnValue({
        getCartCount: () => 1,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("1 items in cart");
      expect(badge).toHaveTextContent("1");
    });

    test("displays exact count for counts 2-9", () => {
      useCart.mockReturnValue({
        getCartCount: () => 5,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("5 items in cart");
      expect(badge).toHaveTextContent("5");
    });

    test("displays exact count for 9 items", () => {
      useCart.mockReturnValue({
        getCartCount: () => 9,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("9 items in cart");
      expect(badge).toHaveTextContent("9");
    });

    test('displays "9+" for 10 items', () => {
      useCart.mockReturnValue({
        getCartCount: () => 10,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("10 items in cart");
      expect(badge).toHaveTextContent("9+");
    });

    test('displays "9+" for counts greater than 10', () => {
      useCart.mockReturnValue({
        getCartCount: () => 99,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("99 items in cart");
      expect(badge).toHaveTextContent("9+");
    });

    test("has proper aria-label for accessibility", () => {
      useCart.mockReturnValue({
        getCartCount: () => 3,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("3 items in cart");
      expect(badge).toBeInTheDocument();
    });

    test("aria-label updates with cart count", () => {
      useCart.mockReturnValue({
        getCartCount: () => 15,
      });

      render(
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      );

      const badge = screen.getByLabelText("15 items in cart");
      expect(badge).toBeInTheDocument();
    });
  });
});
