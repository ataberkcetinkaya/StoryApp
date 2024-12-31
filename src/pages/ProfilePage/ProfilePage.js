import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function ProfilePage() {
  const { username } = useParams(); //URL'den username alıyorum
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          console.error("Kullanıcı bulunamadı.");
          setUserData(null);
        }
      } catch (error) {
        console.error("Kullanıcı verileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <p>Yükleniyor...</p>;
  if (!userData) return <p>Kullanıcı bulunamadı.</p>;
  return (
    <div>
        <div className='navbar'>
            <Link to="/">
            <button className="back-button">Geri Dön</button>
            </Link>
        </div>

      <h1>{userData.username}</h1>
      <img
        src={userData.profilePhoto || "defaultProfilePic.jpg"}
        alt={userData.username}
        style={{ width: 100, height: 100, borderRadius: "50%" }}
      />
      <p>Takipçiler: {userData.followersCount || 0}</p>
      <p>Takip Edilen: {userData.followingCount || 0}</p>
      <p>Son Giriş: {userData.lastLoginDate || "Bilinmiyor"}</p>
    </div>
  )
}
