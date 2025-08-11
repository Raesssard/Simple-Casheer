import React from 'react';

export default function ProductForm({
  newItem, newPrice, newCategory, isCustomCategory, categories,
  onChange, onAdd, onToggleCustom
}) {
  return (
    <div className="row mb-3">
      <div className="col-sm-4 mb-2">
        <input
          type="text"
          className="form-control"
          name="newItem"
          placeholder="Nama produk"
          value={newItem}
          onChange={onChange}
        />
      </div>
      <div className="col-sm-3 mb-2">
        <input
          type="number"
          className="form-control"
          name="newPrice"
          placeholder="Harga"
          value={newPrice}
          onChange={onChange}
        />
      </div>
      <div className="col-sm-3 mb-2">
        {isCustomCategory ? (
          <input
            type="text"
            className="form-control"
            name="newCategory"
            placeholder="Kategori baru"
            value={newCategory}
            onChange={onChange}
          />
        ) : (
          <select
            className="form-select"
            value={newCategory}
            onChange={(e) => {
              if (e.target.value === '__new') onToggleCustom(true);
              else onChange({ target: { name: 'newCategory', value: e.target.value } });
            }}
          >
            <option value="">Pilih kategori</option>
            {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            <option value="__new">+ Tambah kategori baru</option>
          </select>
        )}
      </div>
      <div className="col-sm-2 mb-2">
        <button className="btn btn-primary w-100" onClick={onAdd}>Tambah</button>
      </div>
    </div>
  );
}
