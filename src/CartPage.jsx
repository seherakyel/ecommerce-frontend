import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SESSION_ID = "test-user";

function CartPage() {
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    fetch(`http://127.0.0.1:8000/cart/${SESSION_ID}`)
      .then((r) => r.json())
      .then((data) => setCart(data));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = (itemId) => {
    fetch(`http://127.0.0.1:8000/cart/items/${itemId}`, { method: "DELETE" })
      .then(() => fetchCart());
  };

  const updateQuantity = (itemId, newQuantity) => {
    fetch(
      `http://127.0.0.1:8000/cart/items/${itemId}?session_id=${SESSION_ID}&quantity=${newQuantity}`,
      { method: "PATCH" }
    ).then(() => fetchCart());
  };

  const placeOrder = () => {
    fetch("http://127.0.0.1:8000/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: SESSION_ID }),
    })
      .then((r) => r.json())
      .then((data) => {
        alert(`Sipariş oluşturuldu! Toplam: ${data.total} TL`);
        setCart([]);
      });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <Link to="/">← Ürünlere Dön</Link>
      <h1>Sepetim</h1>
      {cart.length === 0 ? (
        <p>Sepetin boş.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id}>
              <h3>{item.product.name}</h3>
              <p>{item.product.price} TL</p>
              <div>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span> {item.quantity} adet </span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)}>Sil</button>
            </div>
          ))}
          <h2>Toplam: {total} TL</h2>
          <button onClick={placeOrder}>Siparişi Tamamla</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;