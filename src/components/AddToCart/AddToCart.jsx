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
    <section>
      {showOptions && (
        <span>
          <label htmlFor="quantity">Qty</label>
          <button
            aria-label="decrease add to cart quantity by one"
            onClick={decrementQuantity}
          >
            -
          </button>
          <input
            id="quantity"
            name="quantity"
            type="tel"
            value={quantity}
            onFocus={(e) => e.target.select()}
            onChange={handleQuantityChange}
          />
          <button
            aria-label="increase add to cart quantity by one"
            onClick={incrementQuantity}
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
