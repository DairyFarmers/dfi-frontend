
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../Signin/SignIn.css";
import "./Verification.css";
import OrgIntro from "../../components/shared/OrgIntro";
import { axiosPrivate } from "../../api/axios";
import { email_verification_path, verification_code_path } from "../../api/config";

const Verification = () => {
  const navigate = useNavigate();
  const user_id = useSelector((state) => state.user.user_id);
  const isEmailVerified = useSelector((state) => state.user.is_verified);

  useEffect(() => {
    if (isEmailVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [isEmailVerified]);

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow numbers
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to the next input if value is entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "") {
      // Move focus to the previous input on backspace
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleCodeSend = async () => {
    try {
      const response = await axiosPrivate.post(verification_code_path, {
        uid: user_id
      });
  
      if (response.data.status) {
        alert("Code sent")
      } else {
        alert("Error sending code")
      }
    } catch (error) {
      alert("Error sending code")
    }
  }

  const onSend = async () => {
    try {
      const response = await axiosPrivate.post(email_verification_path, {
        code: code.join("")
      });
  
      if (response.data.status) {
        navigate("/dashboard");
      } else {
        alert("Invalid code");
      }
    } catch (error) {
      alert("Invalid code");
    }
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
                    <span className="logtx01">Verification</span>
                  </div>
                  <div className="row mt-1">
                    <span className="logtx02 mb-3">Please verify your email address to proceed...</span>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12 all_center">
                      <div className="row col-7">
                        <label className="loglab mb-1" id="code">Enter Verification Code</label>
                        <div className="verification-code-container">
                          {code.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleChange(e.target.value, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              ref={(el) => (inputRefs.current[index] = el)}
                              className="verification-code-input"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="code">
                      Send verification code to your email
                      <span onClick={handleCodeSend}>
                        Send
                      </span>
                    </div>
                    <div className="col-12 all_center mt-3">
                      <div className="col-7 space_bet" id="send">
                        <button className="btn btn-dark" onClick={onSend}>Send</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <OrgIntro />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
