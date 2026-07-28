import { Routes, Route, Link, useNavigate} from "react-router-dom";
import ProductsPage from "./ProductsPage";
import ProductDetailPage from "./ProductDetailPage";
import CartPage from "./CartPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import OrdersPage from "./OrdersPage";


function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const cikisYap = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <Link to="/">Ürünler</Link> | <Link to="/sepet">Sepetim</Link> |{" "}
        <Link to="/orders">Siparişlerim</Link> |{" "}
        {token ? (
        <Link to="/login" onClick={cikisYap}>
            Çıkış Yap
        </Link>
        ) : (
          <>
        <Link to="/login">Giriş</Link> | <Link to="/register">Kayıt</Link>
    </>
  )}
</nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/urun/:id" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<OrdersPage />} />    
        </Routes>
    </div>
  );
}

export default App;