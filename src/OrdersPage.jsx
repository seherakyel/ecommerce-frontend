import { API_URL } from "./config";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/orders/`, {
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
      <nav className="breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Siparişlerim</span>
      </nav>
      <h1 className="page-title">Siparişlerim</h1>
      {orders.length === 0 ? (
        <div className="empty-state-premium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <h2>Henüz verilmiş bir siparişiniz bulunmuyor</h2>
          <p>Sipariş verdikten sonra siparişlerinizi buradan takip edebilirsiniz.</p>
          <Link to="/" className="btn btn-primary">Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <h3>Sipariş #{order.id}</h3>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <span className={`order-status ${order.status}`}>{order.status === "pending" ? "Hazırlanıyor" : order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <span className="order-item-name">{item.product_name}</span>
                    <span className="order-item-detail">{item.quantity} adet × {Number(item.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span className="order-total">Toplam: {Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
