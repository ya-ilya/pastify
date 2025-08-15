import "./Header.css";
import "./HeaderFlags.css";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AuthenticationContext } from "../..";

export function Header() {
  const [session, setSession] = useContext(AuthenticationContext);

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [language, setLanguage] = useState<"ru" | "en">(i18n.language as "ru" | "en");

  const handleLogout = () => {
    setSession(null);
    navigate("/");
  };

  const handleLanguageChange = (lang: "ru" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const langOptions = [
    { label: "Русский", value: "ru", code: "ru" },
    { label: "English", value: "en", code: "uk" },
  ];

  const languageValueTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            alt={option.label}
            src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
            className={`mr-2 flag flag-${option.code}`}
            style={{ width: "18px" }}
          />
          <div className="language-value">{option.label}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const languageOptionTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.label}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`mr-2 flag flag-${option.code}`}
          style={{ width: "18px" }}
        />
        <div className="language-option">{option.label}</div>
      </div>
    );
  };

  const items: MenuItem[] = [
    {
      label: t("header.newPaste"),
      icon: "pi pi-plus-circle",
      command: () => navigate("/"),
    },
    {
      label: t("header.feed"),
      icon: "pi pi-bars",
      command: () => navigate("/feed"),
    },
  ];

  const start = (
    <div className="header-start mr-3">
      <a
        href="/"
        className="header-brand"
      >
        Pastify
      </a>
    </div>
  );

  const end = (
    <div className="header-end">
      <div className="header-lang">
        <Dropdown
          value={language}
          options={langOptions}
          onChange={(e) => handleLanguageChange(e.value as "ru" | "en")}
          optionLabel="label"
          valueTemplate={languageValueTemplate}
          itemTemplate={languageOptionTemplate}
          className="header-lang-dropdown"
          placeholder={language.toUpperCase()}
        />
      </div>

      {session == null ? (
        <>
          <Button
            label={t("header.signIn")}
            icon="pi pi-sign-in"
            onClick={() => navigate("/signin")}
            outlined
          />
          <Button
            label={t("header.signUp")}
            icon="pi pi-user-plus"
            onClick={() => navigate("/signup")}
          />
        </>
      ) : (
        <>
          <Button
            label={session.username}
            icon="pi pi-user"
            onClick={() => navigate("/account")}
            text
          />
          <Button
            label={t("header.logout")}
            icon="pi pi-sign-out"
            onClick={handleLogout}
            severity="danger"
            outlined
          />
        </>
      )}
    </div>
  );

  return (
    <Menubar
      className="header"
      model={items}
      start={start}
      end={end}
    />
  );
}
