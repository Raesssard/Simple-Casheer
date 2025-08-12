import React, { useState, useEffect } from 'react';

export default function EditProductModal({
  visible,
  name,
  price,
  category,
  categories,
  onClose,
  onSave,
  onChange
}) {
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (visible) {
      setSelectedCategory(category || '');
      setNewCategory('');
    }
  }, [visible, category]);

  if (!visible) return null;

  const categoryOptions = Array.isArray(categories) && categories.length
    ? (() => {
        const set = new Set(categories.map(c => (c || '').trim()).filter(Boolean));
        if (category && !set.has(category)) set.add(category);
        return Array.from(set).sort((a, b) => a.localeCompare(b));
      })()
    : (category ? [category] : []);

  const handleCategorySelect = (val) => {
    setSelectedCategory(val);
    if (val !== '__new' && onChange) {
      onChange({ target: { name: 'editCategory', value: val } });
    }
    if (val !== '__new') setNewCategory('');
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
    // Jangan panggil onChange ke parent di sini!
  };

  const handleSave = () => {
    let finalCat = selectedCategory;

    if (selectedCategory === '__new') {
      finalCat = (newCategory || '').trim();
      if (!finalCat) {
        alert('Masukkan nama kategori baru atau pilih kategori existing.');
        return;
      }
    }

    if (onSave) onSave(finalCat); // Kirim kategori yang benar ke parent
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h5 style={{ margin: 0 }}>Edit Produk</h5>
          <button className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>

        <div style={styles.modalBody}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nama produk"
            name="editName"
            value={name}
            onChange={onChange}
          />

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Harga"
            name="editPrice"
            value={price}
            onChange={onChange}
          />

          {Array.isArray(categoryOptions) && categoryOptions.length > 0 ? (
            <>
              <select
                className="form-select mb-2"
                value={selectedCategory || ''}
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                <option value="">-- Pilih kategori --</option>
                {categoryOptions.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                <option value="__new">+ Tambah kategori baru</option>
              </select>

              {selectedCategory === '__new' && (
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Masukkan kategori baru"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                  autoFocus
                />
              )}
            </>
          ) : (
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Kategori"
              name="editCategory"
              value={category}
              onChange={onChange}
            />
          )}
        </div>

        <div style={styles.modalFooter}>
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1050
  },
  modal: {
    width: 460,
    maxWidth: '94%',
    background: '#ffffff',
    color: '#212529',
    borderRadius: 8,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    border: '1px solid #e9ecef'
  },
  modalHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalBody: { padding: 16 },
  modalFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8
  }
};