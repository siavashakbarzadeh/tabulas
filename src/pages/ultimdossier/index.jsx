import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import Sidebar from "../../layout/sidebar2/Menu.jsx"; // Global sidebar (if needed)
import InnerSidebar from "../../layout/sidebar2/InnerSidebar.jsx"; // Inner sidebar with pagination

const ITEMS_PER_PAGE = 20;

function Ultimidossierage() {
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
      // If there are docNodes, set the first as active if not already
      if (data.docNodes && data.docNodes.length > 0 && !activeNode) {
        setActiveNode(data.docNodes[0].name);
      }
    }
  }, [data, activeNode]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ultimdossier")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 1) Remove PDF icons from the DOM
  const removePdfIcons = () => {

    const pdfImages = document.querySelectorAll(
      'img[src="https://www.senato.it//img/icona_pdf.gif"]'
    );
    pdfImages.forEach((img) => {
      img.remove();
    });

  };

  // 2) Modify PDF links to show only the PDF icon
  const modifyPdfLinks = () => {
    setTimeout(() => {
      document.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
        link.innerHTML = ""; // Clear existing text
        const icon = document.createElement("i");
        icon.className = "fas fa-file-pdf custom-pdf-icon";
        icon.style.color = "rgb(151, 0, 45)";
        link.appendChild(icon);
      });
    }, 100);
  };

  // 3) Helper to remove parentheses from a DOM element
  function removeParenthesesFrom(element) {
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        // Strip all '(' and ')' from the text
        child.textContent = child.textContent.replace(/[()]/g, "");
      } else {
        removeParenthesesFrom(child);
      }
    });
  }

  if (loading || data === null) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  // Find the active document node
  const activeDocNode = data.docNodes.find((node) => node.name === activeNode);

  // Pagination
  const totalItems = activeDocNode?.docContentStreamContent
    ? activeDocNode.docContentStreamContent.split('<HR class="defrss">').length
    : 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // 4) Split the content, remove parentheses, then build table rows
  const paginatedContent = activeDocNode?.docContentStreamContent
    ?.split('<HR class="defrss">')
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    .map((item, index) => {
      // Create a temporary DOM container for each chunk
      const tempElement = document.createElement("div");
      tempElement.innerHTML = item;

      // Remove parentheses from this chunk
      removeParenthesesFrom(tempElement);
      removePdfIcons();
      // Now build table cells from the processed DOM
      const rows = Array.from(tempElement.children).map((child, idx) => (
        <td
          key={idx}
          className="py-3 px-4 text-left"
          style={{ verticalAlign: "middle" }}
        >
          {child.tagName === "A" ? (
            <span style={{ display: "table-caption" }}>
              <a href={child.href} target="_blank" rel="noopener noreferrer">
                <i
                  className="fas fa-file-pdf mr-2 custom-pdf-icon"
                  style={{ color: "rgb(151, 0, 45)" }}
                ></i>
                {child.textContent}
              </a>
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: child.innerHTML }} />
          )}
        </td>
      ));

      return (
        <tr key={index} className="border-b">
          {rows}
        </tr>
      );
    });

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        <form className="w-full mb-4">
          <label className="w-full block relative">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
            />
          </label>
        </form>

        <div className="flex w-full">
          <InnerSidebar
            docNodes={data.docNodes}
            activeNode={activeNode}
            onSelect={(name) => {
              setActiveNode(name);
              setCurrentPage(1);
            }}
          />
          <div className="flex-1 ml-4 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>{paginatedContent}</tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                    }`}
                >
                  Prev
                </button>
                <span className="text-sm px-3 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded ${currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ultimidossierage;