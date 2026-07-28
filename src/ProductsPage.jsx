import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SESSION_ID = "test-user";

function ProductsPage() {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((r) => r.json())
      .then((data) => setUrunler(data));
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: SESSION_ID, product_id: urunId, quantity: 1 }),
    })
      .then((r) => r.json())
      .then(() => alert("Ürün sepete eklendi!"));
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
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;