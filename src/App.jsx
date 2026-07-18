import { useState, useEffect } from "react";

const SESSION_ID = "test-user";

function App() {
  const [urunler, setUrunler] = useState([]);
  const [sepet, setSepet] = useState([]);
  const [aktifSayfa, setAktifSayfa] = useState("urunler");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((response) => response.json())
      .then((data) => setUrunler(data));
  }, []);

  const sepeteEkle = (urunId) => {
    fetch("http://127.0.0.1:8000/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: SESSION_ID,
        product_id: urunId,
        quantity: 1,
      }),
    })
      .then((response) => response.json())
      .then(() => alert("Ürün sepete eklendi!"));
  };

  const sepetiGetir = () => {
    fetch(`http://127.0.0.1:8000/cart/${SESSION_ID}`)
      .then((response) => response.json())
      .then((data) => {
        setSepet(data);
        setAktifSayfa("sepet");
      });
  };

  const sepettenSil = (itemId) => {
    fetch(`http://127.0.0.1:8000/cart/items/${itemId}`, {
      method: "DELETE",
    }).then(() => sepetiGetir());
  };

  const siparisVer = () => {
    fetch("http://127.0.0.1:8000/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: SESSION_ID }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Sipariş oluşturuldu! Toplam: ${data.total} TL`);
        setSepet([]);
      });
  };

  const sepetToplam = sepet.reduce(
    (toplam, item) => toplam + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <nav>
        <button onClick={() => setAktifSayfa("urunler")}>Ürünler</button>
        <button onClick={sepetiGetir}>Sepetim</button>
      </nav>

      {aktifSayfa === "urunler" && (
        <div>
          <h1>Ürünler</h1>
          {urunler.map((urun) => (
            <div key={urun.id}>
              <h3>{urun.name}</h3>
              <p>{urun.price} TL</p>
              <button onClick={() => sepeteEkle(urun.id)}>Sepete Ekle</button>
            </div>
          ))}
        </div>
      )}

      {aktifSayfa === "sepet" && (
        <div>
          <h1>Sepetim</h1>
          {sepet.length === 0 ? (
            <p>Sepetin boş.</p>
          ) : (
            <div>
              {sepet.map((item) => (
                <div key={item.id}>
                  <h3>{item.product.name}</h3>
                  <p>
                    {item.product.price} TL x {item.quantity} adet
                  </p>
                  <button onClick={() => sepettenSil(item.id)}>Sil</button>
                </div>
              ))}
              <h2>Toplam: {sepetToplam} TL</h2>
              <button onClick={siparisVer}>Siparişi Tamamla</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;