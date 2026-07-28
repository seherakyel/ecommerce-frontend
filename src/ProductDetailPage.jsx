import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const SESSION_ID = "test-user";

function ProductDetailPage() {
  const { id } = useParams();
  const [urun, setUrun] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((r) => r.json())
      .then((data) => setUrun(data));
  }, [id]);

  const sepeteEkle = () => {
    fetch("http://127.0.0.1:8000/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: SESSION_ID, product_id: urun.id, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => alert("Ürün sepete eklendi!"));
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
    </div>
  );
}

export default ProductDetailPage;