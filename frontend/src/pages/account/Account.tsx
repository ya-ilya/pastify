import "./Account.css";

import * as api from "../../api";

import { Header, PasteTable } from "../../components";
import { useEffect, useState } from "react";

import { useMeController } from "../../api";

export function Account() {
  const meController = useMeController();

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
            <div className="paste-view paste-view--loading">Вы еще не создавали паст</div>
          </div>
        ) : (
          <div className="account-paste-view__wrapper">
            <PasteTable pastes={pastes} />
          </div>
        )
      ) : (
        <div className="account-paste-view__wrapper account-paste-view__wrapper--center">
          <div className="paste-view paste-view--loading">Загрузка...</div>
        </div>
      )}
    </div>
  );
}
