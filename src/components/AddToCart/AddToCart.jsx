import styles from "./AddToCart.module.css";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";

export default function AddToCart({ showOptions = false, item }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(sanitizedValue, 10) || 1;
    setQuantity(numericValue);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <section className={styles.addToCart}>
      {showOptions && (
        <span className={styles.quantitySection}>
          {/* <label htmlFor="quantity">Quantity</label> */}
          <button
            aria-label="decrease add to cart quantity by one"
            onClick={decrementQuantity}
            className={styles.minusButton}
          >
            &ndash;
          </button>
          <input
            id="quantity"
            name="quantity"
            type="tel"
            value={quantity}
            onFocus={(e) => e.target.select()}
            onChange={handleQuantityChange}
            className={styles.quantityInput}
          />
          <button
            aria-label="increase add to cart quantity by one"
            onClick={incrementQuantity}
            className={styles.plusButton}
          >
            +
          </button>
        </span>
      )}
      <button className={styles.cta} onClick={() => addToCart(item, quantity)}>
        Add to Cart
      </button>
    </section>
  );
}
