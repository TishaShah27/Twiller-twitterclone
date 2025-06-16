import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import AvatarCustomization from "../Avatar/avatar"; // Adjust path as needed
import Switch from "@mui/material/Switch";
import { useTranslation } from "react-i18next";

const Mainprofile = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);
  const [useAvatar, setUseAvatar] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const handleOpenAvatarModal = () => setAvatarModalOpen(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/userpost?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setpost(data);
        });
    }
  }, [user?.email]);

  // avatar
  useEffect(() => {
    if (loggedinuser[0]) {
      const u = loggedinuser[0];
      if (u.avatar) setAvatarSvg(u.avatar);
      if (u.useAvatar !== undefined) setUseAvatar(u.useAvatar);
    }
  }, [loggedinuser]);

  const handleuploadcoverimage = (e) => {
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
        const url = res.data.data.display_url;
        const usercoverimage = {
          email: user?.email,
          coverimage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`https://twitter-4093.onrender.com/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(usercoverimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  const handleuploadprofileimage = (e) => {
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
        const url = res.data.data.display_url;
        const userprofileimage = {
          email: user?.email,
          profileImage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`https://twitter-4093.onrender.com/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  src={
                    loggedinuser[0]?.coverimage
                      ? loggedinuser[0].coverimage
                      : user && user.photoURL
                  }
                  alt=""
                  className="coverImage"
                />

                <div className="hoverCoverImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="image" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="image"
                      className="imageInput"
                      onChange={handleuploadcoverimage}
                    />
                  </div>
                </div>
              </div>

              {/* avatar */}
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    src={
                      useAvatar && avatarSvg
                        ? avatarSvg
                        : loggedinuser[0]?.profileImage
                        ? loggedinuser[0].profileImage
                        : user?.photoURL
                    }
                    alt=""
                    className="avatar"
                  />
                  <div className="hoverAvatarImage">
                    <div className="imageIcon_tweetButton">
                      <label htmlFor="profileImage" className="imageIcon">
                        {isloading ? (
                          <LockResetIcon className="photoIcon photoIconDisabled" />
                        ) : (
                          <CenterFocusWeakIcon className="photoIcon" />
                        )}
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        className="imageInput"
                        onChange={handleuploadprofileimage}
                      />
                    </div>
                  </div>
                </div>
                <Switch
                  checked={useAvatar}
                  onChange={() => {
                    const updatedValue = !useAvatar;
                    setUseAvatar(updatedValue);

                    axios
                      .post("http://localhost:5000/save-avatar", {
                        email: loggedinuser[0]?.email,
                        avatar: avatarSvg,
                        useAvatar: updatedValue,
                      })
                      .then(() => {
                        console.log("Avatar saved successfully");

                        // Refetch updated user
                        return axios.get(
                          `http://localhost:5000/loggedinuser?email=${loggedinuser[0]?.email}`
                        );
                      })
                      .then((response) => {
                        loggedinuser([response.data]); // assuming you're using useState
                      })
                      .catch((err) => {
                        console.error("Error saving avatar:", err);
                      });
                  }}
                  color="primary"
                />

                <span className="toggle-label">Use Avatar</span>
                {avatarModalOpen && (
                  <AvatarCustomization
                    onSave={(svg) => {
                      const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
                      setAvatarSvg(dataUri);
                      setAvatarModalOpen(false);
                      setUseAvatar(true);
                    }}
                    onClose={() => setAvatarModalOpen(false)}
                    userEmail={loggedinuser[0]?.email}
                  />
                )}

                <div className="userInfo">
                  <div>
                    <h3 className="heading-3">
                      {loggedinuser[0]?.name
                        ? loggedinuser[0].name
                        : user && user.displayname}
                    </h3>
                    <p className="usernameSection">@{username}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Editprofile user={user} loggedinuser={loggedinuser} />
                    <button
                      className="create-avatar-btn"
                      onClick={handleOpenAvatarModal}
                    >
                      {t("Create Avatar")}
                    </button>
                  </div>
                </div>

                <div className="infoContainer">
                  {loggedinuser[0]?.bio ? <p>{loggedinuser[0].bio}</p> : ""}
                  <div className="locationAndLink">
                    {loggedinuser[0]?.location ? (
                      <p className="suvInfo">
                        <MyLocationIcon /> {t("Location")}:{" "}
                        {loggedinuser[0].location}
                      </p>
                    ) : (
                      ""
                    )}
                    {loggedinuser[0]?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {t("Website")}:{" "}
                        {loggedinuser[0].website}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <h4 className="tweetsText">{t("Tweets")}</h4>
                <hr />
              </div>
              {post.map((p) => (
                <Post key={p._id || p.id} p={p} />
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;
