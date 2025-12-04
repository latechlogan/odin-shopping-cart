import { createContext, useState } from "react";

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const value = { cart, setCart };

  return <CartContext value={value}>{children}</CartContext>;
}

export { CartContext, CartProvider };
