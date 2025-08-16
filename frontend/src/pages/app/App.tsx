import "./App.css";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AuthenticationContext } from "../..";
import * as api from "../../api";
import { FeedPreview, Header } from "../../components";

export function App() {
  const pasteController = api.usePasteController();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [syntax, setSyntax] = useState(api.PasteSyntax.plaintext);
  const [expiration, setExpiration] = useState<number>(0);
  const [isPrivate, setIsPrivate] = useState(false);

  const navigate = useNavigate();

  const expirationOptions = [
    { value: 10, label: t("expiration.10min") },
    { value: 60, label: t("expiration.1hour") },
    { value: 24 * 60, label: t("expiration.1day") },
    { value: 7 * 24 * 60, label: t("expiration.1week") },
    { value: 30 * 24 * 60, label: t("expiration.1month") },
    { value: null, label: t("expiration.unlimited") },
  ];

  const syntaxOptions = Object.values(api.PasteSyntax).map((v) => ({ label: v, value: v }));

  const toast = useRef<Toast>(null);

  const showToast = (severity: "success" | "error", summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const paste = await pasteController.createPaste({
        title: title,
        content: content,
        syntax: syntax,
        expiration: expiration,
        isPrivate: isPrivate,
      });
      setTitle("");
      setContent("");
      setSyntax(api.PasteSyntax.plaintext);
      setExpiration(0);
      setIsPrivate(false);
      navigate(`/${paste.id}`);
    } catch (err) {
      console.error("Failed to create paste:", err);
      showToast("error", t("paste.createError"), "");
    }
  };

  const [session] = useContext(AuthenticationContext);

  return (
    <div className="app">
      <Toast ref={toast} />
      <Header />
      <div className="paste-form__wrapper">
        <Card className={`paste-form${!session ? " paste-form--blurred" : ""}`}>
          <h1 className="paste-form__title">{t("pasteForm.title")}</h1>
          <form
            onSubmit={handleSubmit}
            className="p-fluid"
          >
            <div className="p-field">
              <label
                htmlFor="title"
                className="sr-only"
              >
                {t("pasteForm.placeholderTitle")}
              </label>
              <InputText
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("pasteForm.placeholderTitle")}
                disabled={!session}
              />
            </div>

            <div className="p-field">
              <label
                htmlFor="syntax"
                className="sr-only"
              >
                Syntax
              </label>
              <Dropdown
                id="syntax"
                value={syntax}
                options={syntaxOptions}
                onChange={(e) => setSyntax(e.value as api.PasteSyntax)}
                optionLabel="label"
                placeholder="Syntax"
                disabled={!session}
              />
            </div>

            <div className="p-field">
              <label
                htmlFor="expiration"
                className="sr-only"
              >
                Expiration
              </label>
              <Dropdown
                id="expiration"
                value={expiration}
                options={expirationOptions}
                onChange={(e) => setExpiration(e.value as number)}
                optionLabel="label"
                placeholder={t("expiration.unlimited")}
                disabled={!session}
              />
            </div>

            <div className="p-field p-d-flex p-ai-center">
              <Checkbox
                inputId="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.checked ?? false)}
                disabled={!session}
              />
              <label
                htmlFor="private"
                className="paste-form__checkbox-label"
                style={{ marginLeft: 10 }}
              >
                {t("pasteForm.private")}
              </label>
            </div>

            <div className="p-field">
              <label
                htmlFor="content"
                className="sr-only"
              >
                {t("pasteForm.placeholderContent")}
              </label>
              <InputTextarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                autoResize
                disabled={!session}
              />
            </div>

            <div className="p-field paste-form__actions">
              <Button
                type="submit"
                label={t("pasteForm.create")}
                icon="pi pi-plus"
                disabled={!session}
              />
            </div>
          </form>
        </Card>
        {!session && (
          <div className="paste-form__overlay">
            <span className="paste-form__overlay-text">{t("pasteForm.needLogin")}</span>
          </div>
        )}
      </div>
      <FeedPreview />
    </div>
  );
}
