import React from 'react';
import jsPDF from 'jspdf';
import { formatRp } from '../utils/formatCurrency';

export default function TransactionHistory({ transactions, onDelete }) {
  const handleExportPDF = (trx) => {
    const doc = new jsPDF();
    doc.text('Struk Transaksi', 10, 10);
    doc.text(`Tanggal: ${trx.date}`, 10, 20);
    trx.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} x${item.qty} = ${formatRp(item.qty * item.price)}`, 10, 30 + index * 10);
    });
    doc.text(`Total: ${formatRp(trx.total)}`, 10, 30 + trx.items.length * 10);
    doc.save(`transaksi-${trx.id}.pdf`);
  };

  return (
    <div
      className="card shadow-sm p-4 mt-4 rounded mx-auto"
      style={{ maxWidth: 1000, width: '100%' }}
    >
      <h5 className="mb-3">🗃️ Riwayat Transaksi</h5>
      {transactions.length === 0 && <p className="text-muted">Belum ada transaksi.</p>}
      <ul className="list-group">
        {transactions.map(trx => (
          <li key={trx.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <strong>{trx.date}</strong><br />
              <small>Total: {formatRp(trx.total)}</small>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleExportPDF(trx)}>Cetak PDF</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(trx.id)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
