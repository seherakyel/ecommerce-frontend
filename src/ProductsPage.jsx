import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./ProductsPage.css";

function ProductsPage() {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category_id") || "";

  const fetchProducts = () => {
    let url = "http://127.0.0.1:8000/products/";
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (categoryId) params.push(`category_id=${categoryId}`);
    if (params.length > 0) url += "?" + params.join("&");

    fetch(url)
      .then((r) => r.json())
      .then((data) => setUrunler(data));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/favorites/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (Array.isArray(data)) setFavorites(data.map((f) => f.product.id)); });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId]);

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
        {urunler.length === 0 ? (
          <p className="empty-state">Ürün bulunamadı.</p>
        ) : (
          urunler.map((urun) => (
            <div className="product-card" key={urun.id} onClick={() => navigate(`/urun/${urun.id}`)}>
              <div className="product-card-visual">
                {urun.image_url ? (
                  <img className="product-card-img" src={urun.image_url} alt={urun.name} />
                ) : (
                  <div className="product-card-placeholder">Görsel yok</div>
                )}
                <button
                  className={`fav-heart${favorites.includes(urun.id) ? " active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(urun.id); }}
                >
                  <svg viewBox="0 0 24 24" fill={favorites.includes(urun.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button className="cart-overlay-btn" onClick={(e) => { e.stopPropagation(); sepeteEkle(urun.id); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Sepete Ekle
                </button>
              </div>
              <div className="product-card-body">
                <h3>{urun.name}</h3>
                <p className="price">{Number(urun.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
