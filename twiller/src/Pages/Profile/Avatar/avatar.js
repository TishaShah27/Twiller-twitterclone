import React, { useState } from 'react';
import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';
import axios from 'axios';
import './avatar.css';
import { useTranslation } from "react-i18next";


const AvatarModal = ({ onSave,onClose, userEmail }) => {
  const [avatarSvg, setAvatarSvg] = useState('');
  const { t } = useTranslation();
  const backgroundColors = [
  '#B0E0E6', '#E6E6FA', '#FFE4E1', '#FFDAB9', '#F0FFF0',
  '#AFEEEE', '#FFFACD', '#FADADD', '#F5FFFA', '#F0F8FF',
  '#D8BFD8', '#E0FFFF', '#FFF5EE', '#FFDAB9', '#DCDCDC'
];

  const generateAvatar = () => {
  const seed = Math.random().toString(36).substring(2);
  const randomBgColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  const avatar = createAvatar(avataaars, {
    seed,
    size: 128,
  }).toString();

  // Inject a solid background into the SVG manually
  const insertIndex = avatar.indexOf('>') + 1;

// Circle background behind avatar (not masking/clipping — just works)
const backgroundCircle = `
<rect x="0" y="0" width="100%" height="100%" rx="50%" ry="50%" fill="${randomBgColor}" />
`;

const avatarWithBg = avatar.slice(0, insertIndex) + backgroundCircle + avatar.slice(insertIndex);

  setAvatarSvg(avatarWithBg);
};

  const saveAvatar = async () => {
    if (!avatarSvg) return alert(t('Please a Avatar Generate First'));

    try {
      const blob = new Blob([avatarSvg], { type: 'image/svg+xml' });
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Avatar = reader.result;
        try {
          const response = await axios.post('http://localhost:5000/save-avatar', {
            email: userEmail,
            avatar: base64Avatar,
            useAvatar: true,
          });

          if (response.status === 200) {
            alert(t('Your Avatar has been Saved!'));
            if (onSave) onSave(avatarSvg);
            if (onClose) onClose();
          } else {
            alert(t('There could be a server error'));
          }
        } catch {
          alert(t('There could be a Network Error'));
        }
      };

      reader.onerror = () => alert(t('svgError'));
      reader.readAsDataURL(blob);
    } catch {
      alert(t('Something is Wrong'));
    }
  };


  return (
    <div className="avatar-modal-overlay">
      <div className="avatar-modal">
        <h2>{t("Create Your Avatar")}</h2>
        <div className="avatar-preview" dangerouslySetInnerHTML={{ __html: avatarSvg }} />
        <div className="avatar-buttons">
          <button onClick={generateAvatar}>{t("Generate Avatar 👾")}</button>
          <button onClick={saveAvatar} disabled={!avatarSvg}>{t("💾 Save")}</button>
          <button onClick={() => {
          console.log("Cancel clicked");
          if (onClose && typeof onClose === "function") {
          onClose(); 
          }
          }}
          >
            {t("Cancel")}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
