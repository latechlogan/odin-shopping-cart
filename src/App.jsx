import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./routes/Home.jsx";
import Products from "./routes/Products.jsx";
import ProductDetails from "./routes/ProductDetails.jsx";
import Cart from "./routes/Cart.jsx";
import { useEffect, useState } from "react";
import Nav from "./components/Nav/Nav.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Home data={data} loading={loading} error={error} />}
        />
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
