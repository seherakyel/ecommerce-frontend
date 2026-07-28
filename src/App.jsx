import { Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import ProductDetailPage from "./ProductDetailPage";
import CartPage from "./CartPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Ürünler</Link> | <Link to="/sepet">Sepetim</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/urun/:id" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />
      </Routes>
    </div>
  );
}

export default App;