import "./FeedPreview.css";

import * as api from "../../api";

import { useEffect, useState } from "react";

function formatTimeAgo(dateString: string | Date) {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffHour < 24) {
    if (diffHour >= 1) {
      return `${diffHour} ${plural(diffHour, "час", "часа", "часов")} назад`;
    }
    if (diffMin >= 1) {
      return `${diffMin} ${plural(diffMin, "минута", "минуты", "минут")} назад`;
    }
    if (diffSec < 10) {
      return "Только что";
    }
    return `${diffSec} ${plural(diffSec, "секунда", "секунды", "секунд")} назад`;
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function plural(n: number, one: string, few: string, many: string) {
  n = Math.abs(n) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

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
        setPastes(data.pastes.reverse());
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
                  <span className="feed-preview__paste-author">Автор: {paste.user.username}</span>
                  <span className="feed-preview__paste-date">{formatTimeAgo(paste.createdAt)}</span>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
