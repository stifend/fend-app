import frameworkData from "./framework.json";
import { useState } from "react";

export default function FrameworkList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const _searchTerm = searchTerm.toLowerCase();

  const allTags = [...new Set(frameworkData.flatMap((fw) => fw.tags))];

  const filteredFrameworks = frameworkData.filter((framework) => {
    const matchesSearch =
      framework.name.toLowerCase().includes(_searchTerm) ||
      framework.description.toLowerCase().includes(_searchTerm);

    const matchesTag = selectedTag
      ? framework.tags.includes(selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      {/* Search & Filter */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search framework..."
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Framework Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFrameworks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <p className="text-sm font-medium text-red-500 mb-2">
              👨‍💻 {item.details.developer}
            </p>
            <a
              href={item.details.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-600 hover:text-blue-800 underline mb-4"
            >
              Visit Website →
            </a>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
