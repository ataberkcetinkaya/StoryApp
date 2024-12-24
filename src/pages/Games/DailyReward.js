import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import DailyRewardModal from './DailyRewardModal';

export default function DailyReward() {
  const [reward, setReward] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [message, setMessage] = useState('');
  const [lastLogin, setLastLogin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
      }
    });
  
    return () => unsubscribe();
  }, []);

  // formatDate fonksiyonunu buraya alıyoruz
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('Kullanıcı oturum açmamış.');
        return;
      }
  
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        console.log('Kullanıcı verisi:', userSnap.data());
        const data = userSnap.data();
        setLastLogin(data.lastLoginDate);
        setReward(data.dailyReward);
        setTotalReward(data.totalReward);
      } else {
        console.log('Kullanıcı verisi bulunamadı, yeni oluşturuluyor.');
        await setDoc(userRef, {
          lastLoginDate: null,
          dailyReward: 10,
          totalReward: 0,
        });
      }
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  };

  const handleDailyReward = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage('Giriş yapmalısınız.');
        setIsModalOpen(true);
        return;
      }
      
      const today = formatDate(new Date()); //Bugünün tarihi (DD-MM-YYYY)

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const lastLoginDate = data.lastLoginDate;
        let newReward = data.dailyReward || 10;
        let newTotalReward = data.totalReward || 0;
        let streakCount = data.streakCount || 0;

        if (lastLoginDate === today) {
          setMessage('Bugün zaten giriş yaptınız.');
          setIsModalOpen(true); //Modal'ı aç
          return;
        }

        if (lastLoginDate) {
          const lastLogin = new Date(lastLoginDate);
          const currentLogin = new Date(today);
          const diff = Math.floor(
            (currentLogin - lastLogin) / (1000 * 60 * 60 * 24)
          );

          if (diff === 1) {
            streakCount += 1;
            if (streakCount <= 7) {
              newReward *= 2;
            } else {
              newReward = 10;
              streakCount = 1;
            }
          } else {
            newReward = 10;
            streakCount = 1;
          }
        }

        newTotalReward += newReward;

        await updateDoc(userRef, {
          lastLoginDate: today,
          dailyReward: newReward,
          totalReward: newTotalReward,
          streakCount: streakCount,
        });

        setReward(newReward);
        setTotalReward(newTotalReward);
        setLastLogin(today);
        setMessage(`Günlük ödülünüz: ${newReward} puan. Toplam ödül: ${newTotalReward} puan.`);
        setIsModalOpen(true); //Modal'ı aç
      }
    } catch (error) {
      console.error('Günlük ödül verilemedi:', error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <button onClick={handleDailyReward}>
        Günlük Giriş Ödülünü Al
      </button>
      <DailyRewardModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        reward={reward} 
        totalReward={totalReward} 
        message={message} 
      />
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: 'orange' }}>Ödül Bilgileriniz:</h4>
        <p>Son Giriş Tarihi: {lastLogin ? lastLogin : 'Henüz giriş yapılmadı'}</p>
        <p>Günlük Ödül: {reward} puan</p>
        <p>Toplam Ödül: {totalReward} puan</p>
      </div>
    </div>
  );
}
