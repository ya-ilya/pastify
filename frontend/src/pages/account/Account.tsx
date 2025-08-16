import "./Account.css";

import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import * as api from "../../api";
import { FeedPreview, Header, PasteTable } from "../../components";

export function Account() {
  const meController = api.useMeController();
  const { t } = useTranslation();

  const [pastes, setPastes] = useState<api.Paste[]>([]);
  const [user, setUser] = useState<api.User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPastes([]);
    setUser(null);

    if (!meController) {
      return;
    }

    setIsLoading(true);

    Promise.all([meController.getPastes(), meController.getUser()])
      .then(([pastesData, userData]) => {
        setPastes(pastesData);
        setUser(userData);
      })
      .catch((error) => {
        console.error("Failed to fetch account data:", error);
        setPastes([]);
        setUser(null);
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
          <div className="account-card__wrapper account-card__wrapper--center">
            <Card className="account-card">
              <div className="paste--loading">{t("account.noPastes")}</div>
            </Card>
          </div>
        ) : (
          <div className="account-card__wrapper">
            <Card className="account-card">
              <div className="account__section-header">
                <div className="account__section-label">{t("account.sectionLabel")}</div>
                {user ? (
                  <div className="account-user-info">
                    <span className="account-user-name">{user.username}</span>
                    <span className="account-user-registered">
                      {t("account.registeredAt")}: {new Date(user.registeredOn).toLocaleDateString()}
                    </span>
                  </div>
                ) : null}
              </div>
              <PasteTable pastes={pastes} />
            </Card>
          </div>
        )
      ) : (
        <div className="account-card__wrapper account-card__wrapper--center">
          <Card className="account-card">
            <div className="paste--loading">{t("account.loading")}</div>
          </Card>
        </div>
      )}
      <FeedPreview />
    </div>
  );
}
