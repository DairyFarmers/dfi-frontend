import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { axiosPrivate } from './api/axios';
import { token_verification_path } from './api/config';
import { PrivateRoute } from "./Components/common/PrivateRoute";
import Login from "./pages/Signin/SignIn";
// import AdminLogin from "./pages/AdminSignin/AdminLogin";
import { useState } from "react";
import Dashboard from "./pages/Home/Home";
import Error from "./pages/Error";
import { login } from "./redux/slices/userSlice";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosPrivate.get(token_verification_path);

        if (response.status === 200) {
          dispatch(login(response.data.data));
        }
      } catch (err) {
        navigate('/', {
          state: { from: location },
          replace: true
        });
      }
    }
    fetchData();
  }, [isLoggedIn]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/error" element={<Error />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>} />
    </Routes>
  );
}

export default App;
