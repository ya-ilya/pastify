import "./Header.css";

import { AuthenticationContext } from "../..";
import { FaPlus } from "react-icons/fa";
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
      </div>
      <div>
        {session == null ? (
          <>
            <a
              href="/login"
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
          </>
        ) : (
          <>
            <a
              href="/account"
              className="header__button"
            >
              Аккаунт
            </a>
            <button
              onClick={handleLogout}
              className="header__button header__button--outline-logout"
            >
              Выйти
            </button>
          </>
        )}
      </div>
    </header>
  );
}
