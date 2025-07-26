import "./Account.css";

import * as api from "../../api";

import { FeedPreview, Header, PasteTable } from "../../components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMeController } from "../../api";

export function Account() {
  const meController = useMeController();
  const { t } = useTranslation();

  const [pastes, setPastes] = useState<api.Paste[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPastes([]);

    if (!meController) {
      return;
    }

    setIsLoading(true);

    meController!
      .getPastes()
      .then((data) => {
        setPastes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch paste:", error);
        setPastes([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [meController]);

  return (
    <div className="account">
      <Header />
      {!isLoading ? (
        pastes.length === 0 ? (
          <div className="account-paste-view__wrapper account-paste-view__wrapper--center">
            <div className="paste-view paste-view--loading">{t("account.noPastes")}</div>
          </div>
        ) : (
          <div className="account-paste-view__wrapper">
            <div className="account__section-label">{t("account.sectionLabel")}</div>
            <PasteTable pastes={pastes} />
          </div>
        )
      ) : (
        <div className="account-paste-view__wrapper account-paste-view__wrapper--center">
          <div className="paste-view paste-view--loading">{t("account.loading")}</div>
        </div>
      )}
      <FeedPreview />
    </div>
  );
}
