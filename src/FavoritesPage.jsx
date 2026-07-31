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
              {fav.product.image_url ? (
                <img className="favorite-card-img" src={fav.product.image_url} alt={fav.product.name} />
              ) : (
                <div className="favorite-card-placeholder">Görsel yok</div>
              )}
              <div className="favorite-card-body">
                <h3>
                  <Link to={`/urun/${fav.product.id}`}>{fav.product.name}</Link>
                </h3>
                <p className="price">{fav.product.price} TL</p>
                <button className="btn btn-danger btn-sm" onClick={() => removeFavorite(fav.product.id)}>
                  Favorilerden Çıkar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;