import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./login.css";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const { t } = useTranslation();

  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState("");
  const [password, setpassword] = useState("");
  const { signUp } = useUserAuth();
  const { googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await signUp(email, password);
      const user = { username, name, email };
      fetch("https://twiller-twitterclone-ku86.onrender.com/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            console.log(data);
            navigate("/");
          }
        });
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
          <img className="image" src={twitterimg} alt="twitterimage" />
        </div>

        <div className="form-container">
          <div>
            <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
            <h2 className="heading">{t("signup.happeningNow")}</h2>
            <div className="d-flex align-items-sm-center">
              <h3 className="heading1">{t("signup.joinToday")}</h3>
            </div>
            {error && <p className="errorMessage">{error}</p>}

            <form onSubmit={handlesubmit}>
              <input
                className="display-name"
                type="username"
                placeholder={t("signup.usernamePlaceholder")}
                onChange={(e) => setusername(e.target.value)}
              />
              <input
                className="display-name"
                type="name"
                placeholder={t("signup.fullNamePlaceholder")}
                onChange={(e) => setname(e.target.value)}
              />
              <input
                className="email"
                type="email"
                placeholder={t("signup.emailPlaceholder")}
                onChange={(e) => setemail(e.target.value)}
              />
              <input
                className="password"
                type="password"
                placeholder={t("signup.passwordPlaceholder")}
                onChange={(e) => setpassword(e.target.value)}
              />
              <div className="btn-login">
                <button type="submit" className="btn">
                  {t("signup.signUpButton")}
                </button>
              </div>
            </form>

            <hr />
            <div className="google-button">
              <GoogleButton className="g-btn" type="light" onClick={hanglegooglesignin} />
            </div>

            <div>
              {t("signup.alreadyAccount")}{" "}
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "var(--twitter-color)",
                  fontWeight: "600",
                  marginLeft: "5px",
                }}
              >
                {t("signup.loginLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
