import "./App.css";

import { useContext, useState } from "react";
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
      alert(t("paste.created"));
      setTitle("");
      setContent("");
      setSyntax(api.PasteSyntax.plaintext);
      setExpiration(0);
      setIsPrivate(false);
      navigate(`/${paste.id}`);
    } catch (err) {
      console.error("Failed to create paste:", err);
      alert(t("paste.createError"));
    }
  };

  const [session] = useContext(AuthenticationContext);

  return (
    <div className="home">
      <Header />
      <div className="paste-form__wrapper">
        <form
          onSubmit={handleSubmit}
          className={`paste-form${!session ? " paste-form--blurred" : ""}`}
        >
          <h1 className="paste-form__title">{t("pasteForm.title")}</h1>
          <input
            type="text"
            placeholder={t("pasteForm.placeholderTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="paste-form__input"
            disabled={!session}
          />
          <select
            value={syntax}
            onChange={(e) => setSyntax(e.target.value as api.PasteSyntax)}
            className="paste-form__select"
            disabled={!session}
          >
            {Object.entries(api.PasteSyntax).map(([key, value]) => (
              <option
                key={key}
                value={value}
              >
                {value}
              </option>
            ))}
          </select>
          <select
            value={expiration}
            onChange={(e) => setExpiration(Number(e.target.value))}
            className="paste-form__select"
            disabled={!session}
          >
            {expirationOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value ?? 0}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="paste-form__checkbox-row">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="paste-form__checkbox"
              disabled={!session}
            />
            <label
              htmlFor="private"
              className="paste-form__checkbox-label"
            >
              {t("pasteForm.private")}
            </label>
          </div>
          <textarea
            placeholder={t("pasteForm.placeholderContent")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="paste-form__textarea"
            disabled={!session}
          />
          <button
            type="submit"
            className="paste-form__submit"
            disabled={!session}
          >
            {t("pasteForm.create")}
          </button>
        </form>
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
