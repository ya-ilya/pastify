import "./Header.css";

import { CiLogin, CiLogout, CiUser } from "react-icons/ci";
import { FaPlus, FaStream } from "react-icons/fa";

import { AuthenticationContext } from "../..";
import { CgUserAdd } from "react-icons/cg";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [session, setSession] = useContext(AuthenticationContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logout clicked");
    setSession(null);
    navigate("/");
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
          <span className="header__new-paste-text">Паста</span>
        </a>
        <a
          className="header__feed"
          href="/feed"
        >
          <FaStream />
          <span className="header__feed-text">Лента</span>
        </a>
      </div>
      {session == null ? (
        <div className="header__right">
          <a
            href="/signin"
            className="header__button header__button--outline"
          >
            <CiLogin />
            <span className="header__new-paste-text">Войти</span>
          </a>
          <a
            href="/signup"
            className="header__button"
          >
            <CgUserAdd />
            <span className="header__new-paste-text">Зарегестрироваться</span>
          </a>
        </div>
      ) : (
        <div className="header__right">
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
            <span className="header__new-paste-text">Выйти</span>
          </button>
        </div>
      )}
    </header>
  );
}
