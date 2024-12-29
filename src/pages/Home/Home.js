import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DailyReward from '../Games/DailyReward';
import GuessTheNumber from '../Games/GuessTheNumber';

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

  const [activeSection, setActiveSection] = useState("left");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderSection = () => {
    //mobile için
    if (isMobile) {
      switch (activeSection) {
        case "left":
          return (
            <div className="left-section">
              {currentUser ? (
                <>
                  <p>Story App'e Hoşgeldin, <p className="currentUser">{currentUser.username}</p></p>
                </>
              ) : (
                <p>Merhaba, burası anasayfa.</p>
              )}
            </div>
          );
        case "middle":
          return (
            <div className="middle-section">
              <GuessTheNumber />
            </div>
          );
        case "right":
          return (
            <div className="right-section">
              <h2>Günlük Ödül</h2>
              <DailyReward />
            </div>
          );
        default:
          return null;
      }
    } 
    //normalde 768px'den büyük ekranlar için
    else {
      return (
        <div className="homepage-grid">
          <div className="left-section">
            <div className='left-button-container'>
              <Link to="/">
                <button>Anasayfa</button>
              </Link>
              {currentUser ? (
                <Link to="/games/guess-the-number">
                  <button>Sayı Tahmin</button>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="middle-section">
              {currentUser ? (
                <>
                  <p>Story App'e Hoşgeldin, <p className="currentUser">{currentUser.username}</p></p>
                </>
              ) : (
                <p>Merhaba, burası anasayfa.</p>
              )}
          </div>
          <div className="right-section">
            <h2>Günlük Ödül</h2>
            <DailyReward />
          </div>
        </div>
      );
    }
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
            <button onClick={() => signOut(auth).then(() => {
              window.location.reload();
            })}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/login"><button>Giriş Yap</button></Link>
            <Link to="/register"><button>Kayıt Ol</button></Link>
          </>
        )}
        <button onClick={changeTheme}>Tema</button>
      </div>

      {renderSection()}

      {/* Alt Gezinti Barı */}
      {isMobile && (
        <div className="bottom-navbar">
          <button
            onClick={() => setActiveSection("left")}
            className={activeSection === "left" ? "active" : ""}
          >
            Anasayfa
          </button>
          <button
            onClick={() => setActiveSection("middle")}
            className={activeSection === "middle" ? "active" : ""}
          >
            Sayı Tahmin
          </button>
          <button
            onClick={() => setActiveSection("right")}
            className={activeSection === "right" ? "active" : ""}
          >
            Günlük Ödül
          </button>
        </div>
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
                  <span>Son Giriş: {user.lastLoginDate ? user.lastLoginDate : "Bilinmiyor"}</span>
                  <p style={{marginLeft: '5px'}}>Puan: {user.totalReward}</p>
                </li>
              ))}
            </ul>
            )}
        </div>
    
    </div>
  );
}