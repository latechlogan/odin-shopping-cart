import styles from "./Cart.module.css";
import { useCart } from "../contexts/CartContext";
import { Trash, Minus, Plus, ArrowRight } from "react-feather";
import { useMemo } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, getCartCount } = useCart();
  const cartArray = Object.values(cart);

  if (Object.keys(cart).length === 0)
    return (
      <div className={styles.emptyError}>
        <h2>Your cart appears to be empty.</h2>
      </div>
    );

  const subtotal = useMemo(
    () =>
      cartArray.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantity * currentValue.price,
        0
      ),
    [cartArray]
  );
  const tax = subtotal * 0.1099;
  const shipping = 5.99;
  const total = subtotal + tax + shipping;

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.cart}>
        <div className={styles.products}>
          {cartArray.map((item) => (
            <CartItem item={item} key={item.id} toast={toast} />
          ))}
          <span className={styles.subtotal}>
            Subtotal ({getCartCount()} items):&emsp;
            <strong>${subtotal.toFixed(2)}</strong>
          </span>
        </div>
        <div className={styles.checkout}>
          <div className={styles.charges}>
            <span className={styles.subtotal}>
              Subtotal ({getCartCount()} items):
              <span className={styles.valueWrapper}>
                ${subtotal.toFixed(2)}
              </span>
            </span>
            <span className={styles.taxes}>
              Taxes & Fees:
              <span className={styles.valueWrapper}>${tax.toFixed(2)}</span>
            </span>
            <span className={styles.shipping}>
              Shipping:
              <span className={styles.valueWrapper}>
                ${shipping.toFixed(2)}
              </span>
            </span>
            <hr />
            <span className={styles.total}>
              Total
              <span className={styles.valueWrapper}>${total.toFixed(2)}</span>
            </span>
          </div>
          <button className={styles.checkoutBtn}>
            Proceed to Checkout
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartItem({ item, toast }) {
  return (
    <div className={styles.cartItem}>
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
        <UpdateCartQuantity item={item} toast={toast} />
      </div>
    </div>
  );
}

export function UpdateCartQuantity({ item, toast }) {
  const { updateProductQuantity } = useCart();

  const notifyDelete = () => toast("Item removed from cart.");

  const handleQuantityChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(sanitizedValue, 10);
    if (isNaN(numericValue)) {
      return;
    }
    updateProductQuantity(item.id, numericValue);
    if (numericValue === 0) {
      notifyDelete();
    }
  };

  const incrementQuantity = () => {
    updateProductQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    updateProductQuantity(item.id, item.quantity - 1);
    if (item.quantity - 1 === 0) {
      notifyDelete();
    }
  };

  const removeItem = () => {
    updateProductQuantity(item.id, 0);
    notifyDelete();
  };

  return (
    <div className={styles.quantitySection}>
      <span className={styles.quantityTool}>
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
      <button onClick={removeItem} className={styles.removeBtn}>
        Remove
      </button>
    </div>
  );
}
