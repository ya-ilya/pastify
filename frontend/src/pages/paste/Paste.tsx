import "./Paste.css";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";

import { AuthenticationContext } from "../..";
import * as api from "../../api";
import { Header } from "../../components";

export function Paste() {
  const pasteController = api.usePasteControllerWithoutAuthentication();
  const pasteControllerAuth = api.usePasteController();
  const [session] = useContext(AuthenticationContext);

  const [paste, setPaste] = useState<api.Paste | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toast = useRef<Toast>(null);

  const showToast = (severity: "success" | "error", summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail });
  };

  useEffect(() => {
    setIsLoading(true);
    setPaste(null);

    if (params.id) {
      pasteController
        .getPaste(params.id)
        .then((data) => {
          setPaste(data);
        })
        .catch((error) => {
          console.error("Failed to fetch paste:", error);
          setPaste(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params.id, pasteController]);

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const onCopyRaw = async () => {
    try {
      await navigator.clipboard.writeText(paste?.content ?? "");
    } catch (err) {
      console.error("Failed to copy raw", err);
    }
  };

  const onDelete = async () => {
    if (!paste) return;
    if (!window.confirm(t("pasteView.confirmDelete"))) return;
    try {
      await pasteControllerAuth.deletePaste(paste.id);
      navigate("/");
    } catch (err) {
      console.error(t("pasteView.deleteErrorLog"), err);
      showToast("error", t("pasteView.deleteError"), "");
    }
  };

  return (
    <div className="paste">
      <Toast ref={toast} />
      <Header />
      {!isLoading && paste ? (
        <div className="paste-card__wrapper">
          <Card className="paste-card">
            <div className="paste-actions">
              <Button
                icon="pi pi-copy"
                className="p-button-text"
                onClick={onCopyLink}
                aria-label={t("pasteView.copyLink")}
                title={t("pasteView.copyLink")}
              />
              <Button
                icon="pi pi-file"
                className="p-button-text"
                onClick={onCopyRaw}
                aria-label={t("pasteView.copyRaw")}
                title={t("pasteView.copyRaw")}
              />
              {session && paste.user && session.userId === paste.user.id ? (
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-text"
                  onClick={onDelete}
                  aria-label={t("pasteView.deletePaste")}
                  title={t("pasteView.deletePaste")}
                />
              ) : null}
            </div>

            <div className="paste-header">
              <div className="paste-meta">
                <h2 className="paste-title">{paste.title ?? t("pasteView.noTitle")}</h2>
                <div className="paste-submeta">
                  <div className="meta-item">
                    <i
                      className="pi pi-user"
                      aria-hidden
                    />
                    <span>
                      {t("pasteView.author")}: {paste.user?.username ?? "-"}
                    </span>
                  </div>

                  <div className="meta-item">
                    <i
                      className={paste.isPrivate ? "pi pi-lock" : "pi pi-globe"}
                      aria-hidden
                    />
                    <span>
                      {t("pasteView.privacy")}: {paste.isPrivate ? t("pasteView.private") : t("pasteView.public")}
                    </span>
                  </div>

                  <div className="meta-item">
                    <i
                      className="pi pi-calendar"
                      aria-hidden
                    />
                    <span>
                      {t("pasteView.created")}: {new Date(paste.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="meta-item">
                    <i
                      className="pi pi-hourglass"
                      aria-hidden
                    />
                    <span>
                      {t("pasteView.expires")}:{" "}
                      {paste.expiresOn ? new Date(paste.expiresOn).toLocaleString() : t("pasteView.expiresNever")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="paste-content-wrapper p-mt-3">
              <SyntaxHighlighter
                language={api.getEnumKeyByValue(api.PasteSyntax, paste.syntax) || "plaintext"}
                className="paste-content"
                showLineNumbers
              >
                {paste.content}
              </SyntaxHighlighter>
            </div>
          </Card>
        </div>
      ) : isLoading ? (
        <div className="paste-card__wrapper">
          <Card className="paste-card">
            <div className="paste--loading">{t("paste.loading")}</div>
          </Card>
        </div>
      ) : (
        <div className="paste-card__wrapper">
          <Card className="paste-card">
            <div className="paste--error">{t("paste.notFound")}</div>
          </Card>
        </div>
      )}
    </div>
  );
}
