import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

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

  const [users, setUsers] = useState([]);  //Tüm kullanıcıları tutacak state

  useEffect(() => {
    //Kullanıcıları çekmek için Firestore'dan veri alıyoruz
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersList);  //State'e kaydediyoruz
        //console.log("Kullanıcılar başarıyla çekildi:", usersList);
      } catch (error) {
        console.error("Kullanıcılar çekilirken hata oluştu:", error);
      }
    };
    fetchUsers();
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

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

        <div className='kayitliKullanicilar' onClick={toggleDropdown}>
          <h2>Kayıtlı Kullanıcılar</h2>
            {users.length === 0 ? (
              <p>Henüz kullanıcı yok.</p>
            ) : (
            <ul className={isExpanded ? 'expanded' : ''}>
              {users.map((user, index) => (
                <li key={index}>
                  <img src={user.profilePhoto || "defaultProfilePic.jpg"} alt={user.username} style={{ width: 40, height: 40, borderRadius: "50%" }} />
                  <p>{user.username}</p>
                  <span>Son Giriş: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Bilinmiyor"}</span>
                </li>
              ))}
            </ul>
            )}
        </div>
        
      </div>
    
    </div>
  );
}