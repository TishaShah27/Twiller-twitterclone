import React from 'react';
import '../pages.css';
import { useTranslation } from 'react-i18next';

const Bookmark = () => {
  const { t } = useTranslation();

  return (
    <div className="page">
      <h2 className="pageTitle">{t('bookmark.title')}</h2>
    </div>
  );
};

export default Bookmark;
