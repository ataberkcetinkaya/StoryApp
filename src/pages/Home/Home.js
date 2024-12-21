import React from 'react'
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Home() {

  const changeTheme = () => {
    const body = document.body;
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      body.classList.add('white');
      localStorage.setItem('theme', 'white');
    } else {
      body.classList.remove('white');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const { currentUser, loading } = useAuth();

  return (
    <div>
      <div className='navbar'>
        {loading ? ( //Eğer loading durumu varsa, "Yükleniyor" veya "Spinner"
          <span>Yükleniyor...</span>
        ) : currentUser ? (
          <>
            <span>Hoşgeldiniz, {currentUser.username || currentUser.email}</span>
            <Link to="/profile"><button>Profil</button></Link>
            <button onClick={() => signOut(auth)}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/login"><button>Giriş Yap</button></Link>
            <Link to="/register"><button>Kayıt Ol</button></Link>
          </>
        )}
        <button onClick={changeTheme}>Tema</button>
      </div>
      <div>
        <h1>Anasayfa</h1>
        {currentUser ? (
          <p>Story App'e Hoşgeldin, <p className="currentUser">{currentUser.username}</p></p>
        ) : (
          <p>Merhaba, burası anasayfa.</p>
        )}
      </div>
    </div>
  );
}