import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function Login() {
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate(); //Sayfa yönlendirme için useNavigate

  const handleLogin = async (e) => {
    e.preventDefault(); //Formun yenilenmesini engeller
    setLoading(true); //İşlem başlıyor
    try {
      //Firebase Authentication ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert(`Hoş geldin ${user.email}!`);
      navigate('/');
    } catch (error) {
      console.error("Giriş Hatası:", error.message);
      alert("Giriş sırasında bir hata oluştu.");
    } finally {
      setLoading(false); //İşlem tamamlandı
    }
  };

  return (
    <>
      <div className='navbar'>
          <Link to="/">
            <button className="back-button">Geri Dön</button>
          </Link>
      </div>
      <div>
        <h1>Giriş Yap</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <label className="login-form-label">
            E-posta:
            <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" name="email" className="login-form-input" />
          </label>
          <label className="login-form-label">
            Şifre:
            <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" name="password" className="login-form-input" />
          </label>
          <button
            type="submit"
            className="form-button"
            disabled={loading} //Butonu pasif yap
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </>
  )
}
