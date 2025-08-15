import "./Header.css";

import { GB, RU } from "country-flag-icons/react/3x2";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { CgUserAdd } from "react-icons/cg";
import { CiLogin, CiLogout, CiUser } from "react-icons/ci";
import { FaPlus, FaStream } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { AuthenticationContext } from "../..";

export function Header() {
  const [session, setSession] = useContext(AuthenticationContext);

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [language, setLanguage] = useState<"ru" | "en">(i18n.language as "ru" | "en");

  const handleLogout = () => {
    alert("Logout clicked");
    setSession(null);
    navigate("/");
  };

  const handleLanguageChange = (lang: "ru" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <header className="header">
      <div className="header__left">
        <a
          className="header__title"
          href="/"
        >
          Pastify
        </a>
        <a
          className="header__new-paste"
          href="/"
        >
          <FaPlus />
          <span className="header__new-paste-text">{t("header.newPaste")}</span>
        </a>
        <a
          className="header__feed"
          href="/feed"
        >
          <FaStream />
          <span className="header__feed-text">{t("header.feed")}</span>
        </a>
      </div>
      <div className="header__right">
        <div className="header__lang-switch">
          <button
            className={`header__lang-btn${language === "ru" ? " header__lang-btn--active" : ""}`}
            onClick={() => handleLanguageChange("ru")}
          >
            <RU />
            RU
          </button>
          <button
            className={`header__lang-btn${language === "en" ? " header__lang-btn--active" : ""}`}
            onClick={() => handleLanguageChange("en")}
          >
            <GB />
            EN
          </button>
        </div>
        {session == null ? (
          <>
            <a
              href="/signin"
              className="header__button header__button--outline"
            >
              <CiLogin />
              <span className="header__new-paste-text">{t("header.signIn")}</span>
            </a>
            <a
              href="/signup"
              className="header__button"
            >
              <CgUserAdd />
              <span className="header__new-paste-text">{t("header.signUp")}</span>
            </a>
          </>
        ) : (
          <>
            <a
              href="/account"
              className="header__button"
            >
              <CiUser />
              <span className="header__new-paste-text">{session.username}</span>
            </a>
            <button
              onClick={handleLogout}
              className="header__button header__button--outline-logout"
            >
              <CiLogout />
              <span className="header__new-paste-text">{t("header.logout")}</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
