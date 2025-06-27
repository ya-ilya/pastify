import "./Account.css";

import * as api from "../../api";

import { useEffect, useState } from "react";

import { Header } from "../../components/header/Header";
import { PasteView } from "../../components/pasteView/PasteView";
import { useMeController } from "../../api";

function Account() {
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
            {pastes.map((paste) => {
              return (
                <PasteView
                  paste={paste}
                  ondelete={() => {
                    setPastes((prevPastes) => {
                      return prevPastes.filter((it) => it.id != paste.id);
                    });
                  }}
                />
              );
            })}
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

export default Account;
