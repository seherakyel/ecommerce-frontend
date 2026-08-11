import { API_URL } from "./config";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Giriş başarısız");
        return r.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.access_token);
        setMessage("Giriş başarılı!");
        setTimeout(() => navigate("/"), 1000);
      })
      .catch(() => setMessage("E-posta veya şifre hatalı."));
  };

  return (
    <div className="page">
      <div className="form-card">
        <h1>Giriş Yap</h1>
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
        <button className="btn btn-primary" onClick={handleLogin}>Giriş Yap</button>
        <p className="form-message">{message}</p>
        <p className="form-footer">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;