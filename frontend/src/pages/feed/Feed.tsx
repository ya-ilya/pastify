import "./Feed.css";

import { useCallback, useEffect, useState } from "react";

import { Header } from "../../components/header/Header";
import { Paste } from "../../api/models";
import { PasteView } from "../../components/pasteView/PasteView";
import { usePasteControllerWithoutAuthentication } from "../../api/controllers/PasteController";

function Feed() {
  const pasteController = usePasteControllerWithoutAuthentication();
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
          <div className="paste-view paste-view--loading">Нет паст</div>
        </div>
      ) : isLoading && pastes.length === 0 ? (
        <div className="feed-paste-view__wrapper feed-paste-view__wrapper--center">
          <div className="paste-view paste-view--loading">Загрузка...</div>
        </div>
      ) : (
        <div className="feed-paste-view__wrapper">
          {pastes.map((paste) => (
            <PasteView
              key={paste.id}
              paste={paste}
              ondelete={() => {}}
            />
          ))}
          {isLoading && <div className="paste-view paste-view--loading">Загрузка...</div>}
        </div>
      )}
    </div>
  );
}

export default Feed;
