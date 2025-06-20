import "./PasteView.css";

import * as api from "../../api";

import { FaCopy, FaTrash } from "react-icons/fa";
import { useCallback, useContext } from "react";

import { AuthenticationContext } from "../..";
import SyntaxHighlighter from "react-syntax-highlighter";

type PasteViewProps = {
  paste: api.Paste;
  ondelete: () => void;
};

export function PasteView(props: PasteViewProps) {
  const pasteController = api.usePasteController();

  const [session] = useContext(AuthenticationContext);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert("Ссылка скопирована!");
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm("Вы уверены, что хотите удалить эту пасту?")) {
      pasteController
        .deletePaste(props.paste.id)
        .then(() => {
          alert("Паста успешно удалена!");
          props.ondelete();
        })
        .catch((error) => {
          console.error("Ошибка при удалении пасты:", error);
          alert("Не удалось удалить пасту. Попробуйте позже.");
        });
    }
  }, [props.paste.id]);

  return (
    <div className="paste-view">
      <div className="paste-view__actions">
        <button
          className="paste-view__copy-link"
          onClick={handleCopyLink}
          title="Скопировать ссылку"
        >
          <FaCopy />
        </button>
        {props.paste.user.id === session?.userId && (
          <button
            className="paste-view__delete-link"
            onClick={handleDelete}
            title="Удалить пасту"
          >
            <FaTrash />
          </button>
        )}
      </div>
      <h1 className="paste-view__title">{props.paste.title || "Без заголовка"}</h1>
      <div className="paste-view__meta">
        <span className="paste-view__meta-item">
          <b>ID:</b> {props.paste.id}
        </span>
        <span className="paste-view__meta-item">
          <b>Язык:</b> {props.paste.language}
        </span>
        <span className="paste-view__meta-item">
          <b>Приватность:</b> {props.paste.isPrivate ? "Приватная" : "Публичная"}
        </span>
        <span className="paste-view__meta-item">
          <b>Создана:</b> {new Date(props.paste.createdAt).toLocaleString()}
        </span>
        {props.paste.expiresOn && (
          <span className="paste-view__meta-item paste-view__meta-item--expires">
            <b>Истекает:</b> {new Date(props.paste.expiresOn).toLocaleString()}
          </span>
        )}
      </div>
      <SyntaxHighlighter
        language={api.getEnumKeyByValue(api.PasteLanguage, props.paste.language) || "plaintext"}
        className="paste-view__content"
      >
        {props.paste.content}
      </SyntaxHighlighter>
    </div>
  );
}
