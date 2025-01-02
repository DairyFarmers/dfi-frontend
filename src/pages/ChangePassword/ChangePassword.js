import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Signin/SignIn.css";
import "./ChangePassword.css";
import { axiosPrivate } from "../../api/axios";
import { reset_password_path } from "../../api/config";
import OrgIntro from "../../components/shared/OrgIntro";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const handleSignin = () => {
    navigate("/");
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisibility((prev) => !prev);
  };

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prev) => !prev);
  }

  const handleChangePassword = async () => {
    try {
      const response = await axiosPrivate.post(reset_password_path, {
        password: newPassword,
        uid: uid,
        token: token
      });
  
      if (response.data.status) {
        setIsPasswordReset(true);
      } else {
        navigate("/error", { replace: true });
      }
    } catch (error) {
      navigate("/error", { replace: true });
    }
  }

  return (
    <div>
      <div className="row">
        <div className="bg_black col-12">
          <div className="row">
            {!isPasswordReset ? (
              <div className="col-6">
                <div className="row bg_white">
                  <div className="col-12 ">
                    <div className="row">
                      <span className="logtx01">New Password</span>
                    </div>
                    <div className="row mt-1">
                      <span className="logtx02 mb-3">Enter your new password...</span>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 all_center">
                        <div className="row col-7">
                          <label className="loglab mb-1">New Password</label>
                          <input
                            className="loginput"
                            type={newPasswordVisibility ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter your NewPassword"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                          />
                          <div
                            className="toggle-password"
                            onClick={toggleNewPasswordVisibility}
                          >
                            <img
                              className="mdieye-off-icon6"
                              alt=""
                              src={
                                newPasswordVisibility
                                  ? "./Images/eye-icon.png"
                                  : "./Images/eyeoff.svg"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 all_center">
                        <div className="row col-7">
                          <label className="loglab mb-1">Confirm New Password</label>
                          <input
                            className="loginput"
                            type={passwordVisibility ? "text" : "password"}
                            name="password"
                            placeholder="Enter your Confirm Password"
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
                        <div className="col-7 space_bet" id="send">
                          <button className="btn btn-dark" id="button" onClick={handleChangePassword}>Change Password</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-6">
                <div className="row bg_white">
                  <div className="col-12 ">
                    <div className="row">
                      <span className="logtx01">New Password</span>
                    </div>
                    <div className="row mt-1">
                      <span className="logtx02 mb-3">Your password has been changed successfully...</span>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 all_center mt-3">
                        <div className="col-7 space_bet">
                          <span className="fog_tx" onClick={handleSignin}>Back to SignIn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-6">
              <OrgIntro />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
