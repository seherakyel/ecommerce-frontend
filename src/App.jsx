import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      navigate(`/?search=${encodeURIComponent(e.target.value)}`);
    } else {
      navigate("/");
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCatId, setHoveredCatId] = useState(null);
  const [subCats, setSubCats] = useState([]);
  const subCatCache = useRef({});
  const menuRef = useRef(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/categories/")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); });
  }, []);

  const handleCatHover = (catId) => {
    setHoveredCatId(catId);
    if (subCatCache.current[catId]) {
      setSubCats(subCatCache.current[catId]);
    } else {
      fetch(`http://127.0.0.1:8000/categories/?parent_id=${catId}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            subCatCache.current[catId] = data;
            setSubCats(data);
          }
        });
    }
  };

  const handleCatLeave = () => {
    setHoveredCatId(null);
    setSubCats([]);
  };

  const selectCategory = (parentId, catId) => {
    setMenuOpen(false);
    setHoveredCatId(null);
    setSubCats([]);
    if (catId) {
      navigate(`/?parent_id=${parentId}&category_id=${catId}`);
    } else {
      navigate(`/?parent_id=${parentId}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setHoveredCatId(null);
        setSubCats([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const hoveredCat = categories.find((c) => c.id === hoveredCatId);

  return (
    <div>
      <header className="header">
        <nav>
          <div className="nav-left">
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
            <Link to="/" className="nav-brand">SHOP NOVA</Link>
          </div>

          <div className="nav-search">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Aradığınız ürünü giriniz"
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="nav-actions">
            <Link to="/favorites" className="nav-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Favorilerim</span>
            </Link>
            <Link to="/orders" className="nav-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>Siparişlerim</span>
            </Link>
            <Link to="/sepet" className="nav-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Sepetim</span>
            </Link>
            <div className="account-wrapper">
              <button className="nav-action account-trigger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <div className="account-dropdown">
                <div className="account-dropdown-arrow" />
                {token ? (
                  <>
                    <Link to="/orders" className="account-dropdown-item">
                      <span>Siparişlerim</span>
                    </Link>
                    <Link to="/favorites" className="account-dropdown-item">
                      <span>Favorilerim</span>
                    </Link>
                    <div className="account-dropdown-divider" />
                    <button className="account-dropdown-item" onClick={cikisYap}>
                      <span>Çıkış Yap</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="account-dropdown-item">
                      <span>Giriş Yap</span>
                    </Link>
                    <Link to="/register" className="account-dropdown-item">
                      <span>Kayıt Ol</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="mega-wrapper" ref={menuRef} onMouseLeave={handleCatLeave}>
          <div className="mega-strip">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`mega-cat-item${hoveredCatId === cat.id ? " active" : ""}`}
                onMouseEnter={() => handleCatHover(cat.id)}
                onClick={() => selectCategory(cat.id)}
              >
                {cat.image_url ? (
                  <img className="mega-cat-img" src={cat.image_url} alt="" />
                ) : (
                  <div className="mega-cat-img mega-cat-placeholder" />
                )}
                <span className="mega-cat-name">{cat.name}</span>
              </button>
            ))}
          </div>

          {hoveredCatId && subCats.length > 0 && (
            <div className="mega-dropdown">
              <div className="mega-sub-list">
                {subCats.map((sub) => (
                  <button
                    key={sub.id}
                    className="mega-sub-item"
                    onClick={() => selectCategory(hoveredCatId, sub.id)}
                  >
                    {sub.name}
                  </button>
                ))}
                <button
                  className="mega-sub-viewall"
                  onClick={() => selectCategory(hoveredCatId)}
                >
                  Tümünü Gör
                </button>
              </div>
              <div className="mega-sub-image">
                {hoveredCat?.image_url ? (
                  <img src={hoveredCat.image_url} alt="" />
                ) : (
                  <div className="mega-sub-img-placeholder" />
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
