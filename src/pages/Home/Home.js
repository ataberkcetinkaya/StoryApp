import React, { useContext } from 'react'
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

  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Başarıyla çıkış yapıldı!');
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error);
      alert('Çıkış yapılamadı. Lütfen tekrar deneyin.');
    }
  };

  return (
    <>
      <div className='navbar'>
        {currentUser ? (
          <>
            <span>Hoşgeldin, {currentUser.username}</span>
            <button onClick={handleLogout}>Çıkış Yap</button>
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
          <>
            <p>Story App'e Hoşgeldin {currentUser.username}</p>
          </>
        ) : (
          <>
            <p>Merhaba, burası anasayfa.</p>
          </>
        )}
      </div>
    </>
  )
}
