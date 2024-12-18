import React, { useCallback, useEffect, useState } from "react";
import "./SignIn.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { axiosPrivate } from "../../api/axios";
import { login_path } from "../../api/config";
import { login } from "../../redux/slices/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn]);

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      if (!employeeId) {
        window.alert("Invalid credentials");
        return;
      }
      if (!password) {
        window.alert("Invalid password");
        return;
      }
      
      const response = await axiosPrivate.post(login_path, {
        email: employeeId,
        password: password
      });

      if (response.data.status) {
        dispatch(login(response.data.data));
        navigate("/dashboard");
      } else {
        navigate("/error", { replace: true });
      }
    } catch (error) {
      navigate("/error", { replace: true });
    }
  };

return (
  <div>
    <div className="row">
      <div className="bg_black col-12">
        <div className="row">
          {/* Right Side Content */}
          <div className="col-6">
            <div className="row bg_white">
              <div className="col-12 ">
                <div className="row">
                  <span className="logtx01">Login to your account</span>
                </div>
                <div className="row mt-1">
                  <span className="logtx02 mb-3">Enter your organizational credentials to proceed</span>
                </div>
                <div className="row mt-4">
                  <div className="col-12 all_center">
                    <div className="row col-7">
                      <label className="loglab mb-1">Employee ID</label>
                      <input className="loginput" type="text" placeholder="Enter your Employee ID"
                        value={employeeId} onChange={handleEmployeeIdChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12 all_center">
                    <div className="row col-7">
                      <label className="loglab mb-1">Password</label>
                      <input className="loginput" type="password"
                        placeholder="Enter your Password" value={password} onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12 all_center mt-3">
                    <div className="col-7 space_bet">
                      <span className="fog_tx">Forgot password?</span>
                      <button className="btn btn-dark" onClick={handleLogin}>Login</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row upbox">
              <span className="logotx"><img className="me-2" src="./images/logo.png" alt="" />DAIRY FARMER CO.</span>
            </div>
            <div className="row botbox">
              <span className="bottx ">Revolutionizing poultry farming with our non-invasive pre-incubation gender determination system, utilizing machine learning for efficient and ethical chick sexing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;
