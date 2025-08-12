import React from 'react';
import { formatRp } from '../utils/formatCurrency';

export default function ProductList({
  items, onCheckbox, onQtyChange, onEdit, onDelete
}) {
  return (
    <ul className="list-group mb-3">
      {items.length === 0 && <p className="text-muted">Tidak ada produk yang cocok.</p>}
      {items.map(item => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center mb-3 py-3"
        >
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
              <div
                className="me-3 d-flex align-items-center flex-nowrap"
                style={{ minWidth: 110 }}
              >
                <button
                  className="btn btn-sm btn-outline-danger me-1"
                  style={{ minWidth: 32 }}
                  onClick={() => onQtyChange(item.id, -1)}
                >-</button>
                <span
                  style={{
                    minWidth: 24,
                    textAlign: 'center',
                    display: 'inline-block'
                  }}
                >{item.qty}</span>
                <button
                  className="btn btn-sm btn-outline-success ms-1"
                  style={{ minWidth: 32 }}
                  onClick={() => onQtyChange(item.id, 1)}
                >+</button>
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
