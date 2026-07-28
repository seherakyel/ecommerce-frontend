import { Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import ProductDetailPage from "./ProductDetailPage";
import CartPage from "./CartPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Ürünler</Link> | <Link to="/sepet">Sepetim</Link> |{" "}
        <Link to="/login">Giriş</Link> | <Link to="/register">Kayıt</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/urun/:id" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;