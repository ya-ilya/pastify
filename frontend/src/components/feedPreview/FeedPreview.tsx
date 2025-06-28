import "./FeedPreview.css";

import * as api from "../../api";

import { useEffect, useState } from "react";

export function FeedPreview() {
  const pasteController = api.usePasteController();

  const [pastes, setPastes] = useState<api.Paste[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPastes([]);
    setIsLoading(true);

    pasteController
      .getPastes(10, 0)
      .then((data) => {
        setPastes(data.pastes);
      })
      .catch((error) => {
        console.error("Failed to fetch pastes:", error);
        setPastes([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pasteController]);

  return (
    <div className="feed-preview">
      <div className="feed-preview__header">
        <a
          href="/feed"
          className="feed-preview__header-link"
        >
          <h1>Последние пасты</h1>
        </a>
      </div>
      <div className="feed-preview__content">
        {pastes.length === 0 && !isLoading ? (
          <div className="feed-preview__empty">Нет паст</div>
        ) : isLoading ? (
          <div className="feed-preview__loading">Загрузка...</div>
        ) : (
          pastes.map((paste) => {
            return (
              <a
                href={`/${paste.id}`}
                className="feed-preview__paste-link"
                key={paste.id}
              >
                <div className="feed-preview__paste">
                  <h2>{paste.title || "Без названия"}</h2>
                  <p>
                    {paste.content.slice(0, 100)}
                    {paste.content.length > 100 ? "..." : ""}
                  </p>
                  <span className="feed-preview__paste-author">
                    Автор: {paste.user.username}
                  </span>
                  <span className="feed-preview__paste-date">
                    {new Date(paste.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
