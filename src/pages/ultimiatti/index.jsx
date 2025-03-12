import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

const ITEMS_PER_PAGE = 20;

function UltimiattiPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeNode, setActiveNode] = useState(null); // Selected category
  const [currentPage, setCurrentPage] = useState(1); // Pagination state

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
      modifyPdfLinks();
      setActiveNode(data.docNodes[0]?.name || null); // Set default active node
    }
  }, [data]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ultimiatti")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modifyPdfLinks = () => {
    setTimeout(() => {
      document.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
        const img = link.querySelector('img[title*=".pdf"]');
        if (img) {
          img.style.display = "none"; // Hide small PDF icon
        }
        if (!link.querySelector(".custom-pdf-icon")) {
          const icon = document.createElement("i");
          icon.className = "fas fa-file-pdf mr-2 custom-pdf-icon"; // Font Awesome icon
          icon.style.color = "rgb(151, 0, 45)";
          link.prepend(icon);
        }
      });
    }, 100);
  };

  if (loading || data === null) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  const activeDocNode = data.docNodes.find((node) => node.name === activeNode);

  // Pagination logic
  const totalItems = activeDocNode?.docContentStreamContent
    ? activeDocNode.docContentStreamContent.split("<HR class=\"defrss\">").length
    : 0;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedContent = activeDocNode?.docContentStreamContent
    ?.split("<HR class=\"defrss\">")
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    .join("<HR class=\"defrss\">");

  return (
    <div className="w-full bg-white rounded-2xl relative px-4 pt-4 pb-13">
      {/* Search Bar */}
      <form className="w-full">
        <label className="w-full block relative before:w-px before:h-2/3 before:bg-neutral-300 before:absolute before:left-14 before:top-1/2 before:-translate-y-1/2">
          <input
            type="text"
            placeholder="Cerca..."
            className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
          />
          <img
            src={SearchIcon}
            alt="Search"
            className="w-6 h-6 select-none absolute left-4 top-1/2 -translate-y-1/2"
          />
        </label>
      </form>

      {/* Navbar for Doc Nodes */}
      <div className="flex overflow-x-auto mt-4 space-x-3 border-b pb-2">
        {data.docNodes.map((node, key) => (
          <button
            key={key}
            onClick={() => {
              setActiveNode(node.name);
              setCurrentPage(1); // Reset pagination
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              activeNode === node.name ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            {node.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeDocNode && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: paginatedContent,
            }}
          ></div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            Prev
          </button>
          <span className="text-sm px-3 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UltimiattiPage;


