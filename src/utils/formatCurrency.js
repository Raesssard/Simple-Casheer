export const formatRp = (num = 0) => {
  if (isNaN(num)) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};
