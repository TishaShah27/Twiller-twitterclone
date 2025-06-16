import React, { useState } from "react";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useUserAuth } from "../../context/UserAuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [email, seteamil] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googleSignIn, logIn } = useUserAuth();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await logIn(email, password);
      navigate("/");
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
    }
  };

  const hanglegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img src={twitterimg} className="image" alt="twitterimg" />
        </div>
        <div className="form-container">
          <div className="form-box">
            <TwitterIcon style={{ color: "skyblue" }} />
            <h2 className="heading">{t("happening_now")}</h2>
            {error && <p>{error.message}</p>}
            <form onSubmit={handlesubmit}>
              <input
                type="email"
                className="email"
                placeholder={t("email_placeholder")}
                onChange={(e) => seteamil(e.target.value)}
              />
              <input
                type="password"
                className="password"
                placeholder={t("password_placeholder")}
                onChange={(e) => setpassword(e.target.value)}
              />

              <div style={{ width: "70%", textAlign: "right", marginTop: "5px" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--twitter-color)",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontWeight: "400",
                  }}
                >
                  {t("forgot_password")}
                </Link>
              </div>

              <div className="btn-login">
                <button type="submit" className="btn">
                  {t("Log in")}
                </button>
              </div>
            </form>
            <hr />
            <div>
              <GoogleButton className="g-btn" type="light" onClick={hanglegooglesignin} />
            </div>
          </div>
          <div>
            {t("Don't have an account?")}{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("Sign up")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
