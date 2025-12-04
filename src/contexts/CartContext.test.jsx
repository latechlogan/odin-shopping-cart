import { describe, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, CartContext } from "./CartContext";
import { useContext } from "react";

// Custom hook to consume the CartContext
const useCart = () => useContext(CartContext);

describe("CartContext", () => {
  test("initializes with empty cart", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual({});
  });

  test("adds new product to cart", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: "Test Product", price: 10 };

    act(() => {
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart[1]).toEqual({
      id: 1,
      name: "Test Product",
      price: 10,
      quantity: 2,
    });
  });

  test("uses default quantity of 1 when not specified", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: "Test Product", price: 10 };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cart[1].quantity).toBe(1);
  });

  test("increments quantity for existing product", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: "Test Product", price: 10 };

    act(() => {
      result.current.addToCart(product, 2);
      result.current.addToCart(product, 3);
    });

    expect(result.current.cart[1].quantity).toBe(5);
    expect(result.current.cart[1].name).toBe("Test Product");
  });

  test("handles rapid consecutive calls correctly (race condition test)", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: "Test Product", price: 10 };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 1);
    });

    // Should be 3, not 1 (which would happen with the stale closure bug)
    expect(result.current.cart[1].quantity).toBe(3);
  });

  test("handles multiple different products in cart", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product1 = { id: 1, name: "Product 1", price: 10 };
    const product2 = { id: 2, name: "Product 2", price: 20 };
    const product3 = { id: 3, name: "Product 3", price: 30 };

    act(() => {
      result.current.addToCart(product1, 1);
      result.current.addToCart(product2, 2);
      result.current.addToCart(product3, 3);
    });

    expect(Object.keys(result.current.cart)).toHaveLength(3);
    expect(result.current.cart[1].quantity).toBe(1);
    expect(result.current.cart[2].quantity).toBe(2);
    expect(result.current.cart[3].quantity).toBe(3);
  });

  test("preserves product data when adding to cart", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = {
      id: 1,
      name: "Test Product",
      price: 10,
      description: "A test product",
      image: "test.jpg",
    };

    act(() => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart[1]).toMatchObject({
      id: 1,
      name: "Test Product",
      price: 10,
      description: "A test product",
      image: "test.jpg",
      quantity: 1,
    });
  });

  test("updates quantity without losing product data", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = {
      id: 1,
      name: "Test Product",
      price: 10,
      description: "A test product",
    };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart[1].quantity).toBe(3);
    expect(result.current.cart[1].description).toBe("A test product");
  });

  // Tests for removeFromCart
  describe("removeFromCart", () => {
    test("removes product from cart", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = { id: 1, name: "Test Product", price: 10 };

      act(() => {
        result.current.addToCart(product, 2);
      });

      expect(result.current.cart[1]).toBeDefined();

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.cart[1]).toBeUndefined();
      expect(Object.keys(result.current.cart)).toHaveLength(0);
    });

    test("removes only the specified product from cart with multiple products", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product1 = { id: 1, name: "Product 1", price: 10 };
      const product2 = { id: 2, name: "Product 2", price: 20 };
      const product3 = { id: 3, name: "Product 3", price: 30 };

      act(() => {
        result.current.addToCart(product1, 1);
        result.current.addToCart(product2, 2);
        result.current.addToCart(product3, 3);
      });

      expect(Object.keys(result.current.cart)).toHaveLength(3);

      act(() => {
        result.current.removeFromCart(2);
      });

      expect(result.current.cart[1]).toBeDefined();
      expect(result.current.cart[2]).toBeUndefined();
      expect(result.current.cart[3]).toBeDefined();
      expect(Object.keys(result.current.cart)).toHaveLength(2);
    });

    test("handles removing non-existent product gracefully", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = { id: 1, name: "Test Product", price: 10 };

      act(() => {
        result.current.addToCart(product, 1);
      });

      expect(Object.keys(result.current.cart)).toHaveLength(1);

      act(() => {
        result.current.removeFromCart(999);
      });

      // Cart should remain unchanged
      expect(Object.keys(result.current.cart)).toHaveLength(1);
      expect(result.current.cart[1]).toBeDefined();
    });
  });

  // Tests for updateProductQuantity
  describe("updateProductQuantity", () => {
    test("updates quantity of existing product", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = { id: 1, name: "Test Product", price: 10 };

      act(() => {
        result.current.addToCart(product, 2);
      });

      expect(result.current.cart[1].quantity).toBe(2);

      act(() => {
        result.current.updateProductQuantity(1, 5);
      });

      expect(result.current.cart[1].quantity).toBe(5);
    });

    test("preserves product data when updating quantity", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = {
        id: 1,
        name: "Test Product",
        price: 10,
        description: "A test product",
      };

      act(() => {
        result.current.addToCart(product, 2);
      });

      act(() => {
        result.current.updateProductQuantity(1, 10);
      });

      expect(result.current.cart[1].quantity).toBe(10);
      expect(result.current.cart[1].name).toBe("Test Product");
      expect(result.current.cart[1].description).toBe("A test product");
    });

    test("removes product when quantity is set to 0", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = { id: 1, name: "Test Product", price: 10 };

      act(() => {
        result.current.addToCart(product, 5);
      });

      expect(result.current.cart[1]).toBeDefined();

      act(() => {
        result.current.updateProductQuantity(1, 0);
      });

      expect(result.current.cart[1]).toBeUndefined();
      expect(Object.keys(result.current.cart)).toHaveLength(0);
    });

    test("removes product when quantity is negative", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product = { id: 1, name: "Test Product", price: 10 };

      act(() => {
        result.current.addToCart(product, 5);
      });

      expect(result.current.cart[1]).toBeDefined();

      act(() => {
        result.current.updateProductQuantity(1, -3);
      });

      expect(result.current.cart[1]).toBeUndefined();
      expect(Object.keys(result.current.cart)).toHaveLength(0);
    });

    test("updates only the specified product quantity", () => {
      const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
      const { result } = renderHook(() => useCart(), { wrapper });

      const product1 = { id: 1, name: "Product 1", price: 10 };
      const product2 = { id: 2, name: "Product 2", price: 20 };

      act(() => {
        result.current.addToCart(product1, 2);
        result.current.addToCart(product2, 3);
      });

      act(() => {
        result.current.updateProductQuantity(1, 10);
      });

      expect(result.current.cart[1].quantity).toBe(10);
      expect(result.current.cart[2].quantity).toBe(3);
    });
  });
});
