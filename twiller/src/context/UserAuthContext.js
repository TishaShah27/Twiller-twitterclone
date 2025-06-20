import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

const userAuthContext = createContext();

export function UserAuthContextProvider(props) {
  const [user, setUser] = useState({});

  // 🔹 Backend Login (your MongoDB API)
  async function customLogIn(email, password) {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      
      //setUser(res.data.user); // assuming your backend sends back user object
      setUser({
        email: res.data.user.email,
        username: res.data.user.username,
        name: res.data.user.name,
        phone: res.data.user.phone,
        uid: res.data.user.id,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }

  //signup

  async function signUp(email, password, username, name, phone) {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        email,
        password,
        username,
        name,
        phone,
      });

      // setUser(res.data.user);
      setUser({
        email: res.data.user.email,
        username: res.data.user.username,
        name: res.data.user.name,
        phone: res.data.user.phone,
        uid: res.data.user.id,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  }

  // 🔹 Google Sign-in (Firebase)
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function logOut() {
    return signOut(auth);
  }

  // Listen for Firebase login changes (Google users only)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth (Google)", currentUser);
      
      // if (currentUser) setUser(currentUser);
      if (currentUser) {
        setUser({
          email: currentUser.email,
          name: currentUser.displayName || "",
          uid: currentUser.uid,
          username: "", // you might not get this from Google
          phone: currentUser.phoneNumber || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        customLogIn,
        signUp,
        googleSignIn,
        logOut,
      }}
    >
      {props.children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
