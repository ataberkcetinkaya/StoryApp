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
  const [error, setError] = React.useState("");
  const [error2, setError2] = React.useState("");
  const [error3, setError3] = React.useState("");
  const [error4, setError4] = React.useState("");
  const [generalError, setGeneralError] = React.useState("");
  const [successRegister, setSuccessRegister] = React.useState(false);

  const navigate = useNavigate(); //Yönlendirme için useNavigate

  const resetErrors = () => {
    setError("");
    setError2("");
    setError3("");
    setError4("");
    setGeneralError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault(); //Formun yenilenmesini engeller
    resetErrors(); //Form gönderildiğinde tüm hata mesajlarını sıfırla
    setIsLoading(true); //İşlem başladı
    try {
      //Firebase Authentication ile kullanıcı oluştur
      const usernameExists = await isUsernameTaken(nickname); //username duplicate kontrolü
      if (usernameExists) {
        setError("Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.");
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

      setSuccessRegister("Kayıt başarılı!");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Hata:", error.message);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError2("Bu e-posta zaten kullanımda.");
          break;
        case "auth/invalid-email":
          setError3("Geçersiz bir e-posta adresi girdiniz.");
          break;
        case "auth/weak-password":
          setError4("Şifre en az 6 karakter olmalıdır.");
          break;
        default:
          setGeneralError("Kayıt sırasında bir hata oluştu: " + error.message);
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
            {error && <p className="registerError">{error}</p>}
          </label>
          <label className="register-form-label">
            E-posta:
            <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" name="email" className="register-form-input" />
            {error2 && <p className="registerError">{error2}</p>}
            {error3 && <p className="registerError">{error3}</p>}
          </label>
          <label className="register-form-label">
            Şifre:
            <input
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" name="password" className="register-form-input" />
            {error4 && <p className="registerError">{error4}</p>}
          </label>
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
          {successRegister && <p className="registerSuccess">{successRegister}</p>}
          {generalError && <p className="registerError">{generalError}</p>}
        </form>
      </div>
    </>
  )
}