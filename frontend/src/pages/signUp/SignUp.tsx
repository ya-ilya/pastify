import "./SignUp.css";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AuthenticationContext } from "../..";
import { useAuthenticationController } from "../../api/controllers/AuthenticationController";
import { Header } from "../../components";

export function SignUp() {
  const authController = useAuthenticationController();
  const [session, setSession] = useContext(AuthenticationContext);
  const { t } = useTranslation();

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
      setError(t("signup.enterAllFields"));
      return;
    }
    if (password !== confirm) {
      setError(t("signup.passwordsDontMatch"));
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
      alert(t("signup.success"));
      navigate("/");
    } catch (error: any) {
      setError(error?.response?.data?.message || t("signup.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <Header />
      <Card className="signup-card">
        <h2 className="signup-title">{t("signup.title")}</h2>
        <form
          className="p-fluid signup-form"
          onSubmit={handleSubmit}
        >
          <div className="p-field">
            <label
              htmlFor="username"
              className="sr-only"
            >
              {t("signup.username")}
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("signup.username")}
              autoFocus
            />
          </div>

          <div className="p-field">
            <label
              htmlFor="email"
              className="sr-only"
            >
              Email
            </label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="p-field">
            <label
              htmlFor="password"
              className="sr-only"
            >
              {t("signup.password")}
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("signup.password")}
              promptLabel={t("signup.passwordPrompt")}
              weakLabel={t("signup.weakPassword")}
              mediumLabel={t("signup.mediumPassword")}
              strongLabel={t("signup.strongPassword")}
              toggleMask
            />
          </div>

          <div className="p-field">
            <label
              htmlFor="confirm"
              className="sr-only"
            >
              {t("signup.confirmPassword")}
            </label>
            <Password
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t("signup.confirmPassword")}
              toggleMask
              feedback={false}
            />
          </div>

          {error && <div className="signup-error">{error}</div>}

          <div className="p-d-flex p-jc-between p-ai-center signup-actions">
            <Button
              label={loading ? t("signup.loading") : t("signup.signup")}
              icon="pi pi-user-plus"
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}
