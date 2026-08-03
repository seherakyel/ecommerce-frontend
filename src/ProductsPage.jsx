import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./ProductsPage.css";

function ProductsPage() {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category_id") || "";
  const parentId = searchParams.get("parent_id") || "";

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

  // Ana kategorileri bir kez çek
  useEffect(() => {
    fetch("http://127.0.0.1:8000/categories/")
      .then((r) => r.json())
      .then((data) => setMainCategories(data));

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/favorites/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (Array.isArray(data)) setFavorites(data.map((f) => f.product.id)); });
    }
  }, []);

  // Bir ana kategori seçilince alt kategorilerini çek
  useEffect(() => {
    if (parentId) {
      fetch(`http://127.0.0.1:8000/categories/?parent_id=${parentId}`)
        .then((r) => r.json())
        .then((data) => setSubCategories(data));
    } else {
      setSubCategories([]);
    }
  }, [parentId]);

  // Ürünleri arama/kategori değişince çek
  useEffect(() => {
    fetchProducts();
  }, [search, categoryId]);

  const selectMainCategory = (id) => {
    navigate(`/?parent_id=${id}`);
  };

  const selectSubCategory = (id) => {
    navigate(`/?parent_id=${parentId}&category_id=${id}`);
  };

  const clearCategories = () => {
    navigate("/");
  };

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
      {/* Ana kategoriler */}
      <div className="category-bar">
        <button
          className={`category-btn${!parentId ? " active" : ""}`}
          onClick={clearCategories}
        >
          Tümü
        </button>
        {mainCategories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn${parentId == cat.id ? " active" : ""}`}
            onClick={() => selectMainCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Alt kategoriler (bir ana kategori seçiliyse) */}
      {subCategories.length > 0 && (
        <div className="subcategory-bar">
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              className={`subcategory-btn${categoryId == sub.id ? " active" : ""}`}
              onClick={() => selectSubCategory(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      <h1 className="page-title">Ürünler</h1>

      <div className="products-grid">
        {urunler.length === 0 ? (
          <p>Ürün bulunamadı.</p>
        ) : (
          urunler.map((urun) => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default ProductsPage;