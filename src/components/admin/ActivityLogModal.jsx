import React from 'react';
import Modal from '../Modal';
import { formatDateSafe, actionBadge, actionIcon } from "@/services/activityLog.unified";

function ActivityLogModal({ isOpen, onClose, logs, userEmail }) {
  const filteredLogs = logs.filter(log => log.user === userEmail);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Actividad de ${userEmail}`}>
      <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink font-semibold border-b">
              <th className="py-2 text-left">Acción</th>
              <th className="text-left">Detalles</th>
              <th className="text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((l) => (
              <tr key={l.id} className="border-b hover:bg-brand-50/50">
                <td>
                  <span className={actionBadge(l.action)}>
                    <span className="mr-1">{actionIcon(l.action)}</span>
                    {l.action}
                  </span>
                </td>
                <td className="max-w-[200px] truncate">
                  {renderDetails(l.details)}
                </td>
                <td>{formatDateSafe(l.iso)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button className="btn" onClick={onClose}>Devolver</button>
      </div>
    </Modal>
  );
}

function renderDetails(details) {
  if (!details) return "—";
  if (typeof details === "string") return details;
  try {
    return JSON.stringify(details);
  } catch {
    return String(details);
  }
}

export default ActivityLogModal;
