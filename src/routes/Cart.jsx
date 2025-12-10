import styles from "./Cart.module.css";
import { useCart } from "../contexts/CartContext";
import { Trash, Minus, Plus } from "react-feather";

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
        <UpdateCartQuantity item={item} />
      </div>
    </div>
  );
}

export function UpdateCartQuantity({ item }) {
  const { updateProductQuantity } = useCart();

  const handleQuantityChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(sanitizedValue, 10) || 1;
    updateProductQuantity(item.id, numericValue);
  };

  const incrementQuantity = () => {
    updateProductQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    updateProductQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className={styles.quantitySection}>
      <span className={styles.quantityTool}>
        {/* <label htmlFor="quantity">Quantity</label> */}
        <button
          aria-label="decrease quantity in cart by one"
          onClick={decrementQuantity}
          className={styles.minusButton}
        >
          {item.quantity === 1 ? (
            <Trash size={12} strokeWidth={3} />
          ) : (
            <Minus size={14} strokeWidth={3} />
          )}
        </button>

        <input
          id="quantity"
          name="quantity"
          type="tel"
          value={item.quantity}
          onFocus={(e) => e.target.select()}
          onChange={handleQuantityChange}
          className={styles.quantityInput}
        />

        <button
          aria-label="increase quantity in cart by one"
          onClick={incrementQuantity}
          className={styles.plusButton}
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </span>
      <button
        onClick={() => updateProductQuantity(item.id, 0)}
        className={styles.removeBtn}
      >
        Remove
      </button>
    </div>
  );
}
