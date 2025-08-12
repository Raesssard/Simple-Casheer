import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import EditProductModal from './EditProductModal';
import TransactionHistory from './TransactionHistory';
import { loadItems, saveItems, loadTransactions, saveTransactions } from '../utils/localStorageHelpers';
import { formatRp } from '../utils/formatCurrency';

class Kasir extends Component {
  state = {
    items: [],
    categories: [],
    newItem: '',
    newPrice: '',
    newCategory: '',
    isCustomCategory: false,
    transactions: [],
    searchTerm: '',
    selectedCategory: '',
    sortOption: 'name-asc',
    // edit modal
    showEditModal: false,
    editId: null,
    editName: '',
    editPrice: '',
    editCategory: ''
  };

  componentDidMount() {
    const savedItems = loadItems();
    const savedTransactions = loadTransactions();

    // Inisialisasi categories dari produk yang ada (boleh tetap ada)
    const categories = [
      ...new Set(savedItems.map(item => item.category).filter(Boolean))
    ];

    const restored = savedItems.map(item => ({
      id: item.id || (Date.now() + Math.floor(Math.random() * 1000)),
      name: item.name,
      price: item.price,
      category: item.category || '',
      checked: item.checked || false,
      qty: typeof item.qty === 'number' ? item.qty : (item.checked ? 1 : 0)
    }));

    this.setState({ items: restored, transactions: savedTransactions, categories });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.items !== this.state.items) {
      saveItems(this.state.items);
      // HAPUS kode sync categories otomatis di sini!
    }
    if (prevState.transactions !== this.state.transactions) saveTransactions(this.state.transactions);
  }

  findIndexById = (id) => this.state.items.findIndex(i => i.id === id);

  handleCheckbox = (id) => {
    const items = [...this.state.items];
    const idx = this.findIndexById(id);
    if (idx === -1) return;
    items[idx].checked = !items[idx].checked;
    items[idx].qty = items[idx].checked ? (items[idx].qty || 1) : 0;
    this.setState({ items });
  };

  handleQtyChange = (id, delta) => {
    const items = [...this.state.items];
    const idx = this.findIndexById(id);
    if (idx === -1) return;
    if (items[idx].checked) {
      items[idx].qty = Math.max(1, (items[idx].qty || 1) + delta);
      this.setState({ items });
    }
  };

  handleAddItem = () => {
    const { newItem, newPrice, newCategory, items, categories } = this.state;
    if (!newItem.trim() || newPrice.toString().trim() === '') return;

    const newProduct = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: newItem,
      price: parseInt(newPrice),
      category: newCategory || '',
      qty: 0,
      checked: false
    };

    let updatedCategories = [...categories];
    if (newCategory && !updatedCategories.includes(newCategory)) {
      updatedCategories.push(newCategory);
    }

    this.setState({
      items: [...items, newProduct],
      categories: updatedCategories,
      newItem: '',
      newPrice: '',
      newCategory: '',
      isCustomCategory: false
    });
  };

  handleDeleteItem = (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    const items = this.state.items.filter(i => i.id !== id);
    this.setState({ items });
  };

  openEditModal = (id) => {
    const idx = this.findIndexById(id);
    if (idx === -1) return;
    const item = this.state.items[idx];
    this.setState({
      showEditModal: true,
      editId: id,
      editName: item.name,
      editPrice: item.price,
      editCategory: item.category || ''
    });
  };

  closeEditModal = () => {
    this.setState({ showEditModal: false, editId: null, editName: '', editPrice: '', editCategory: '' });
  };

  handleEditSave = (newCategoryValue) => {
    const { editId, editName, editPrice, categories } = this.state;
    const editCategory = newCategoryValue !== undefined ? newCategoryValue : this.state.editCategory;

    if (!editName.trim() || !editPrice || !editCategory.trim()) {
      alert("Nama, harga, dan kategori harus diisi.");
      return;
    }

    const items = [...this.state.items];
    const idx = this.findIndexById(editId);
    if (idx === -1) return;

    // Update produk
    items[idx] = {
      ...items[idx],
      name: editName.trim(),
      price: parseInt(editPrice),
      category: editCategory.trim()
    };

    // Tambahkan kategori baru ke daftar kalau belum ada
    let updatedCategories = [...categories];
    if (editCategory.trim() && !updatedCategories.includes(editCategory.trim())) {
      updatedCategories.push(editCategory.trim());
    }

    this.setState(
      { items, categories: updatedCategories },
      this.closeEditModal
    );
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  calculateTotal = () => this.state.items.filter(i => i.checked).reduce((s, it) => s + it.price * it.qty, 0);

  handleSaveTransaction = () => {
    const selected = this.state.items.filter(i => i.checked);
    if (selected.length === 0) { alert('Pilih produk terlebih dahulu.'); return; }
    const newTransaction = { id: Date.now(), date: new Date().toLocaleString(), items: selected, total: this.calculateTotal() };
    this.setState({ transactions: [...this.state.transactions, newTransaction], items: this.state.items.map(i => ({ ...i, checked: false, qty: 0 })) });
    alert('Transaksi berhasil disimpan!');
  };

  handleDeleteTransaction = (id) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
    const transactions = this.state.transactions.filter(t => t.id !== id);
    this.setState({ transactions });
  };

  resetAllCheckboxes = () => this.setState({ items: this.state.items.map(i => ({ ...i, checked: false, qty: 0 })) });

  render() {
    const {
      items, newItem, newPrice, newCategory, isCustomCategory,
      transactions, searchTerm, selectedCategory, sortOption,
      showEditModal, editName, editPrice, editCategory, categories
    } = this.state;

    // filter
    let filtered = items.filter(item =>
      item.name.toLowerCase().includes((searchTerm || '').toLowerCase()) &&
      (selectedCategory === '' || item.category === selectedCategory)
    );

    // sort
    if (sortOption === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortOption === 'category-asc') filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    else if (sortOption === 'category-desc') filtered.sort((a, b) => (b.category || '').localeCompare(a.category || ''));

    return (
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div
          className="card shadow-sm p-4 rounded mx-auto"
          style={{
            maxWidth: 1000, // lebih lebar di desktop
            width: '100%',
          }}
        >
          <h3 className="text-center mb-4">🧾 Kasir React JS</h3>

          {/* Filter / Search / Sort */}
          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-4 mb-2 mb-sm-0">
              <input className="form-control" placeholder="Cari produk..." value={searchTerm} name="searchTerm" onChange={this.handleInputChange} />
            </div>
            <div className="col-12 col-sm-3 mb-2 mb-sm-0">
              <select className="form-select" name="selectedCategory" value={selectedCategory} onChange={this.handleInputChange}>
                <option value="">Semua Kategori</option>
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-3 mb-2 mb-sm-0">
              <select className="form-select" name="sortOption" value={sortOption} onChange={this.handleInputChange}>
                <option value="name-asc">Nama A–Z</option>
                <option value="name-desc">Nama Z–A</option>
                <option value="category-asc">Kategori A–Z</option>
                <option value="category-desc">Kategori Z–A</option>
              </select>
            </div>
            <div className="col-12 col-sm-2 d-grid">
              <button className="btn btn-outline-secondary w-100" onClick={() => this.setState({ searchTerm: '', selectedCategory: '', sortOption: 'name-asc' })}>Reset</button>
            </div>
          </div>

          <ProductForm
            newItem={newItem}
            newPrice={newPrice}
            newCategory={newCategory}
            isCustomCategory={isCustomCategory}
            categories={categories}
            onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
            onAdd={this.handleAddItem}
            onToggleCustom={(v) => this.setState({ isCustomCategory: v })}
          />

          <ProductList
            items={filtered}
            onCheckbox={this.handleCheckbox}
            onQtyChange={this.handleQtyChange}
            onEdit={this.openEditModal}
            onDelete={this.handleDeleteItem}
          />

          {/* Tombol bawah responsif */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-0 gap-2 mt-3">
            <button className="btn btn-warning btn-sm w-100 w-sm-auto" onClick={this.resetAllCheckboxes}>Reset Checkbox</button>
            <h5 className="my-2 my-sm-0">Total: <span className="badge bg-success">{formatRp(this.calculateTotal())}</span></h5>
            <button className="btn btn-success btn-sm w-100 w-sm-auto" onClick={this.handleSaveTransaction}>Simpan Transaksi</button>
          </div>
        </div>

        <TransactionHistory transactions={transactions} onDelete={this.handleDeleteTransaction} />

        <EditProductModal
          visible={showEditModal}
          name={editName}
          price={editPrice}
          category={editCategory}
          categories={categories}
          onClose={this.closeEditModal}
          onSave={this.handleEditSave}
          onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
        />
      </div>
    );
  }
}

export default Kasir;