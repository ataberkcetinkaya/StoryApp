import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>; //Kullanıcı verisi yüklenirken gösterilen ekran
  }

  //Kullanıcı giriş yaptıysa, verilen component'i render et
  return currentUser ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
