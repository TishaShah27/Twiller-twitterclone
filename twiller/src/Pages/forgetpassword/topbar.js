import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./topbar.css";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const { t } = useTranslation();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <TwitterIcon className="twitter-icon" />
        <span className="topbar-title">{t("topBar.passwordResetTitle")}</span>
      </div>
    </div>
  );
};

export default TopBar;
