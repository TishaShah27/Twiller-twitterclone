import React, { useState } from "react";
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DoneIcon from "@mui/icons-material/Done";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu"; // 👈 Hamburger icon

import {
  Home as HomeIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationsNoneIcon,
  MailOutline as MailOutlineIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ListAlt as ListAltIcon,
  PermIdentity as PermIdentityIcon,
  More as MoreIcon,
} from "@mui/icons-material";

import "./sidebar.css";
import Customlink from "./Customlink";
import Sidebaroption from "./Sidebaroption";
import { useNavigate } from "react-router-dom";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import { useTranslation } from "react-i18next";

const Sidebar = ({ handlelogout, user }) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false); // 👈 For mobile sidebar toggle
  const [anchorEl, setAnchorEl] = useState(null);
  const openmenu = Boolean(anchorEl);
  const [loggedinuser] = useLoggedinuser();
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const result = user?.email?.split("@")[0];

  return (
    <>
      {/* Hamburger Icon */}
      <div className="hamburger">
        <IconButton onClick={handleMenuToggle}>
          <MenuIcon fontSize="medium" />
        </IconButton>
      </div>

      {/* Sidebar Container */}
      <div className={`sidebar-container ${menuOpen ? "open" : ""}`}>
        <div className="sidebar">
          <div className="sidebar__header">
      <TwitterIcon className="sidebar__twitterIcon" fontSize="large"/>
    </div>
          <Customlink to="/home/feed">
            <Sidebaroption active Icon={HomeIcon} text={t("sidebar.home")} />
          </Customlink>
          <Customlink to="/home/explore">
            <Sidebaroption Icon={SearchIcon} text={t("sidebar.explore")} />
          </Customlink>
          <Customlink to="/home/notification">
            <Sidebaroption Icon={NotificationsNoneIcon} text={t("sidebar.notifications")} />
          </Customlink>
          <Customlink to="/home/messages">
            <Sidebaroption Icon={MailOutlineIcon} text={t("sidebar.messages")} />
          </Customlink>
          <Customlink to="/home/bookmarks">
            <Sidebaroption Icon={BookmarkBorderIcon} text={t("sidebar.bookmarks")} />
          </Customlink>
          <Customlink to="/home/lists">
            <Sidebaroption Icon={ListAltIcon} text={t("sidebar.lists")} />
          </Customlink>
          <Customlink to="/home/profile">
            <Sidebaroption Icon={PermIdentityIcon} text={t("sidebar.profile")} />
          </Customlink>
          <Customlink to="/home/more">
            <Sidebaroption Icon={MoreIcon} text={t("sidebar.more")} />
          </Customlink>

          <Button variant="outlined" className="sidebar__tweet" fullWidth>
            {t("sidebar.tweet")}
          </Button>

          <div className="Profile__info">
            <Avatar
              src={
                loggedinuser[0]?.profileImage
                  ? loggedinuser[0].profileImage
                  : user?.photoURL
              }
            />
            <div className="user__info">
              <h4>{loggedinuser[0]?.name || user?.displayName}</h4>
              <h5>@{result}</h5>
            </div>
            <IconButton size="small" onClick={handleClick}>
              <MoreHorizIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openmenu} onClose={handleClose}>
              <MenuItem onClick={() => navigate("/home/profile")}>
                <Avatar src={user?.photoURL} />
                <div className="user__info subUser__info">
                  <div>
                    <h4>{user?.displayName}</h4>
                    <h5>@{result}</h5>
                  </div>
                  <DoneIcon />
                </div>
              </MenuItem>
              <Divider />
              <MenuItem>{t("sidebar.add_account")}</MenuItem>
              <MenuItem onClick={handlelogout}>{t("sidebar.logout")} @{result}</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
