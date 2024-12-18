import React from 'react'
import { Link } from 'react-router-dom';
import './Home.css';

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

  return (
    <>
      <div className='navbar'>
        <Link to="/login"><button>Giriş Yap</button></Link>
        <Link to="/register"><button>Kayıt Ol</button></Link>
        <button onClick={changeTheme}>Tema</button>
      </div>
      <div>
        <h1>Anasayfa</h1>
        <p>Merhaba, burası anasayfa.</p>
      </div>
    </>
  )
}
