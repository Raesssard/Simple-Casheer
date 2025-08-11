// help load/save structured items & transactions
export const loadItems = (key = 'kasirItems') => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('loadItems error', err);
    return [];
  }
};

export const saveItems = (items, key = 'kasirItems') => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('saveItems error', err);
  }
};

export const loadTransactions = (key = 'kasirTransactions') => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('loadTransactions error', err);
    return [];
  }
};

export const saveTransactions = (txs, key = 'kasirTransactions') => {
  try {
    localStorage.setItem(key, JSON.stringify(txs));
  } catch (err) {
    console.error('saveTransactions error', err);
  }
};
