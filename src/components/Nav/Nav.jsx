import styles from "./Nav.module.css";
import { NavLink } from "react-router";
import { ShoppingCart } from "react-feather";

export default function Nav() {
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
          <NavLink to="/product-details/1" className={styles.navLink}>
            Product Details
          </NavLink>
          <NavLink to="/cart" className={styles.navLink}>
            <ShoppingCart />
          </NavLink>
        </nav>
      </div>
    </section>
  );
}
