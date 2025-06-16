import React from "react";
import '../pages.css';
import { useTranslation } from "react-i18next";

const Message = () => {
  const { t } = useTranslation();

  return (
    <div className="page">
      <h2 className="pageTitle">{t("message.welcomeTitle")}</h2>
    </div>
  );
};

export default Message;
