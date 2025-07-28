import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';

class Kasir extends Component {
  state = {
    items: [],
    newItem: '',
    newPrice: '',
    transactions: []
  };

  componentDidMount() {
    const savedItems = JSON.parse(localStorage.getItem('kasirItems')) || [];
    const savedTransactions = JSON.parse(localStorage.getItem('kasirTransactions')) || [];

    const restoredItems = savedItems.map(item => ({
      ...item,
      qty: item.checked ? 1 : 0
    }));

    this.setState({ items: restoredItems, transactions: savedTransactions });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.items !== this.state.items) {
      localStorage.setItem(
        'kasirItems',
        JSON.stringify(this.state.items.map(item => ({
          name: item.name,
          price: item.price,
          checked: item.checked
        })))
      );
    }

    if (prevState.transactions !== this.state.transactions) {
      localStorage.setItem('kasirTransactions', JSON.stringify(this.state.transactions));
    }
  }

  handleCheckbox = (index) => {
    const items = [...this.state.items];
    items[index].checked = !items[index].checked;
    items[index].qty = items[index].checked ? 1 : 0;
    this.setState({ items });
  };

  handleQtyChange = (index, delta) => {
    const items = [...this.state.items];
    if (items[index].checked) {
      items[index].qty = Math.max(1, items[index].qty + delta);
      this.setState({ items });
    }
  };

  handleAddItem = () => {
    const { newItem, newPrice, items } = this.state;
    if (newItem.trim() && newPrice.trim()) {
      const newProduct = {
        name: newItem,
        price: parseInt(newPrice),
        qty: 0,
        checked: false
      };
      this.setState({
        items: [...items, newProduct],
        newItem: '',
        newPrice: ''
      });
    }
  };

  handleDeleteItem = (index) => {
    const confirmed = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirmed) return;

    const items = [...this.state.items];
    items.splice(index, 1);
    this.setState({ items });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  calculateTotal = () => {
    return this.state.items
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  handleSaveTransaction = () => {
    const selected = this.state.items.filter(item => item.checked);
    if (selected.length === 0) {
      alert("Pilih produk terlebih dahulu.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: selected,
      total: this.calculateTotal()
    };

    this.setState({
      transactions: [...this.state.transactions, newTransaction],
      items: this.state.items.map(item => ({ ...item, checked: false, qty: 0 }))
    });

    alert("Transaksi berhasil disimpan!");
  };

  handleDeleteTransaction = (id) => {
    const confirmed = window.confirm("Yakin ingin menghapus transaksi ini?");
    if (!confirmed) return;

    const transactions = this.state.transactions.filter(trx => trx.id !== id);
    this.setState({ transactions });
  };

  resetAllCheckboxes = () => {
    const items = this.state.items.map(item => ({
      ...item,
      checked: false,
      qty: 0
    }));
    this.setState({ items });
  };

  handleExportPDF = (trx) => {
    const doc = new jsPDF();
    doc.text("Struk Transaksi", 10, 10);
    doc.text(`Tanggal: ${trx.date}`, 10, 20);
    trx.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} x${item.qty} = Rp ${item.qty * item.price}`, 10, 30 + index * 10);
    });
    doc.text(`Total: Rp ${trx.total}`, 10, 30 + trx.items.length * 10);
    doc.save(`transaksi-${trx.id}.pdf`);
  };

  render() {
    const { items, newItem, newPrice, transactions } = this.state;

    return (
      <div className="container mt-4">
        <div className="card shadow-sm p-4 bg-white rounded">
          <h3 className="text-center mb-4">🧾 Kasir React JS</h3>

          {/* Tambah Produk */}
          <div className="row mb-3">
            <div className="col-sm-5 mb-2">
              <input
                type="text"
                className="form-control"
                name="newItem"
                placeholder="Nama produk"
                value={newItem}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="col-sm-3 mb-2">
              <input
                type="number"
                className="form-control"
                name="newPrice"
                placeholder="Harga"
                value={newPrice}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="col-sm-4 mb-2">
              <button className="btn btn-primary w-100" onClick={this.handleAddItem}>
                Tambah Produk
              </button>
            </div>
          </div>

          {/* Daftar Produk */}
          <ul className="list-group mb-3">
            {items.length === 0 && <p className="text-muted">Belum ada produk.</p>}
            {items.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center flex-wrap">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={item.checked}
                    onChange={() => this.handleCheckbox(index)}
                  />
                  <strong className="me-2">{item.name}</strong>
                  <span className="badge bg-secondary me-2">Rp {item.price.toLocaleString()}</span>
                </div>
                <div className="d-flex align-items-center">
                  {item.checked && (
                    <div className="me-2">
                      <button className="btn btn-sm btn-outline-danger me-1" onClick={() => this.handleQtyChange(index, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button className="btn btn-sm btn-outline-success ms-1" onClick={() => this.handleQtyChange(index, 1)}>+</button>
                    </div>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => this.handleDeleteItem(index)}>Hapus</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <button className="btn btn-warning btn-sm" onClick={this.resetAllCheckboxes}>
              Reset Checkbox
            </button>
            <h5>Total: <span className="badge bg-success">Rp {this.calculateTotal().toLocaleString()}</span></h5>
            <button className="btn btn-success btn-sm" onClick={this.handleSaveTransaction}>
              Simpan Transaksi
            </button>
          </div>
        </div>

        {/* Riwayat Transaksi */}
        <div className="card shadow-sm p-4 mt-4 bg-white rounded">
          <h5 className="mb-3">🗃️ Riwayat Transaksi</h5>
          {transactions.length === 0 && <p className="text-muted">Belum ada transaksi.</p>}
          <ul className="list-group">
            {transactions.map(trx => (
              <li key={trx.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <strong>{trx.date}</strong><br />
                  <small>Total: Rp {trx.total.toLocaleString()}</small>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => this.handleExportPDF(trx)}>Cetak PDF</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => this.handleDeleteTransaction(trx.id)}>Hapus</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Kasir;
