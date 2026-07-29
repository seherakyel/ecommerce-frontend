import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        .then((r) => r.json())
        .then((data) => setFavorites(data.map((f) => f.product.id)));
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
    <div>
      <h1>Ürünler</h1>
      {urunler.map((urun) => (
        <div key={urun.id}>
          <Link to={`/urun/${urun.id}`}>
            <h3>{urun.name}</h3>
          </Link>
          <p>{urun.price} TL</p>
          <button onClick={() => sepeteEkle(urun.id)}>Sepete Ekle</button>
          <button onClick={() => toggleFavorite(urun.id)}>
            {favorites.includes(urun.id) ? "❤️ Favoride" : "🤍 Favoriye Ekle"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;