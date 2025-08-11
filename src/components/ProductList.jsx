import React from 'react';
import { formatRp } from '../utils/formatCurrency';

export default function ProductList({
  items, onCheckbox, onQtyChange, onEdit, onDelete
}) {
  return (
    <ul className="list-group mb-3">
      {items.length === 0 && <p className="text-muted">Tidak ada produk yang cocok.</p>}
      {items.map(item => (
        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center flex-wrap">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={!!item.checked}
              onChange={() => onCheckbox(item.id)}
            />
            <strong className="me-2">{item.name}</strong>
            {item.category && <span className="badge bg-info me-2">{item.category}</span>}
            <span className="badge bg-secondary me-2">{formatRp(item.price)}</span>
          </div>

          <div className="d-flex align-items-center">
            {item.checked && (
              <div className="me-3 d-flex align-items-center">
                <button className="btn btn-sm btn-outline-danger me-1" onClick={() => onQtyChange(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button className="btn btn-sm btn-outline-success ms-1" onClick={() => onQtyChange(item.id, 1)}>+</button>
              </div>
            )}
            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => onEdit(item.id)}>Edit</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item.id)}>Hapus</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
