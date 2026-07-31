import { Routes, Route, Link, useNavigate} from "react-router-dom";
import ProductsPage from "./ProductsPage";
import ProductDetailPage from "./ProductDetailPage";
import CartPage from "./CartPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import OrdersPage from "./OrdersPage";
import ProtectedRoute from "./ProtectedRoute";
import FavoritesPage from "./FavoritesPage";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const cikisYap = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <header className="header">
        <nav>
          <div className="nav-links">
            <Link to="/" className="nav-brand">Mağaza</Link>
            <Link to="/">Ürünler</Link>
            <Link to="/sepet">Sepetim</Link>
            <Link to="/orders">Siparişlerim</Link>
            <Link to="/favorites">Favorilerim</Link>
          </div>
          <div className="nav-right">
            {token ? (
              <button className="logout-btn" onClick={cikisYap}>
                Çıkış Yap
              </button>
            ) : (
              <>
                <Link to="/login">Giriş</Link>
                <Link to="/register">Kayıt</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/urun/:id" element={<ProductDetailPage />} />
          <Route
            path="/sepet"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }/>        
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }/>
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />        
        </Routes>
      </main>
    </div>
  );
}

export default App;