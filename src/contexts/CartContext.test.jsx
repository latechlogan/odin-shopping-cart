import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';

// Custom hook to consume the CartContext
const useCart = () => useContext(CartContext);

describe('CartContext', () => {
  test('initializes with empty cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual({});
  });

  test('adds new product to cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 10 };

    act(() => {
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart[1]).toEqual({
      id: 1,
      name: 'Test Product',
      price: 10,
      quantity: 2,
    });
  });

  test('uses default quantity of 1 when not specified', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 10 };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cart[1].quantity).toBe(1);
  });

  test('increments quantity for existing product', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 10 };

    act(() => {
      result.current.addToCart(product, 2);
      result.current.addToCart(product, 3);
    });

    expect(result.current.cart[1].quantity).toBe(5);
    expect(result.current.cart[1].name).toBe('Test Product');
  });

  test('handles rapid consecutive calls correctly (race condition test)', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 10 };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 1);
    });

    // Should be 3, not 1 (which would happen with the stale closure bug)
    expect(result.current.cart[1].quantity).toBe(3);
  });

  test('handles multiple different products in cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product1 = { id: 1, name: 'Product 1', price: 10 };
    const product2 = { id: 2, name: 'Product 2', price: 20 };
    const product3 = { id: 3, name: 'Product 3', price: 30 };

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

  test('preserves product data when adding to cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = {
      id: 1,
      name: 'Test Product',
      price: 10,
      description: 'A test product',
      image: 'test.jpg'
    };

    act(() => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart[1]).toMatchObject({
      id: 1,
      name: 'Test Product',
      price: 10,
      description: 'A test product',
      image: 'test.jpg',
      quantity: 1,
    });
  });

  test('updates quantity without losing product data', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = {
      id: 1,
      name: 'Test Product',
      price: 10,
      description: 'A test product'
    };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart[1].quantity).toBe(3);
    expect(result.current.cart[1].description).toBe('A test product');
  });
});