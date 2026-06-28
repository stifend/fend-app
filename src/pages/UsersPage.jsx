// Import React hooks
import { useState, useEffect, useCallback } from "react";
// Import koneksi Supabase
import { supabase } from "../lib/supabase";
// Import komponen reusable
import { Button, Table, Modal, Input, EmptyState, Loading } from "../components";

// Halaman Manajemen User
// - ADMIN  : bisa tambah, edit, hapus user (CRUD penuh)
// - USER   : hanya bisa melihat daftar user (read-only)
const UsersPage = () => {
    // Ambil data user yang sedang login dari localStorage (untuk cek role)
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = currentUser.role === "admin"; // true jika admin

    // State daftar user dari database
    const [users, setUsers] = useState([]);
    // State loading saat ambil data
    const [loading, setLoading] = useState(true);
    // State pesan error
    const [error, setError] = useState("");

    // State kontrol modal (form tambah/edit)
    const [showModal, setShowModal] = useState(false);
    // State menandai apakah sedang edit (null = tambah baru)
    const [editingId, setEditingId] = useState(null);
    // State pesan error di dalam form
    const [formError, setFormError] = useState("");
    // State loading saat menyimpan
    const [saving, setSaving] = useState(false);

    // State data form
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        phone: "",
        address: "",
    });

    // ========== AMBIL DATA USER DARI SUPABASE ==========
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        // Ambil kolom selain password (jangan tampilkan password)
        const { data, error: fetchError } = await supabase
            .from("users")
            .select("id, name, email, role, phone, address, created_at")
            .order("created_at", { ascending: true });

        if (fetchError) {
            setError("Gagal memuat data user.");
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    }, []);

    // Ambil data saat halaman pertama kali dibuka
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- disengaja: ambil data awal dari Supabase
        fetchUsers();
    }, [fetchUsers]);

    // ========== HANDLE FORM ==========
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Buka modal untuk TAMBAH user baru
    const openAddModal = () => {
        setEditingId(null);
        setForm({ name: "", email: "", password: "", role: "user", phone: "", address: "" });
        setFormError("");
        setShowModal(true);
    };

    // Buka modal untuk EDIT user
    const openEditModal = (user) => {
        setEditingId(user.id);
        setForm({
            name: user.name || "",
            email: user.email || "",
            password: "", // kosongkan; isi hanya jika ingin ganti password
            role: user.role || "user",
            phone: user.phone || "",
            address: user.address || "",
        });
        setFormError("");
        setShowModal(true);
    };

    // ========== SIMPAN (TAMBAH / EDIT) ==========
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError("");

        // Validasi sederhana
        if (!form.name || !form.email) {
            setFormError("Nama dan email wajib diisi.");
            return;
        }
        if (!editingId && form.password.length < 6) {
            setFormError("Password minimal 6 karakter.");
            return;
        }

        setSaving(true);

        if (editingId) {
            // ===== MODE EDIT =====
            const updateData = {
                name: form.name,
                email: form.email.toLowerCase(),
                role: form.role,
                phone: form.phone,
                address: form.address,
            };
            // Sertakan password hanya jika diisi (kalau kosong, password lama tetap)
            if (form.password) {
                if (form.password.length < 6) {
                    setFormError("Password minimal 6 karakter.");
                    setSaving(false);
                    return;
                }
                updateData.password = form.password;
            }

            const { error: updateError } = await supabase
                .from("users")
                .update(updateData)
                .eq("id", editingId);

            setSaving(false);
            if (updateError) {
                setFormError(
                    updateError.code === "23505"
                        ? "Email sudah dipakai user lain."
                        : "Gagal menyimpan perubahan."
                );
                return;
            }
        } else {
            // ===== MODE TAMBAH =====
            const { error: insertError } = await supabase.from("users").insert({
                name: form.name,
                email: form.email.toLowerCase(),
                password: form.password, // otomatis di-hash oleh trigger di database
                role: form.role,
                phone: form.phone,
                address: form.address,
            });

            setSaving(false);
            if (insertError) {
                setFormError(
                    insertError.code === "23505"
                        ? "Email sudah terdaftar."
                        : "Gagal menambah user."
                );
                return;
            }
        }

        // Tutup modal dan refresh data
        setShowModal(false);
        fetchUsers();
    };

    // ========== HAPUS USER ==========
    const handleDelete = async (user) => {
        // Cegah admin menghapus akunnya sendiri
        if (user.id === currentUser.id) {
            alert("Anda tidak bisa menghapus akun Anda sendiri.");
            return;
        }
        if (!window.confirm(`Yakin ingin menghapus user "${user.name}"?`)) return;

        const { error: deleteError } = await supabase
            .from("users")
            .delete()
            .eq("id", user.id);

        if (deleteError) {
            alert("Gagal menghapus user.");
        } else {
            fetchUsers();
        }
    };

    // ========== DEFINISI KOLOM TABLE ==========
    const columns = [
        {
            header: "No",
            key: "id",
            width: "70px",
            render: (value, row, index) => index + 1,
        },
        { header: "Nama", key: "name", width: "180px" },
        { header: "Email", key: "email", width: "220px" },
        {
            header: "Role",
            key: "role",
            width: "100px",
            render: (value) => (
                <span
                    style={{
                        padding: "2px 10px",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: value === "admin" ? "#dbeafe" : "#f1f5f9",
                        color: value === "admin" ? "#1d4ed8" : "#475569",
                    }}
                >
                    {value}
                </span>
            ),
        },
        { header: "Telepon", key: "phone", width: "150px" },
    ];

    // Kolom Aksi hanya muncul untuk admin
    if (isAdmin) {
        columns.push({
            header: "Aksi",
            key: "id",
            width: "180px",
            render: (value, row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button variant="primary" size="small" onClick={() => openEditModal(row)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="small" onClick={() => handleDelete(row)}>
                        Hapus
                    </Button>
                </div>
            ),
        });
    }

    return (
        <div className="customer-page">
            {/* Header */}
            <div
                className="customer-page-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
                <h2>Manajemen User</h2>
                {/* Tombol tambah hanya untuk admin */}
                {isAdmin && (
                    <Button variant="success" onClick={openAddModal}>
                        + Tambah User
                    </Button>
                )}
            </div>

            {/* Info untuk user biasa */}
            {!isAdmin && (
                <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                    Anda login sebagai <strong>user</strong>. Halaman ini hanya untuk melihat data.
                </p>
            )}

            {/* Content */}
            <div className="customer-page-content">
                <div className="customer-list-card">
                    {loading ? (
                        <Loading />
                    ) : error ? (
                        <EmptyState
                            icon={<span style={{ fontSize: "48px" }}>⚠️</span>}
                            title="Terjadi kesalahan"
                            message={error}
                        />
                    ) : users.length === 0 ? (
                        <EmptyState
                            icon={<span style={{ fontSize: "48px" }}>👤</span>}
                            title="Tidak ada data user"
                            message="Belum ada user yang terdaftar"
                        />
                    ) : (
                        <Table columns={columns} data={users} className="customer-table" />
                    )}
                </div>
            </div>

            {/* ========== MODAL FORM (TAMBAH / EDIT) ========== */}
            {isAdmin && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingId ? "Edit User" : "Tambah User"}
                >
                    <form onSubmit={handleSave}>
                        {formError && (
                            <p style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "0.9rem" }}>
                                {formError}
                            </p>
                        )}

                        <Input
                            label="Nama Lengkap"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="Nama lengkap"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleFormChange}
                            placeholder="email@example.com"
                            required
                        />
                        <Input
                            label={editingId ? "Password (kosongkan jika tidak diubah)" : "Password"}
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleFormChange}
                            placeholder={editingId ? "••••••" : "Minimal 6 karakter"}
                        />

                        {/* Pilih Role */}
                        <div className="input-component">
                            <label htmlFor="role" className="input-label">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={handleFormChange}
                                className="input-field"
                            >
                                <option value="user">user (hanya lihat)</option>
                                <option value="admin">admin (CRUD penuh)</option>
                            </select>
                        </div>

                        <Input
                            label="Telepon"
                            name="phone"
                            value={form.phone}
                            onChange={handleFormChange}
                            placeholder="+62 812-xxxx-xxxx"
                        />
                        <Input
                            label="Alamat"
                            name="address"
                            value={form.address}
                            onChange={handleFormChange}
                            placeholder="Alamat"
                        />

                        {/* Tombol aksi modal */}
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button variant="primary" type="submit" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default UsersPage;
