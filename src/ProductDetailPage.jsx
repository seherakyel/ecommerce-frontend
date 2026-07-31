import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [urun, setUrun] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((r) => r.json())
      .then((data) => setUrun(data));
  }, [id]);

  const sepeteEkle = () => {
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
      body: JSON.stringify({ product_id: urun.id, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => alert("Ürün sepete eklendi!"));
  };

  const shareUrl = window.location.href;
  const shareText = urun ? `${urun.name} - ${urun.price} TL` : "";

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link kopyalandı! Instagram'da paylaşabilirsin.");
  };

  if (!urun) return <p className="loading">Yükleniyor...</p>;

  return (
    <div className="page">
      <Link to="/" className="back-link">← Ürünlere Dön</Link>
      <div className="detail-layout">
        {urun.image_url ? (
          <img className="detail-img" src={urun.image_url} alt={urun.name} />
        ) : (
          <div className="detail-img-placeholder">Görsel yok</div>
        )}
        <div className="detail-card">
          <h1>{urun.name}</h1>
          <p className="description">{urun.description}</p>
          <p className="price">{urun.price} TL</p>
          <p className="stock">Stok: {urun.stock}</p>
          <button className="btn btn-primary" onClick={sepeteEkle}>Sepete Ekle</button>

          <div className="share-section">
            <p>Paylaş:</p>
            <div className="share-buttons">
              <button className="btn btn-outline btn-sm" onClick={shareWhatsApp}>WhatsApp</button>
              <button className="btn btn-outline btn-sm" onClick={shareTwitter}>X (Twitter)</button>
              <button className="btn btn-outline btn-sm" onClick={shareFacebook}>Facebook</button>
              <button className="btn btn-outline btn-sm" onClick={copyLink}>Linki Kopyala</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;