import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../Signin/SignIn.css";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { forgot_password_path } from "../../api/config";
import OrgIntro from "../../components/shared/OrgIntro";

const Password = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(true);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const navigate = useNavigate();

  const handleSignin = async () => {
    navigate("/")
  }

  const handleSend = async () => {
    try {
      const response = await axiosPrivate.post(forgot_password_path, {
        email: email
      });
  
      if (response.data.status) {
        navigate("/dashboard");
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
            {!isEmailSent ? (
              <div className="col-6">
                <div className="row bg_white">
                  <div className="col-12 ">
                    <div className="row">
                      <span className="logtx01">Forgot Password</span>
                    </div>
                    <div className="row mt-1">
                      <span className="logtx02 mb-3">Enter your email address to proceed...</span>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 all_center">
                        <div className="row col-7">
                          <label className="loglab mb-1">Email</label>
                          <input className="loginput" type="text" placeholder="Enter your Email"
                            value={email} onChange={handleEmail}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 all_center mt-3">
                        <div className="col-7 space_bet">
                          <span className="fog_tx" onClick={handleSignin}>Back to SignIn</span>
                          <button className="btn btn-dark" onClick={handleSend}>Verify</button>
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
                      <span className="logtx01">Forgot Password</span>
                    </div>
                    <div className="row mt-1">
                      <span className="logtx02 mb-3">An email has been sent to your email address. Please check your inbox...</span>
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

export default Password;
