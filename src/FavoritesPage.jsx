import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = () => {
    fetch("http://127.0.0.1:8000/favorites/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setFavorites(data));
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
    <div>
      <Link to="/">← Ürünlere Dön</Link>
      <h1>Favorilerim</h1>
      {favorites.length === 0 ? (
        <p>Henüz favori ürünün yok.</p>
      ) : (
        favorites.map((fav) => (
          <div key={fav.id}>
            <Link to={`/urun/${fav.product.id}`}>
              <h3>{fav.product.name}</h3>
            </Link>
            <p>{fav.product.price} TL</p>
            <button onClick={() => removeFavorite(fav.product.id)}>
              Favorilerden Çıkar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FavoritesPage;