import "./SignUp.css";

import { useContext, useEffect, useState } from "react";

import { AuthenticationContext } from "../..";
import { Header } from "../../components/header/Header";
import { useAuthenticationController } from "../../api/controllers/AuthenticationController";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const authController = useAuthenticationController();
  const [session, setSession] = useContext(AuthenticationContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Введите имя пользователя, email и пароль");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const response = await authController.signUp({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      setSession(response);
      alert("Регистрация успешна!");
      navigate("/");
    } catch (error: any) {
      setError(error?.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="signup-page">
        <h2 className="signup-title">Регистрация</h2>
        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
            className="signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="signup-input"
          />
          {error && <div className="signup-error">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="signup-submit"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
