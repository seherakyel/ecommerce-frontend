import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const navigate = useNavigate();

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleUnauth = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchCart = () => {
    fetch("http://127.0.0.1:8000/cart/", {
      headers: authHeader(),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        return r.json();
      })
      .then((data) => { if (data) setCart(data); });
  };

  const fetchAddresses = () => {
    fetch("http://127.0.0.1:8000/addresses/", {
      headers: authHeader(),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setAddresses(data);
          if (data.length > 0) setSelectedAddressId(data[0].id);
        }
      });
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const removeItem = (itemId) => {
    fetch(`http://127.0.0.1:8000/cart/items/${itemId}`, {
      method: "DELETE",
      headers: authHeader(),
    }).then(() => fetchCart());
  };

  const updateQuantity = (itemId, newQuantity) => {
    fetch(
      `http://127.0.0.1:8000/cart/items/${itemId}?quantity=${newQuantity}`,
      { method: "PATCH", headers: authHeader() }
    ).then(() => fetchCart());
  };

  const placeOrder = () => {
    if (!selectedAddressId) {
      alert("Lütfen bir teslimat adresi seçin.");
      return;
    }

    fetch("http://127.0.0.1:8000/orders/", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ address_id: selectedAddressId }),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        if (!r.ok) throw new Error("Sipariş oluşturulamadı");
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        alert(`Sipariş oluşturuldu! Toplam: ${data.total} TL`);
        setCart([]);
      })
      .catch((err) => alert(err.message));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Sepetim</span>
      </nav>
      <h1 className="page-title">Sepetim</h1>
      {cart.length === 0 ? (
        <div className="empty-state-premium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>Sepetiniz boş</h2>
          <p>Sepetinize ürün ekleyerek alışverişe başlayabilirsiniz.</p>
          <Link to="/" className="btn btn-primary">Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img" onClick={() => navigate(`/urun/${item.product.id}`)}>
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} />
                  ) : (
                    <div className="cart-item-img-placeholder" />
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 onClick={() => navigate(`/urun/${item.product.id}`)}>{item.product.name}</h3>
                  <p className="cart-item-price">{Number(item.product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</p>
                  <div className="cart-item-bottom">
                    <div className="cart-item-qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Kaldır
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <h2>Sipariş Özeti</h2>

            <div className="cart-summary-row">
              <span>Ürünler ({cart.length})</span>
              <span>{Number(total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</span>
            </div>
            <div className="cart-summary-row">
              <span>Kargo</span>
              <span className="cart-free-shipping">Ücretsiz</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Toplam</span>
              <span>{Number(total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</span>
            </div>

            {addresses.length === 0 ? (
              <p className="cart-address-warn">
                Sipariş vermek için <Link to="/addresses">adres eklemelisin</Link>.
              </p>
            ) : (
              <div className="cart-address-select">
                <label>Teslimat Adresi</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.title} - {addr.full_address}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="cart-checkout-btn"
              onClick={placeOrder}
              disabled={addresses.length === 0}
            >
              Siparişi Tamamla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
