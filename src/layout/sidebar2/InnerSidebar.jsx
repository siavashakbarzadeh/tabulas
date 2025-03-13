import React from "react";

function InnerSidebar({ docNodes, activeNode, onSelect }) {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <ul>
        {docNodes.map((node, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => onSelect(node.name)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeNode === node.name
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              {node.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InnerSidebar;
