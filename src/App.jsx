import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./routes/Home.jsx";
import Products from "./routes/Products.jsx";
import ProductDetails from "./routes/ProductDetails.jsx";
import Cart from "./routes/Cart.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}
