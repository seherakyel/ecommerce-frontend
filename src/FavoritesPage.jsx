import { API_URL } from "./config";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FavoritesPage.css";
import "./ProductsPage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const handleUnauth = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchFavorites = () => {
    fetch(`${API_URL}/favorites/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        return r.json();
      })
      .then((data) => { if (data) setFavorites(data); });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = (productId) => {
    fetch(`${API_URL}/favorites/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => fetchFavorites());
  };

  const sepeteEkle = (productId) => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => alert("Ürün sepete eklendi!"));
  };

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Favorilerim</span>
      </nav>
      <h1 className="page-title">Favorilerim</h1>
      {favorites.length === 0 ? (
        <div className="empty-state-premium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2>Favoriniz bulunmuyor</h2>
          <p>Beğendiğiniz ürünleri favorilere ekleyerek burada görebilirsiniz.</p>
          <Link to="/" className="btn btn-primary">Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="products-grid">
          {favorites.map((fav) => (
            <div className="product-card" key={fav.id} onClick={() => navigate(`/urun/${fav.product.id}`)}>
              <div className="product-card-visual">
                {fav.product.image_url ? (
                  <img className="product-card-img" src={fav.product.image_url} alt={fav.product.name} />
                ) : (
                  <div className="product-card-placeholder">Görsel yok</div>
                )}
                <button
                  className="fav-heart active"
                  onClick={(e) => { e.stopPropagation(); removeFavorite(fav.product.id); }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button className="cart-overlay-btn" onClick={(e) => { e.stopPropagation(); sepeteEkle(fav.product.id); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Sepete Ekle
                </button>
              </div>
              <div className="product-card-body">
                <h3>{fav.product.name}</h3>
                <p className="price">{Number(fav.product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
