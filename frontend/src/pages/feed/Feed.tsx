import "./Feed.css";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { usePasteControllerWithoutAuthentication } from "../../api/controllers/PasteController";
import { Paste } from "../../api/models";
import { Header, PasteTable } from "../../components";

export function Feed() {
  const pasteController = usePasteControllerWithoutAuthentication();
  const { t } = useTranslation();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPastes = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await pasteController.getPastes(100, page * 100);
      setPastes((prev) => [...prev, ...response.pastes]);
      setHasMore(response.pastes.length > 0 && pastes.length + response.pastes.length < response.total);
      setPage((prev) => prev + 1);
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, pasteController, pastes.length]);

  useEffect(() => {
    loadPastes();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !isLoading &&
        hasMore
      ) {
        loadPastes();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, loadPastes]);

  return (
    <div className="feed">
      <Header />
      {pastes.length === 0 && !isLoading ? (
        <div className="feed-paste-view__wrapper feed-paste-view__wrapper--center">
          <div className="paste-view paste-view--loading">{t("feed.noPastes")}</div>
        </div>
      ) : isLoading && pastes.length === 0 ? (
        <div className="feed-paste-view__wrapper feed-paste-view__wrapper--center">
          <div className="paste-view paste-view--loading">{t("feed.loading")}</div>
        </div>
      ) : (
        <div className="feed-paste-view__wrapper">
          <div className="feed__section-label">{t("feed.sectionLabel")}</div>
          <PasteTable pastes={pastes} />
          {isLoading && <div className="paste-view paste-view--loading">{t("feed.loading")}</div>}
        </div>
      )}
    </div>
  );
}
