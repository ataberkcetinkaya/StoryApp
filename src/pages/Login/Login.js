import React from 'react'
import { Link } from 'react-router-dom'
import './Login.css';

export default function Login() {
  return (
    <>
      <div className='navbar'>
          <Link to="/">
            <button className="back-button">Geri Dön</button>
          </Link>
      </div>
      <div>
        <h1>Giriş Yap</h1>
        <form className="login-form">
          <label className="login-form-label">
            E-posta:
            <input type="email" name="email" className="login-form-input" />
          </label>
          <label className="login-form-label">
            Şifre:
            <input type="password" name="password" className="login-form-input" />
          </label>
          <button type="submit">Giriş Yap</button>
        </form>
      </div>
    </>
  )
}
