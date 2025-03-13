import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import Menu from "../../components/Menu"; // Adjust the path as needed

const ITEMS_PER_PAGE = 20;

function UltimiattiPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
      modifyPdfLinks();
      // activeNode is now set via the Menu component callback
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
          img.style.display = "none";
        }
        if (!link.querySelector(".custom-pdf-icon")) {
          const icon = document.createElement("i");
          icon.className = "fas fa-file-pdf mr-2 custom-pdf-icon";
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

  // Find the active document node from the fetched data
  const activeDocNode = data.docNodes.find((node) => node.name === activeNode);

  const totalItems = activeDocNode?.docContentStreamContent
    ? activeDocNode.docContentStreamContent.split('<HR class="defrss">').length
    : 0;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedContent = activeDocNode?.docContentStreamContent
    ?.split('<HR class="defrss">')
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    .map((item, index) => {
      // Convert item string into a DOM element
      const tempElement = document.createElement("div");
      tempElement.innerHTML = item;

      // Extract <p> and <a> elements into separate table cells
      const rows = Array.from(tempElement.children).map((child, idx) => (
        <td key={idx} className="py-3 px-4 text-left">
          {child.tagName === "A" ? (
            <a href={child.href} target="_blank" rel="noopener noreferrer">
              <i
                className="fas fa-file-pdf mr-2 custom-pdf-icon"
                style={{ color: "rgb(151, 0, 45)" }}
              ></i>
              {child.textContent}
            </a>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: child.innerHTML }}></span>
          )}
        </td>
      ));

      return <tr key={index} className="border-b">{rows}</tr>;
    });

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

      {/* Dynamic Navbar provided by Menu component */}
      <Menu
        activeItem={activeNode}
        onMenuSelect={(name) => {
          setActiveNode(name);
          setCurrentPage(1);
        }}
      />

      {/* Content Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Titolo</th>
              <th className="py-2 px-4 text-left">Data</th>
              <th className="py-2 px-4 text-left">Seduta</th>
              <th className="py-2 px-4 text-left">Documento</th>
              <th className="py-2 px-4 text-left">piu detagli</th>
            </tr>
          </thead>
          <tbody>{paginatedContent}</tbody>
        </table>
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
