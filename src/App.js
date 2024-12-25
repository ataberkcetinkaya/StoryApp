import Home from './pages/Home/Home';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile/Profile';
import PrivateRoute from './routes/PrivateRoute'
import GuessTheNumber from './pages/Games/GuessTheNumber';

function App() {

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.add('white');
      localStorage.setItem('theme', 'white');
    }
  }, []);
  
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<PrivateRoute element={Profile}/>} />
          <Route path="/games/guess-the-number" element={<GuessTheNumber/>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
