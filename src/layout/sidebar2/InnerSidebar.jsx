import React, { useState } from "react";

function InnerSidebar({ docNodes, activeNode, onSelect }) {
  const itemsPerPage = 7;
  const totalPages = Math.ceil(docNodes.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNodes = docNodes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-64 bg-gray-100 p-4 rounded-lg">
      <ul>
        {currentNodes.map((node, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => onSelect(node.name)}
              className={`block w-full text-left px-4 py-2 rounded ${activeNode === node.name
                  ? "bg-red-700 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
            >
              {node.name}
            </button>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default InnerSidebar;
