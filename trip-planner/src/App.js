import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';
import { checkLoginStatus } from './helper';

export default function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login /> } />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound /> } />
    </Routes>
    {!checkLoginStatus && <NavBar />}
  </Router>
}