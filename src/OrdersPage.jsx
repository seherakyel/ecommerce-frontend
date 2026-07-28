import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <Link to="/">← Ürünlere Dön</Link>
      <h1>Siparişlerim</h1>
      {orders.length === 0 ? (
        <p>Henüz siparişin yok.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h3>Sipariş #{order.id}</h3>
            <p>Tarih: {new Date(order.created_at).toLocaleString("tr-TR")}</p>
            <p>Durum: {order.status}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product_name} — {item.quantity} adet × {item.price} TL
                </li>
              ))}
            </ul>
            <p>
              <strong>Toplam: {order.total} TL</strong>
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;