import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProductsPage.css";

function ProductsPage() {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((r) => r.json())
      .then((data) => setUrunler(data));

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/favorites/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (!r.ok) return null;
          return r.json();
        })
        .then((data) => { if (Array.isArray(data)) setFavorites(data.map((f) => f.product.id)); });
    }
  }, []);

  const sepeteEkle = (urunId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sepete eklemek için giriş yapmalısın.");
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: urunId, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => alert("Ürün sepete eklendi!"));
  };

  const toggleFavorite = (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Favorilere eklemek için giriş yapmalısın.");
      navigate("/login");
      return;
    }

    const isFavorite = favorites.includes(productId);

    if (isFavorite) {
      fetch(`http://127.0.0.1:8000/favorites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setFavorites(favorites.filter((id) => id !== productId)));
    } else {
      fetch("http://127.0.0.1:8000/favorites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      }).then(() => setFavorites([...favorites, productId]));
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Ürünler</h1>
      <div className="products-grid">
        {urunler.map((urun) => (
          <div className="product-card" key={urun.id}>
            <div className="product-card-visual">
              {urun.image_url ? (
                <img className="product-card-img" src={urun.image_url} alt={urun.name} />
              ) : (
                <div className="product-card-placeholder">Görsel yok</div>
              )}
              <button
                className={`fav-heart${favorites.includes(urun.id) ? " active" : ""}`}
                onClick={() => toggleFavorite(urun.id)}
              >
                {favorites.includes(urun.id) ? "♥" : "♡"}
              </button>
            </div>
            <div className="product-card-body">
              <h3>
                <Link to={`/urun/${urun.id}`}>{urun.name}</Link>
              </h3>
              <p className="price">{urun.price} TL</p>
            </div>
            <button className="cart-btn" onClick={() => sepeteEkle(urun.id)}>Sepete Ekle</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;