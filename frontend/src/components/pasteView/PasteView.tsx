import "./PasteView.css";

import * as api from "../../api";

import { FaCalendarAlt, FaClock, FaKey, FaLock, FaUnlock, FaUser } from "react-icons/fa";
import { FaCopy, FaTrash } from "react-icons/fa";
import { useCallback, useContext } from "react";

import { AuthenticationContext } from "../..";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTranslation } from "react-i18next";

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

  const handleCopyRaw = useCallback(() => {
    navigator.clipboard.writeText(props.paste.content);
    alert(t("pasteView.rawCopied"));
  }, [props.paste.content, t]);

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
      <div className="paste-view__title">{props.paste.title || t("pasteView.noTitle")}</div>
      <div className="paste-view__meta-table">
        <div className="paste-view__meta-row">
          <span className="paste-view__meta-icon">
            <FaUser />
          </span>
          <span className="paste-view__meta-label">{t("pasteView.author")}</span>
          <span className="paste-view__meta-value">{props.paste.user.username}</span>
        </div>
        <div className="paste-view__meta-row">
          <span className="paste-view__meta-icon">
            <FaCalendarAlt />
          </span>
          <span className="paste-view__meta-label">{t("pasteView.created")}</span>
          <span className="paste-view__meta-value">{new Date(props.paste.createdAt).toLocaleString()}</span>
        </div>
        <div className="paste-view__meta-row">
          <span className="paste-view__meta-icon">
            <FaKey />
          </span>
          <span className="paste-view__meta-label">ID</span>
          <span className="paste-view__meta-value">{props.paste.id}</span>
        </div>
        <div className="paste-view__meta-row">
          <span className="paste-view__meta-icon">{props.paste.isPrivate ? <FaLock /> : <FaUnlock />}</span>
          <span className="paste-view__meta-label">{t("pasteView.privacy")}</span>
          <span className="paste-view__meta-value">
            {props.paste.isPrivate ? t("pasteView.private") : t("pasteView.public")}
          </span>
        </div>
        {props.paste.expiresOn && (
          <div className="paste-view__meta-row paste-view__meta-row--expires">
            <span className="paste-view__meta-icon">
              <FaClock />
            </span>
            <span className="paste-view__meta-label">{t("pasteView.expires")}</span>
            <span className="paste-view__meta-value">{new Date(props.paste.expiresOn).toLocaleString()}</span>
          </div>
        )}
      </div>
      <div className="paste-view__content-panel">
        <div className="paste-view__content-panel__left">
          <div className="paste-view__syntax">{props.paste.syntax}</div>
        </div>
        <div className="paste-view__content-panel__right">
          <button
            className="paste-view__copy-link"
            onClick={handleCopyLink}
            title={t("pasteView.copyLink")}
          >
            <FaCopy />
            {t("pasteView.link")}
          </button>
          <button
            className="paste-view__copy-raw"
            onClick={handleCopyRaw}
            title={t("pasteView.copyRaw")}
          >
            <FaCopy />
            {t("pasteView.raw")}
          </button>
          {props.paste.user.id === session?.userId && (
            <button
              className="paste-view__delete-link"
              onClick={handleDelete}
              title={t("pasteView.deletePaste")}
            >
              <FaTrash />
              {t("pasteView.deletePaste")}
            </button>
          )}
        </div>
      </div>
      <SyntaxHighlighter
        language={api.getEnumKeyByValue(api.PasteSyntax, props.paste.syntax) || "plaintext"}
        className="paste-view__content"
        showLineNumbers
      >
        {props.paste.content}
      </SyntaxHighlighter>
    </div>
  );
}
