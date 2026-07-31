import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }
        return r.json();
      })
      .then((data) => { if (data) setOrders(data); });
  }, []);

  return (
    <div className="page">
      <Link to="/" className="back-link">← Ürünlere Dön</Link>
      <h1 className="page-title">Siparişlerim</h1>
      {orders.length === 0 ? (
        <p className="empty-state">Henüz siparişin yok.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <h3>Sipariş #{order.id}</h3>
                <span className="order-meta">Durum: {order.status}</span>
              </div>
              <p className="order-meta">Tarih: {new Date(order.created_at).toLocaleString("tr-TR")}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} — {item.quantity} adet × {item.price} TL
                  </li>
                ))}
              </ul>
              <p className="order-total">Toplam: {order.total} TL</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;