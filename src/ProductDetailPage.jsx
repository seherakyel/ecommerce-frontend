import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

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

  if (!urun) return <p>Yükleniyor...</p>;

  return (
    <div>
      <Link to="/">← Ürünlere Dön</Link>
      <h1>{urun.name}</h1>
      <p>{urun.description}</p>
      <h2>{urun.price} TL</h2>
      <p>Stok: {urun.stock}</p>
      <button onClick={sepeteEkle}>Sepete Ekle</button>

      <div>
        <p>Paylaş:</p>
        <button onClick={shareWhatsApp}>WhatsApp</button>
        <button onClick={shareTwitter}>X (Twitter)</button>
        <button onClick={shareFacebook}>Facebook</button>
        <button onClick={copyLink}>Linki Kopyala</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;