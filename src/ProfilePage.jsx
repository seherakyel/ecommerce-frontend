import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  const fetchProfile = () => {
    fetch("http://127.0.0.1:8000/auth/me", {
      headers: authHeader(),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          setName(data.name || "");
          setEmail(data.email || "");
        }
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = () => {
    fetch("http://127.0.0.1:8000/auth/me", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ name, email }),
    })
      .then((r) => {
        if (r.status === 401) { handleUnauth(); return null; }
        if (!r.ok) throw new Error("Güncelleme başarısız");
        return r.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          setEditing(false);
          setMessage("Profil güncellendi.");
          setTimeout(() => setMessage(""), 3000);
        }
      })
      .catch(() => setMessage("Bir hata oluştu."));
  };

  if (!user) return <div className="page"><p>Yükleniyor...</p></div>;

  return (
    <div className="page">
      <Link to="/" className="back-link">← Ana Sayfa</Link>
      <h1 className="page-title">Profilim</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {editing ? (
          <div className="profile-form">
            <div className="form-group">
              <label>Ad Soyad</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" />
            </div>
            <div className="form-group">
              <label>E-posta</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" type="email" />
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={handleSave}>Kaydet</button>
              <button className="btn btn-outline" onClick={() => { setEditing(false); setName(user.name || ""); setEmail(user.email || ""); }}>İptal</button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="profile-row">
              <span className="profile-label">Ad Soyad</span>
              <span className="profile-value">{user.name || "—"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">E-posta</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <button className="btn btn-outline" onClick={() => setEditing(true)}>Düzenle</button>
          </div>
        )}

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;
