import React, { useState } from "react";
import axios from "axios";
import "./forgetpassword.css";
import TopBar from "./topbar";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError(t("forgotPassword.errorPasswordMismatch"));
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        emailOrPhone: input,
        password: password,
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error("Forgot Password Error:", err);
      if (err.response) {
        setError(err.response.data?.error || t("forgotPassword.serverError"));
      } else if (err.request) {
        setError(t("forgotPassword.noServerResponse"));
      } else {
        setError(t("forgotPassword.requestSetupError") + err.message);
      }
    }
  };

  return (
    <>
      <TopBar />
      <div className="forgot-container">
        <h2>{t("forgotPassword.resetPasswordTitle")}</h2>
        <p className="subtext">{t("forgotPassword.enterNewPasswordSubtext")}</p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("forgotPassword.emailPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("forgotPassword.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("forgotPassword.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">{t("forgotPassword.resetButton")}</button>
        </form>

        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default ForgotPassword;
