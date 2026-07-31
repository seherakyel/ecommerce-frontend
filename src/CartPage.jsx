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
      <Link to="/" className="back-link">← Ürünlere Dön</Link>
      <h1 className="page-title">Sepetim</h1>
      {cart.length === 0 ? (
        <p className="empty-state">Sepetin boş.</p>
      ) : (
        <div>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.price} TL</p>
                </div>
                <div className="cart-item-controls">
                  <button className="btn-icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity} adet</span>
                  <button className="btn-icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Sil</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            {addresses.length === 0 ? (
              <p>
                Sipariş vermek için önce{" "}
                <Link to="/addresses">adres eklemelisin</Link>.
              </p>
            ) : (
              <div className="address-select">
                <label>Teslimat Adresi: </label>
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
            <h2>Toplam: {total} TL</h2>
            <button
              className="btn btn-primary"
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