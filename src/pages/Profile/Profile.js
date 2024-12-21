import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {

  const { currentUser } = useAuth();

   if (!currentUser) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <>
    <div className='navbar'>
        <Link to="/">
            <button className="back-button">Geri Dön</button>
        </Link>
    </div>
    <div>
        <h4>Selam <h3 className="userText">{currentUser.username}</h3> Profil sayfanı buradan düzenleyebilirsin.</h4>
    </div>
    </>
  )
}
