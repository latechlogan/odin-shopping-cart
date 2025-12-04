import styles from "./Nav.module.css";
import { NavLink } from "react-router";

export default function Nav() {
  return (
    <navbar>
      <h1>Odin Shopping Cart</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/product-details/1">Product Details</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
    </navbar>
  );
}
