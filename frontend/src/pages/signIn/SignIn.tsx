import "./SignIn.css";

import { useContext, useEffect, useState } from "react";

import { AuthenticationContext } from "../..";
import { Header } from "../../components";
import { useAuthenticationController } from "../../api/controllers/AuthenticationController";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const authController = useAuthenticationController();
  const [session, setSession] = useContext(AuthenticationContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!email.trim() || !password.trim()) {
      setError("Введите email и пароль");
      return;
    }

    setLoading(true);
    try {
      const response = await authController.signIn({
        email: email.trim(),
        password: password.trim(),
      });
      setSession(response);
      alert("Вход выполнен!");
      navigate("/");
    } catch (error: any) {
      setError(error?.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <h2 className="login-title">Вход</h2>
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {error && <div className="login-error">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="login-submit"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </>
  );
}
