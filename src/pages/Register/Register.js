import React from 'react'
import { Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  return (
    <>
      <div className='navbar'>
          <Link to="/">
            <button className="back-button">Geri Dön</button>
          </Link>
      </div>
      <div>
        <h1>Kayıt Ol</h1>
        <form className="register-form">
          <label className="register-form-label">
            Ad Soyad:
            <input type="text" name="name" className="register-form-input" />
          </label>
          <label className="register-form-label">
            E-posta:
            <input type="email" name="email" className="register-form-input" />
          </label>
          <label className="register-form-label">
            Şifre:
            <input type="password" name="password" className="register-form-input" />
          </label>
          <button type="submit" className="form-button">Kayıt Ol</button>
        </form>
      </div>
    </>
  )
}