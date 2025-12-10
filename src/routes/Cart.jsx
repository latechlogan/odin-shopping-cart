import styles from "./Cart.module.css";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

export default function Cart() {
  const { cart } = useCart();
  const cartArray = Object.values(cart);

  if (Object.keys(cart).length === 0)
    return (
      <div className={styles.emptyError}>
        <h2>Your cart appears to be empty.</h2>
      </div>
    );

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.cart}>
        <div className={styles.products}>
          {cartArray.map((item) => {
            return <CartItem item={item} />;
          })}
        </div>
        <div className={styles.charges}></div>
      </div>
    </div>
  );
}

export function CartItem({ item }) {
  return (
    <div key={item.id} className={styles.cartItem}>
      <div className={styles.itemImgContainer}>
        <img
          src={item.image}
          alt={item.description}
          className={styles.itemImg}
        />
      </div>
      <div className={styles.itemDetails}>
        <span className={styles.itemTitle}>{item.title}</span>
        <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
        <span className={styles.itemQty}>
          <UpdateCartQuantity item={item} />
        </span>
      </div>
    </div>
  );
}

export function UpdateCartQuantity({ item }) {
  const [quantity, setQuantity] = useState(item.quantity);

  return <span>{quantity}</span>;
}
