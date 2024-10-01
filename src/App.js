import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import {  useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Apply from "./Pages/Apply";
import 'react-toastify/dist/ReactToastify.css';
import GiveFeedback from "./Pages/GiveFeedback";
import AddComplaint from "./Pages/addComplaint";
import RechargeCard from "./Pages/RechargeCard";
import Payment from "./Pages/Payment";
import Bookonline from "./Pages/Bookonline";
import GetOnlineBooking from "./Pages/GetonlineBookings";
import ViewCard from "./Pages/viewCard";

function App() {

  axios.defaults.withCredentials = true;
  const [isAuthenticated, setIsAuthenticated] = useState();
  
  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);
  return (
    <>
      <ToastContainer stacked />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={ < Login setIsAuthenticated={setIsAuthenticated} /> } />
          <Route path="/signup" element={< Register />} />
          <Route path="/applyForCard" element={isAuthenticated ? < Apply /> : <Navigate to="/" />} />         
          <Route path="/bookings" element={isAuthenticated ? < GetOnlineBooking /> : <Navigate to="/" />} />
          <Route path="/addComplaint" element={isAuthenticated ? < AddComplaint /> : <Navigate to="/" />} />
          <Route path="/rechargeCard" element={isAuthenticated ? < RechargeCard /> : <Navigate to="/" />} />
          <Route path="/payment" element={isAuthenticated ? <Payment /> : <Navigate to='/' />} />
          <Route path="/bookonline" element={isAuthenticated ? < Bookonline /> : <Navigate to="/" />} />
          <Route path="/viewcard" element={isAuthenticated ? < ViewCard /> : <Navigate to="/" />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />         
          <Route path="/giveFeedback" element={<GiveFeedback />} />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
