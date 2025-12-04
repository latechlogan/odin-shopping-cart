import { createContext, useState, useMemo } from "react";

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState({});

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

  //   const value = { cart, setCart, addToCart };
  const value = useMemo(() => ({ cart, setCart, addToCart }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext, CartProvider };
