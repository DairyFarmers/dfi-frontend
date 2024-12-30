import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { axiosPrivate } from './api/axios';
import { token_verification_path } from './api/config';
import { PrivateRoute } from "./components/common/PrivateRoute";
import Login from "./pages/Signin/SignIn";
import Home from "./pages/Home/Home";
import Error from "./pages/Error";
import { login } from "./redux/slices/userSlice";
import Password from "./pages/ForgotPassword/Password";
import Verification from "./pages/Verification/Verification";
import NewPassword from "./pages/NewPassword/NewPassword";

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
          <Home />
        </PrivateRoute>}/>
      <Route path="/forgotPassword" element={<Password/> }/>  
      <Route path="/verification" element={<Verification/> }/>
      <Route path="/newPassword" element={<NewPassword/> }/>
    </Routes>
  );
}

export default App;
