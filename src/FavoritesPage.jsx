import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FavoritesPage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const handleUnauth = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchFavorites = () => {
    fetch("http://127.0.0.1:8000/favorites/", {
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
    fetch(`http://127.0.0.1:8000/favorites/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => fetchFavorites());
  };

  const sepeteEkle = (productId) => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/cart/items", {
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
      <Link to="/" className="back-link">← Ürünlere Dön</Link>
      <h1 className="page-title">Favorilerim</h1>
      {favorites.length === 0 ? (
        <p className="empty-state">Henüz favori ürünün yok.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <div className="favorite-card" key={fav.id}>
              <div className="favorite-card-visual">
                {fav.product.image_url ? (
                  <img className="favorite-card-img" src={fav.product.image_url} alt={fav.product.name} />
                ) : (
                  <div className="favorite-card-placeholder">Görsel yok</div>
                )}
                <button
                  className="fav-heart-remove"
                  onClick={() => removeFavorite(fav.product.id)}
                >
                  ♥
                </button>
              </div>
              <div className="favorite-card-body">
                <h3>
                  <Link to={`/urun/${fav.product.id}`}>{fav.product.name}</Link>
                </h3>
                <p className="price">{fav.product.price} TL</p>
              </div>
              <button className="fav-cart-btn" onClick={() => sepeteEkle(fav.product.id)}>Sepete Ekle</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;