import styles from "./Nav.module.css";
import { NavLink } from "react-router";
import { ShoppingCart } from "react-feather";
import { useCart } from "../../contexts/CartContext";

export default function Nav() {
  const { addToCart, getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.navbar}>
        <h1 className={styles.logo}>Odin Shopping Cart</h1>
        <nav className={styles.navContainer}>
          <NavLink to="/" className={styles.navLink}>
            Home
          </NavLink>
          <NavLink to="/products" className={styles.navLink}>
            Products
          </NavLink>
          {/* <NavLink to="/product-details/1" className={styles.navLink}>
            Product Details
          </NavLink> */}
          <NavLink to="/cart" className={styles.navLink}>
            <ShoppingCart className={styles.cartIcon} />
            {cartCount > 0 && (
              <span
                className={`${styles.badge} ${
                  cartCount > 9 ? styles.badgeSmall : ""
                }`}
                aria-label={`${cartCount} items in cart`}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </section>
  );
}
