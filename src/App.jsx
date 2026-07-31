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
          <div className="nav-account">
            <svg className="account-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div className="account-info">
              <span className="account-label">HESABIM</span>
              <div className="account-links">
                {token ? (
                  <button className="logout-btn" onClick={cikisYap}>
                    Çıkış Yap
                  </button>
                ) : (
                  <>
                    <Link to="/register">Kayıt Ol</Link>
                    <Link to="/login">Giriş Yap</Link>
                  </>
                )}
              </div>
            </div>
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