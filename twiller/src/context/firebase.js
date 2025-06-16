
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmNaYQj7yJEgRdO8mD2lgeUlySMTF22pc",
  authDomain: "twillerv2.firebaseapp.com",
  projectId: "twillerv2",
  storageBucket: "twillerv2.firebasestorage.app",
  messagingSenderId: "843679836417",
  appId: "1:843679836417:web:8b938b74d0d4da34a4d300",
  measurementId: "G-R1YLD3YKNP"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app
// const analytics = getAnalytics(app); 
