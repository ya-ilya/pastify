import "./PasteTable.css";

import { Paste } from "../../api/models";

export function PasteTable({ pastes }: { pastes: Paste[] }) {
  return (
    <table className="paste-table__table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Дата создания</th>
          <th>Синтаксис</th>
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
                {paste.title || "Без названия"}
              </a>
              <div className="paste-table__author">Автор: {paste.user.username}</div>
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
              <span className="paste-table__syntax">{paste.language}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
