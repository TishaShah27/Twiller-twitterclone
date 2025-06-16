import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Login/Signup";
import Feed from "./Pages/Feed/Feed";
import Explore from "./Pages/Explore/Explore";
import Notification from "./Pages/Notification/Notification";
import Message from "./Pages/Messages/Message";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Lists from "./Pages/Lists/Lists";
import Profile from "./Pages/Profile/Profile";
import LanguageSwitcher from "./Pages/LanguageSwitcher";
import More from "./Pages/more/More";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Bookmark from "./Pages/Bookmark/Bookmark";
import ForgotPassword from "./Pages/forgetpassword/forgetpassword";


//import AvatarComponent from "./Pages/Profile/Avatar/avatar"; 
import './i18n'; 


function App() {
  return (
    <div className="app">
      <UserAuthContextProvider>
        <div style={{ position: "absolute", top: 10, right: 20 }}>
          <LanguageSwitcher />
        </div>
        <Routes>
          <Route
            path="/" element={
              <ProtectedRoute>{" "}
                <Home />
              </ProtectedRoute>}
          >
            <Route index element={<Feed />} />
          </Route>
          <Route path="/home" element={<Home />}>
            <Route path="feed" element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notification" element={<Notification />} />
            <Route path="messages" element={<Message />} />
            <Route path="lists" element={<Lists />} />
            <Route path="bookmarks" element={<Bookmark />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} /> 
        </Routes>
        
  
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
