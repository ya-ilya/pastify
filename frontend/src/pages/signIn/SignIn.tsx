import "./SignIn.css";

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

export function SignIn() {
  const authController = useAuthenticationController();
  const [session, setSession] = useContext(AuthenticationContext);
  const { t } = useTranslation();

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
      setError(t("signin.enterEmailPassword"));
      return;
    }

    setLoading(true);
    try {
      const response = await authController.signIn({
        email: email.trim(),
        password: password.trim(),
      });
      setSession(response);
      alert(t("signin.success"));
      navigate("/");
    } catch (error: any) {
      setError(error?.response?.data?.message || t("signin.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <Card className="login-card">
          <h2 className="login-title">{t("signin.title")}</h2>
          <form
            className="p-fluid login-form"
            onSubmit={handleSubmit}
          >
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
                autoFocus
              />
            </div>

            <div className="p-field">
              <label
                htmlFor="password"
                className="sr-only"
              >
                {t("signin.password")}
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("signin.password")}
                toggleMask
                feedback={false}
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="p-d-flex p-jc-between p-ai-center login-actions">
              <Button
                label={loading ? t("signin.loading") : t("signin.signin")}
                icon="pi pi-sign-in"
                type="submit"
                loading={loading}
              />
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
