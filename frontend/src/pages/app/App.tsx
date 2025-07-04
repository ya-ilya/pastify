import "./App.css";

import * as api from "../../api";

import { FeedPreview, Header } from "../../components";
import { useContext, useState } from "react";

import { AuthenticationContext } from "../..";
import { useNavigate } from "react-router-dom";

const expirationOptions = [
  { value: 10, label: "10 минут" },
  { value: 60, label: "1 час" },
  { value: 24 * 60, label: "1 день" },
  { value: 7 * 24 * 60, label: "1 неделя" },
  { value: 30 * 24 * 60, label: "1 месяц" },
  { value: null, label: "Без ограничения" },
];

export function App() {
  const pasteController = api.usePasteController();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState(api.PasteLanguage.plaintext);
  const [expiration, setExpiration] = useState<number>(0);
  const [isPrivate, setIsPrivate] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const paste = await pasteController.createPaste({
        title: title,
        content: content,
        language: language,
        expiration: expiration,
        isPrivate: isPrivate,
      });
      alert("Паста создана!");
      setTitle("");
      setContent("");
      setLanguage(api.PasteLanguage.plaintext);
      setExpiration(0);
      setIsPrivate(false);
      navigate(`/${paste.id}`);
    } catch (err) {
      console.error("Failed to create paste:", err);
      alert("Ошибка при создании пасты");
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
          <h1 className="paste-form__title">Создать новую пасту</h1>
          <input
            type="text"
            placeholder="Заголовок (необязательно)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="paste-form__input"
            disabled={!session}
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as api.PasteLanguage)}
            className="paste-form__select"
            disabled={!session}
          >
            {Object.entries(api.PasteLanguage).map(([key, value]) => (
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
              Приватная паста
            </label>
          </div>
          <textarea
            placeholder="Вставьте ваш текст или код сюда..."
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
            Создать
          </button>
        </form>
        {!session && (
          <div className="paste-form__overlay">
            <span className="paste-form__overlay-text">Чтобы создать новую пасту, войдите в аккаунт</span>
          </div>
        )}
      </div>
      <FeedPreview />
    </div>
  );
}
