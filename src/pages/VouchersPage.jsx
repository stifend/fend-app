import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import EmptyState from '../components/EmptyState';

const VouchersPage = () => {
  const { getAllVouchers, addVoucher, deleteVoucher } = useData();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_amount: '',
    is_percentage: false
  });

  const fetchVouchers = async () => {
    setLoading(true);
    const data = await getAllVouchers();
    setVouchers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        discount_amount: Number(formData.discount_amount),
        is_percentage: formData.is_percentage
      };
      
      await addVoucher(dataToSubmit);
      setIsModalOpen(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        discount_amount: '',
        is_percentage: false
      });
      fetchVouchers();
    } catch (err) {
      alert('Gagal menambahkan voucher. Kode mungkin sudah ada atau terjadi kesalahan.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus voucher ini?')) {
      try {
        await deleteVoucher(id);
        fetchVouchers();
      } catch (err) {
        alert('Gagal menghapus voucher.');
        console.error(err);
      }
    }
  };

  // Setup Table Headers
  const tableColumns = [
    { header: 'Kode', key: 'code', render: (val) => <strong style={{color: '#1d4ed8'}}>{val}</strong> },
    { header: 'Nama', key: 'name' },
    { header: 'Deskripsi', key: 'description' },
    { header: 'Diskon', key: 'discount', render: (_, row) => row.is_percentage ? `${(row.discount_amount * 100).toFixed(0)}%` : `Rp ${Number(row.discount_amount).toLocaleString('id-ID')}` },
    { header: 'Aksi', key: 'action', render: (_, row) => <Button variant="danger" size="small" onClick={() => handleDelete(row.id)}>Hapus</Button> }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Kelola Voucher</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Tambah Voucher</Button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data voucher...</div>
      ) : vouchers.length > 0 ? (
        <div className="card">
          <Table columns={tableColumns} data={vouchers} />
        </div>
      ) : (
        <EmptyState 
          icon={<span style={{fontSize: '48px'}}>🎟️</span>}
          title="Belum ada Voucher" 
          message="Tambahkan voucher pertama untuk diberikan kepada member" 
          action={<Button onClick={() => setIsModalOpen(true)}>Tambah Voucher</Button>}
        />
      )}

      {/* Modal Tambah Voucher */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tambah Voucher Baru"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Kode Voucher" 
            name="code" 
            value={formData.code} 
            onChange={handleInputChange} 
            placeholder="Contoh: PROMO10" 
            required 
            style={{ textTransform: 'uppercase' }}
          />
          <Input 
            label="Nama Voucher" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Contoh: Diskon 10%" 
            required 
          />
          <Input 
            label="Deskripsi" 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Contoh: Potongan harga spesial" 
          />
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Input 
                label="Nominal/Persentase Diskon" 
                name="discount_amount" 
                type="number" 
                step="any"
                value={formData.discount_amount} 
                onChange={handleInputChange} 
                placeholder={formData.is_percentage ? "Contoh: 0.1 (untuk 10%)" : "Contoh: 50000"} 
                required 
              />
            </div>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              name="is_percentage" 
              checked={formData.is_percentage} 
              onChange={handleInputChange} 
            />
            <span>Gunakan Persentase (centang untuk Persen, biarkan kosong untuk Nominal Rupiah)</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Voucher'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VouchersPage;
