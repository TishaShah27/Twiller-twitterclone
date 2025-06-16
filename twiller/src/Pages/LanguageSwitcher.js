import React, { useState } from "react";
import { useTranslation } from "react-i18next";
//import { initializeApp } from "firebase/app";
//import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../context/firebase";
import "./Languageswitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [showOtpModal, setShowOtpModal] = useState(false);
  //const auth = getAuth();
  const [contact, setContact] = useState(""); // email or phone
  const [otp, setOtp] = useState("");
  const [contactType, setContactType] = useState("mobile"); // 'email' or 'mobile'
  const [phoneExists, setPhoneExists] = useState(false);
  const { user } = useUserAuth();
  const userEmail = user?.email || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");


  // When language changes, handle OTP logic
  const handleLanguageChange = async (e) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    setOtp("");
    setContact("");

    if (selectedLang === "fr") {
      setContactType("email");
      setShowOtpModal(true);
      // You can prefill email or ask user input
      setContact(userEmail);
    } else {
      setContactType("mobile");
      // Check if user phone exists
      try {
        const res = await fetch(
          `https://twitter-4093.onrender.com/loggedinuser?email=${userEmail}`
        );
        const data = await res.json();
        if (data.phone) {
          setPhoneExists(true);
          setContact(data.phone);
          // Send OTP immediately to existing phone
          await sendOtpToPhone(data.phone);
          setShowOtpModal(true);
        } else {
          setPhoneExists(false);
          // Ask user to add phone first
          setContact("");
          setShowOtpModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch user phone:", error);
      }
    }
  };

  // Send OTP for phone
  const sendOtpToPhone = async (phoneNumber) => {
    try {
      const appVerifier = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setMessage("OTP sent to phone.");
    } catch (error) {
      console.error("Firebase OTP error:", error);
      setMessage("Error sending OTP: " + error.message);

    }
  };

  // Send OTP for email (French)
  const sendOtpToEmail = async () => {
    setLoading(true);
    setMessage("Sending OTP to email...");
    try {
      const res = await fetch("http://localhost:5000/send-otp-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setMessage("OTP sent to email.");
    } catch (error) {
      setMessage("Error sending OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    // console.log(" setupRecaptcha called");
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // console.log("reCAPTCHA solved:", response);
          },
        }
      );
    }
    return window.recaptchaVerifier;
  };

  // Handle sending OTP button click
  const handleSendOtp = async () => {
    if (contactType === "mobile") {
    if (!/^\d{10}$/.test(contact)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    } else {
      setPhoneError(""); // clear previous errors
    }
  }
    if (contactType === "email") {
      await sendOtpToEmail();
    } else {
      if (!phoneExists) {
        // Add phone before sending OTP
        try {
          const res = await fetch("http://localhost:5000/update-phone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: contact }),
          });
          if (!res.ok) throw new Error("Failed to update phone");
          setPhoneExists(true);
          await sendOtpToPhone(contact);
        } catch (error) {
          alert("Error updating phone: " + error.message);
          return;
        }
      } else {
        await sendOtpToPhone(contact);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (contactType === "email") {
      setLoading(true);
      setMessage("Verifying OTP...");
      try {
        const res = await fetch("http://localhost:5000/verify-otp-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: contact, otp }),
        });

        if (!res.ok) {
          const err = await res.json();
          setMessage("OTP verification failed: " + err.error);
          return;
        }

        i18n.changeLanguage(lang);
        setShowOtpModal(false);
        setMessage("Language changed successfully.");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (error) {
        setMessage("OTP verification failed: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      
      try {
        const result = await window.confirmationResult.confirm(otp);
        if (!result.user) throw new Error("Invalid OTP");

        i18n.changeLanguage(lang);
        setShowOtpModal(false);
        setMessage("Language changed successfully.");
        setTimeout(() => {
          setMessage("");
}, 3000);
      } catch (error) {
        setMessage("OTP verification failed: " + error.message);
      }
    }
  };

  return (
    <div>
      <select value={lang} onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="hi">Hindi</option>
        <option value="pt">Portuguese</option>
        <option value="zh">Chinese</option>
      </select>
      {showOtpModal && (
        <div className="otp-modal">
          <button className="close-btn" onClick={() => setShowOtpModal(false)}>×</button>
          <h3>Verify {contactType}</h3>
          {loading && <p className="loading-text">⏳ {message}</p>}
          {!loading && message && <p className="info-text">{message}</p>}
          {contactType === "mobile" && (
            <div className="test-number-info">
              <p>
                <strong>⚠️ Test Mode:</strong> This system uses Firebase Phone Auth.
              </p>
              <p>
                Use test number: <code>+91 9999999999</code>
              </p>
              <p>
                Use test OTP code: <code>123456</code>
              </p>
              <hr />
              <p>
                {" "}
                Using real phone numbers will trigger actual SMS OTPs and incur
                Firebase billing costs.
              </p>
              <p>
                This setup is intended for testing only. To enable production
                use, a paid Firebase plan is required.
              </p>
            </div>
          )}
            {(contactType === "email" || phoneExists === false) && (
              <>
            <input
              type={contactType === "email" ? "email" : "tel"}
              placeholder={
                contactType === "email" ? "Enter your email" : "eg. 947XXXXXXX"
              }
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            {phoneError && <p className="error-text">{phoneError}</p>}
            </>
          )}
          <button onClick={handleSendOtp}>Send OTP</button>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>
            Verify OTP & Switch Language
          </button>
        </div>
      )}
      <div id="recaptcha-container" style={{ position: "absolute", zIndex: -1 }}></div>
    </div>
  );
}
