import React, { useEffect, useState } from "react";
import "./SignIn.css";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmployeeIdChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      if (!email) {
        window.alert("Invalid credentials");
        return;
      }
      if (!password) {
        window.alert("Invalid password");
        return;
      }

      const response = await axiosPrivate.post(login_path, {
        email: email,
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

   const [passwordVisibility, setPasswordVisibility] = useState(false);
  
    const togglePasswordVisibility = () => {
      setPasswordVisibility((prev) => !prev);
    };

   const [passwordVisibility, setPasswordVisibility] = useState(false);
  
    const togglePasswordVisibility = () => {
      setPasswordVisibility((prev) => !prev);
    };
  
  const handlePassword = async () => {
    navigate("/forgotPassword")
  }

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
                        <label className="loglab mb-1">Email</label>
                        <input className="loginput" type="text" placeholder="Enter your Email"
                          value={email} onChange={handleEmployeeIdChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12 all_center">
                      <div className="row col-7">
                        <label className="loglab mb-1">Password</label>
                        <input
                          className="loginput"
                          type={passwordVisibility ? "text" : "password"}
                          name="password"
                          placeholder="Enter your Password"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                        <div
                          className="toggle-password"
                          onClick={togglePasswordVisibility}
                        >
                          <img
                            className="mdieye-off-icon6"
                            alt=""
                            src={
                              passwordVisibility
                                ? "./Images/eye-icon.png"
                                : "./Images/eyeoff.svg"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12 all_center mt-3">
                      <div className="col-7 space_bet">
                        <span className="fog_tx" onClick={handlePassword}>Forgot password?</span>
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
