import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function Register() {

  const [nickname, setNickname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate(); //Yönlendirme için useNavigate

  const handleRegister = async (e) => {
    e.preventDefault(); //Formun yenilenmesini engeller
    setIsLoading(true); //İşlem başladı
    try {
      //Firebase Authentication ile kullanıcı oluştur
      const usernameExists = await isUsernameTaken(nickname); //username duplicate kontrolü
      if (usernameExists) {
        alert("Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı deneyin.");
        setIsLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //Firestore'a kullanıcı adını kaydet
      await setDoc(doc(db, "users", user.uid), {
        username: nickname,
        email: email,
      });

      alert("Kayıt başarılı!");
      navigate('/');
    } catch (error) {
      console.error("Hata:", error.message);
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Bu e-posta zaten kullanımda.");
          break;
        case "auth/invalid-email":
          alert("Geçersiz bir e-posta adresi girdiniz.");
          break;
        case "auth/weak-password":
          alert("Şifre en az 6 karakter olmalıdır.");
          break;
        default:
          alert("Kayıt sırasında bir hata oluştu: " + error.message);
      }
    }
    finally {
      setIsLoading(false); //İşlem bitti
    }
  };

  const isUsernameTaken = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  };

  return (
    <>
      <div className='navbar'>
          <Link to="/">
            <button className="back-button">Geri Dön</button>
          </Link>
      </div>
      <div>
        <h1>Kayıt Ol</h1>
        <form className="register-form" onSubmit={handleRegister}>
          <label className="register-form-label">
            Kullanıcı Adı:
            <input
              required
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
              type="text" name="name" className="register-form-input" />
          </label>
          <label className="register-form-label">
            E-posta:
            <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" name="email" className="register-form-input" />
          </label>
          <label className="register-form-label">
            Şifre:
            <input
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" name="password" className="register-form-input" />
          </label>
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </>
  )
}