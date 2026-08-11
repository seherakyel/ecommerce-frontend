import { API_URL } from "./config";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddressesPage.css";

function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleUnauth = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchAddresses = () => {
    fetch(`${API_URL}/addresses/`, {
      headers: authHeader(),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        return r.json();
      })
      .then((data) => { if (data) setAddresses(data); });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setTitle("");
    setFullAddress("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!title.trim() || !fullAddress.trim()) {
      setMessage("Lütfen tüm alanları doldurun.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const url = editingId
      ? `${API_URL}/addresses/${editingId}`
      : `${API_URL}/addresses/`;
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: authHeader(),
      body: JSON.stringify({ title, full_address: fullAddress }),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data) {
          fetchAddresses();
          resetForm();
          setMessage(editingId ? "Adres güncellendi." : "Adres eklendi.");
          setTimeout(() => setMessage(""), 3000);
        }
      })
      .catch(() => {
        setMessage("Bir hata oluştu.");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const handleEdit = (addr) => {
    setTitle(addr.title);
    setFullAddress(addr.full_address);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/addresses/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    }).then(() => fetchAddresses());
  };

  return (
    <div className="page">
      <Link to="/" className="back-link">← Ana Sayfa</Link>
      <h1 className="page-title">Adreslerim</h1>

      {message && <p className="address-message">{message}</p>}

      <div className="address-list">
        {addresses.length === 0 && !showForm && (
          <p className="empty-state">Henüz kayıtlı adresin yok.</p>
        )}

        {addresses.map((addr) => (
          <div className="address-card" key={addr.id}>
            <div className="address-card-body">
              <h3>{addr.title}</h3>
              <p>{addr.full_address}</p>
            </div>
            <div className="address-card-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEdit(addr)}>Düzenle</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(addr.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="address-form-card">
          <h2>{editingId ? "Adresi Düzenle" : "Yeni Adres Ekle"}</h2>
          <div className="form-group">
            <label>Adres Başlığı</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Ev, İş" />
          </div>
          <div className="form-group">
            <label>Adres</label>
            <textarea value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder="Tam adresinizi yazın" rows={3} />
          </div>
          <div className="address-form-actions">
            <button className="btn btn-primary" onClick={handleSave}>{editingId ? "Güncelle" : "Ekle"}</button>
            <button className="btn btn-outline" onClick={resetForm}>İptal</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary address-add-btn" onClick={() => setShowForm(true)}>
          + Yeni Adres Ekle
        </button>
      )}
    </div>
  );
}

export default AddressesPage;
