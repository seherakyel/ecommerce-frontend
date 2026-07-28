import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch("http://127.0.0.1:8000/auth/login", {
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
    <div>
      <h1>Giriş Yap</h1>
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Giriş Yap</button>
      <p>{message}</p>
      <p>
        Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </div>
  );
}

export default LoginPage;