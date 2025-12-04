import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);

        // Validate the structure
        if (typeof parsed === "object" && parsed !== null) {
          return parsed;
        }

        throw new Error("Invalid cart structure");
      }
      return {};
    } catch (error) {
      console.error("Failed to load cart:", error);
      localStorage.removeItem("cart");
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart[product.id];

      return {
        ...prevCart,
        [product.id]: {
          ...product,
          quantity: existingItem ? existingItem.quantity + quantity : quantity,
        },
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const { [productId]: _, ...newCart } = prevCart;
      return newCart;
    });
  };

  const updateProductQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      return {
        ...prevCart,
        [productId]: {
          ...prevCart[productId],
          quantity: newQuantity,
        },
      };
    });
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  };

  // refactored: const value = { cart, setCart, addToCart };
  const value = useMemo(
    () => ({
      cart,
      setCart,
      addToCart,
      removeFromCart,
      updateProductQuantity,
      getCartCount,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

export { CartContext, CartProvider, useCart };
