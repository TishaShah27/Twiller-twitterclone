import React, { useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import { useTranslation } from "react-i18next"; // ⬅️ Added

const Tweetbox = () => {
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
  const { t } = useTranslation(); // ⬅️ Added
  const email = user?.email;
  const userprofilepic = loggedinsuer[0]?.profileImage
    ? loggedinsuer[0].profileImage
    : user && user.photoURL;

  const handleuploadimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        setimageurl(res.data.data.display_url);
        setisloading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handletweet = (e) => {
    e.preventDefault();
    if (user?.providerData[0]?.providerId === "password") {
      fetch(`https://twitter-4093.onrender.com/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data[0]?.name);
          setusername(data[0]?.username);
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
    }

    if (name) {
      const userpost = {
        profilephoto: userprofilepic,
        post: post,
        photo: imageurl,
        username: username,
        name: name,
        email: email,
      };
      setpost("");
      setimageurl("");
      fetch("https://twitter-4093.onrender.com/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar src={userprofilepic} />
          <input
            type="text"
            placeholder={t("tweetbox.placeholder")} // ⬅️ Translated
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>
        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {isloading ? (
              <p>{t("tweetbox.uploading")}</p>
            ) : (
              <p>
                {imageurl ? t("tweetbox.uploaded") : <AddPhotoAlternateOutlinedIcon />}
              </p>
            )}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleuploadimage}
          />
          <Button className="tweetBox__tweetButton" type="submit">
            {t("tweetbox.button")} {/* ⬅️ Translated */}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;
