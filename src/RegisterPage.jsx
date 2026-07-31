import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    fetch("http://127.0.0.1:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Kayıt başarısız");
        return r.json();
      })
      .then(() => {
        setMessage("Kayıt başarılı! Giriş yapabilirsin.");
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch(() => setMessage("Bu e-posta zaten kayıtlı olabilir."));
  };

  return (
    <div className="page">
      <div className="form-card">
        <h1>Kayıt Ol</h1>
        <div className="form-group">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleRegister}>Kayıt Ol</button>
        <p className="form-message">{message}</p>
        <p className="form-footer">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;