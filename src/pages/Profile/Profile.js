import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import './Profile.css';
import { uploadToCloudinary } from '../../utils/Cloudinary';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import GuessTheNumber from '../Games/GuessTheNumber';

export default function Profile() {

  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [blankInput, setBlankInput] = useState(false);
  const [successPhoto, setSuccessPhoto] = useState(false);
  const [errorPhoto, setErrorPhoto] = useState(false);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; 

  const handleFileChange = (e) => {
    const file = e.target.files[0]; //Kullanıcı tarafından seçilen dosya
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("Dosya boyutu çok büyük! Lütfen 1MB'den küçük bir dosya seçin.");
        setFile(null); //Hatalı dosyayı sıfırla
        return; //Dosya boyutu büyükse, işlemi durdur
      }
      setFile(file); //Dosya boyutu uygun ise, durumu güncelle
      setFileError(""); //Hata mesajını temizle
    }
  };

  const handleUpload = async () => {
    setFileError(""); //Hata mesajını temizle
    setBlankInput(""); //Hata mesajını temizle
    if (!file) {
      setBlankInput("Lütfen bir fotoğraf seçin!");
      return;
    }
    setIsUploading(true);

    try {
      const photoURL = await uploadToCloudinary(file);
      if (!photoURL) throw new Error("Fotoğraf yüklenemedi!");

      //Firestore'da kullanıcı profilini güncelle
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, { profilePhoto: photoURL })
      
      setSuccessPhoto("Profil fotoğrafı başarıyla güncellendi!");
      setTimeout(() => {
        window.location.reload(); //Sayfayı yenile
      }, 1500);
    } catch (error) {
      console.error("Fotoğraf yükleme hatası:", error);
      setErrorPhoto("Bir hata oluştu!");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [activeSection, setActiveSection] = useState("middle");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeComponent, setActiveComponent] = useState(null);

  //Tüm buton ve ilgili bileşenler
  const buttons = [
    { name: 'Anasayfa', component: 'Home', content: null },
    { name: 'Sayı Tahmin', component: 'GuessTheNumber', content: <GuessTheNumber /> },
  ];

  const renderSection = () => {
      //mobile için
      if (isMobile) {
        switch (activeSection) {
          case "left":
            return (
              <div className="left-section">
                <div className='left-button-container'>
                  <h3>Yazdıklarım</h3>
                </div>
              </div>
            );
          case "middle":
            return (
              <div className="middle-section">
              {/* Profil Fotoğrafı */}
              <div className="photo-container">
                {currentUser?.photoURL && (
                  <img 
                    className="profilePhoto" 
                    src={currentUser?.photoURL} 
                    alt="Profil Fotoğrafı" 
                  />
                )}
              </div>

              <div className="profile-container">
                <h4>Selam <h3 className="userText">{currentUser.username}</h3> Profil sayfanı buradan düzenleyebilirsin.</h4>
                {/* Dosya Seçme ve Yükleme Butonları */}
                <div className="upload-container">
                  <input type="file" onChange={handleFileChange} />
                  {fileError && <p className="errorMessage">{fileError}</p>} {/* Hata mesajı */}
                  {blankInput && <p className="errorMessage">{blankInput}</p>} {/* Hata mesajı */}
                  <button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Yükleniyor..." : "Yükle"}
                  </button>
                  {successPhoto && <p className="successMessage">{successPhoto}</p>}
                  {errorPhoto && <p className="errorMessage">{errorPhoto}</p>}
                </div>
              </div>

            </div>
            );
          case "right":
            return (
              <div className="right-section">
                <h2>Takipçiler</h2>
                <h2>Takip Edilenler</h2>
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
                <h3>Yazdıklarım</h3>
              </div>
            </div>
            <div className="middle-section">
              {/* Profil Fotoğrafı */}
              <div className="photo-container">
                {currentUser?.photoURL && (
                  <img 
                    className="profilePhoto" 
                    src={currentUser?.photoURL} 
                    alt="Profil Fotoğrafı" 
                  />
                )}
              </div>

              <div className="profile-container">
                <h4>Selam <h3 className="userText">{currentUser.username}</h3> Profil sayfanı buradan düzenleyebilirsin.</h4>
                {/* Dosya Seçme ve Yükleme Butonları */}
                <div className="upload-container">
                  <input type="file" onChange={handleFileChange} />
                  {fileError && <p className="errorMessage">{fileError}</p>} {/* Hata mesajı */}
                  {blankInput && <p className="errorMessage">{blankInput}</p>} {/* Hata mesajı */}
                  <button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Yükleniyor..." : "Yükle"}
                  </button>
                  {successPhoto && <p className="successMessage">{successPhoto}</p>}
                  {errorPhoto && <p className="errorMessage">{errorPhoto}</p>}
                </div>
              </div>

            </div>
            <div className="right-section">
              <h2>Takipçiler</h2>
              <h2>Takip Edilenler</h2>
            </div>
          </div>
        );
      }
    };

    if (!currentUser) {
      return <p>Yükleniyor...</p>;
    }

  return (
    <div>
      <div className='navbar'>
        <Link to="/">
          <button className="back-button">Geri Dön</button>
        </Link>
      </div>

      {renderSection()}

      {/* Alt Gezinti Barı */}
      {isMobile && (
        <div className="bottom-navbar">
          <button
            onClick={() => setActiveSection("left")}
            className={activeSection === "left" ? "active" : ""}
          >
            Yazdıklarım
          </button>
            {currentUser ? (
            <button
            onClick={() => setActiveSection("middle")}
            className={activeSection === "middle" ? "active" : ""}
          >
            Bilgilerim
          </button>
            ): <></>
          }
          <button
            onClick={() => setActiveSection("right")}
            className={activeSection === "right" ? "active" : ""}
          >
            Takipçiler & Takip Edilenler
          </button>
        </div>
      )}
    </div>
  )
}
