import styles from "./AddToCart.module.css";
import { useCart } from "../../contexts/CartContext";

export default function AddToCart({ options = "false", item }) {
  const { addToCart } = useCart();

  return (
    <button className={styles.cta} onClick={() => addToCart(item)}>
      Add to Cart
    </button>
  );
}
