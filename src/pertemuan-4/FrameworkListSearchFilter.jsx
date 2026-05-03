import frameworkData from "./framework.json";
import { useState } from "react";

export default function FrameworkList() {
  /* Inisialisasi DataForm */
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
    // Tambah state lain di sini jika perlu
  });

  /* Handle perubahan nilai input form */
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value, // Mengupdate property berdasarkan atribut 'name' pada input
    });
  };

  const _searchTerm = dataForm.searchTerm.toLowerCase();

  const allTags = [...new Set(frameworkData.flatMap((fw) => fw.tags))];

  const filteredFrameworks = frameworkData.filter((framework) => {
    const matchesSearch =
      framework.name.toLowerCase().includes(_searchTerm) ||
      framework.description.toLowerCase().includes(_searchTerm);

    const matchesTag = dataForm.selectedTag
      ? framework.tags.includes(dataForm.selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {/* Search & Filter Container */}
      <div className="max-w-6xl mx-auto mb-10 grid gap-4 md:grid-cols-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Input Search */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Search</label>
          <input
            type="text"
            name="searchTerm" // HARUS SAMA dengan property di state
            value={dataForm.searchTerm}
            placeholder="Type framework name..."
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={handleChange} // MENGGUNAKAN handleChange
          />
        </div>

        {/* Select Tag */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Category</label>
          <select
            name="selectedTag" // HARUS SAMA dengan property di state
            value={dataForm.selectedTag}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            onChange={handleChange} // MENGGUNAKAN handleChange
          >
            <option value="">All Roles</option>
            {allTags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Framework Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFrameworks.length > 0 ? (
          filteredFrameworks.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {item.details.developer}
                </span>
              </div>
              
              <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                {item.description}
              </p>

              <div className="border-t border-gray-50 pt-4">
                <a
                  href={item.details.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
                >
                  Visit Docs 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400 italic">
            No frameworks matches your search.
          </div>
        )}
      </div>
    </div>
  );
}