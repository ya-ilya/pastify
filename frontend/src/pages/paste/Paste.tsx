import "./Paste.css";

import * as api from "../../api";

import { Header, PasteView } from "../../components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

export function Paste() {
  const pasteController = api.usePasteControllerWithoutAuthentication();

  const [paste, setPaste] = useState<api.Paste | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <div className="paste">
      <Header />
      {!isLoading && paste ? (
        <div className="paste-paste-view__wrapper">
          <PasteView
            paste={paste}
            ondelete={() => {
              setPaste(null);
              navigate("/");
            }}
          />
        </div>
      ) : isLoading ? (
        <div className="paste-paste-view__wrapper">
          <div className="paste-view paste-view--loading">{t("paste.loading")}</div>
        </div>
      ) : (
        <div className="paste-paste-view__wrapper">
          <div className="paste-view paste-view--error">{t("paste.notFound")}</div>
        </div>
      )}
    </div>
  );
}
