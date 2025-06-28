import "./Header.css";

import { FaPlus, FaStream, FaUser } from "react-icons/fa";

import { AuthenticationContext } from "../..";
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
            Войти
          </a>
          <a
            href="/signup"
            className="header__button"
          >
            Зарегистрироваться
          </a>
        </div>
      ) : (
        <div className="header__right">
          <a
            href="/account"
            className="header__button"
          >
            <FaUser />
            {session.username}
          </a>
          <button
            onClick={handleLogout}
            className="header__button header__button--outline-logout"
          >
            Выйти
          </button>
        </div>
      )}
    </header>
  );
}
