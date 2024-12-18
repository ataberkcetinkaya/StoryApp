import Home from './pages/Home/Home';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import { useEffect } from 'react';

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
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
  );
}

export default App;
