import "./PasteView.css";

import * as api from "../../api";

import { FaCopy, FaTrash } from "react-icons/fa";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";

import { AuthenticationContext } from "../..";
import SyntaxHighlighter from "react-syntax-highlighter";

type PasteViewProps = {
  paste: api.Paste;
  ondelete: () => void;
};

export function PasteView(props: PasteViewProps) {
  const pasteController = api.usePasteController();

  const [session] = useContext(AuthenticationContext);
  const { t } = useTranslation();

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert(t("pasteView.linkCopied"));
  }, [t]);

  const handleDelete = useCallback(() => {
    if (window.confirm(t("pasteView.confirmDelete"))) {
      pasteController
        .deletePaste(props.paste.id)
        .then(() => {
          alert(t("pasteView.deleted"));
          props.ondelete();
        })
        .catch((error) => {
          console.error(t("pasteView.deleteErrorLog"), error);
          alert(t("pasteView.deleteError"));
        });
    }
  }, [props.paste.id, props.ondelete, pasteController, t]);

  return (
    <div className="paste-view">
      <div className="paste-view__actions">
        <button
          className="paste-view__copy-link"
          onClick={handleCopyLink}
          title={t("pasteView.copyLink")}
        >
          <FaCopy />
        </button>
        {props.paste.user.id === session?.userId && (
          <button
            className="paste-view__delete-link"
            onClick={handleDelete}
            title={t("pasteView.deletePaste")}
          >
            <FaTrash />
          </button>
        )}
      </div>
      <h1 className="paste-view__title">{props.paste.title || t("pasteView.noTitle")}</h1>
      <div className="paste-view__meta">
        <span className="paste-view__meta-item">
          <b>ID:</b> {props.paste.id}
        </span>
        <span className="paste-view__meta-item">
          <b>{t("pasteView.author")}:</b> {props.paste.user.username}
        </span>
        <span className="paste-view__meta-item">
          <b>{t("pasteView.syntax")}:</b> {props.paste.syntax}
        </span>
        <span className="paste-view__meta-item">
          <b>{t("pasteView.privacy")}:</b>{" "}
          {props.paste.isPrivate ? t("pasteView.private") : t("pasteView.public")}
        </span>
        <span className="paste-view__meta-item">
          <b>{t("pasteView.created")}:</b> {new Date(props.paste.createdAt).toLocaleString()}
        </span>
        {props.paste.expiresOn && (
          <span className="paste-view__meta-item paste-view__meta-item--expires">
            <b>{t("pasteView.expires")}:</b> {new Date(props.paste.expiresOn).toLocaleString()}
          </span>
        )}
      </div>
      <SyntaxHighlighter
        language={api.getEnumKeyByValue(api.PasteSyntax, props.paste.syntax) || "plaintext"}
        className="paste-view__content"
      >
        {props.paste.content}
      </SyntaxHighlighter>
    </div>
  );
}
