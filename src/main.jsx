import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Products from "./routes/Products.jsx";
import ProductDetails from "./routes/ProductDetails.jsx";
import Cart from "./routes/Cart.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
