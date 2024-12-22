import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import './Profile.css';
import { uploadToCloudinary } from '../../utils/Cloudinary';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Profile() {

  const { currentUser } = useAuth();
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileError, setFileError] = React.useState("");
  const [blankInput, setBlankInput] = React.useState(false);
  const [successPhoto, setSuccessPhoto] = React.useState(false);
  const [errorPhoto, setErrorPhoto] = React.useState(false);

   if (!currentUser) {
    return <p>Yükleniyor...</p>;
  }

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

  return (
    <>
      <div className='navbar'>
        <Link to="/">
          <button className="back-button">Geri Dön</button>
        </Link>
      </div>
      <div className="profile-container">
        <h4>Selam <h3 className="userText">{currentUser.username}</h3> Profil sayfanı buradan düzenleyebilirsin.</h4>
        
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
    </>
  )
}
