import "./PasteTable.css";

import { Paste } from "../../api/models";
import { useTranslation } from "react-i18next";

export function PasteTable({ pastes }: { pastes: Paste[] }) {
  const { t } = useTranslation();
  return (
    <table className="paste-table__table">
      <thead>
        <tr>
          <th>{t("pasteTable.title")}</th>
          <th>{t("pasteTable.createdAt")}</th>
          <th>{t("pasteTable.syntax")}</th>
        </tr>
      </thead>
      <tbody>
        {pastes.map((paste) => (
          <tr key={paste.id}>
            <td>
              <a
                href={`/${paste.id}`}
                className="paste-table__link"
              >
                {paste.title || t("pasteTable.noTitle")}
              </a>
              <div className="paste-table__author">
                {t("pasteTable.author")}: {paste.user.username}
              </div>
            </td>
            <td>
              <span className="paste-table__date">
                {new Date(paste.createdAt).toLocaleString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </td>
            <td>
              <span className="paste-table__syntax">{paste.syntax}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
