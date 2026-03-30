import InputField from "./InputField";

export default function UserForm() {
  return (
    <div className="flex flex-col items-center justify-center m-5 p-5 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Tambah User</h2>
        <label className="block text-gray-700 font-medium">Nama</label>
        <InputField label="Nama" type="text" placeholder="Silahkan ketik Nama..."/>
        
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Masukkan Email"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <label className="block text-gray-700 font-medium">Tanggal Lahir</label>
        <InputField label="Tanggal Lahir" type="date" placeholder="Masukkan Tanggal Lahir"/>
    
        <button className="w-full bg-green-500 text-white p-2 rounded">
          Simpan
        </button>
      </div>
    </div>
  );
}
