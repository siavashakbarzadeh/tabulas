import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import InnerSidebar from "../../layout/sidebar2/InnerSidebar.jsx"; // If you have an inner sidebar

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
      // If there are docNodes, set the first as active if not already
      if (data.docNodes && data.docNodes.length > 0 && !activeNode) {
        setActiveNode(data.docNodes[0].name);
      }
    }
  }, [data, activeNode]);

  // -----------------------
  // 1) Fetch Data from API
  // -----------------------
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

  // -----------------------------------
  // 2) Helper to Remove Parentheses
  // -----------------------------------
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

  // -----------------------------------
  // 3) Helper to Remove PDF Icon <img>
  // -----------------------------------
  function removePdfIconsFrom(element) {
    element
      .querySelectorAll('img[src="https://www.senato.it//img/icona_pdf.gif"]')
      .forEach((img) => {
        img.remove();
      });
  }

  // --------------------------------------------------------
  // 4) Helper to Transform .pdf Links into PDF Icon Only
  // --------------------------------------------------------
  function transformPdfLinks(element) {
    element.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
      // Remove any existing text or child nodes in the link
      link.innerHTML = "";
      // Create the PDF icon element
      const icon = document.createElement("i");
      icon.className = "fas fa-file-pdf custom-pdf-icon";
      icon.style.color = "rgb(151, 0, 45)";
      // Append only the icon to the link
      link.appendChild(icon);
    });
  }

  // -----------------------------------
  // Render Loading State
  // -----------------------------------
  if (loading || data === null) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  // Find the active document node
  const activeDocNode = data.docNodes.find((node) => node.name === activeNode);

  // Handle pagination
  const totalItems = activeDocNode?.docContentStreamContent
    ? activeDocNode.docContentStreamContent.split('<HR class="defrss">').length
    : 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // -----------------------------------
  // 5) Build Paginated Table Rows
  // -----------------------------------
  const paginatedContent = activeDocNode?.docContentStreamContent
    ?.split('<HR class="defrss">')
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    .map((item, index) => {
      // Create a temporary DOM container for each chunk
      const tempElement = document.createElement("div");
      tempElement.innerHTML = item;

      // Apply transformations in memory
      removeParenthesesFrom(tempElement);
      removePdfIconsFrom(tempElement);
      transformPdfLinks(tempElement);

      // Convert each child element into an array of <td> elements
      const childElements = Array.from(tempElement.children);

      // If we have at least 4 children, check if #2 and #3 combined length > 70
      let secondRowContent = null;
      if (childElements.length >= 4) {
        const thirdText = childElements[2].textContent.trim();
        const fourthText = childElements[3].textContent.trim();
        const combinedLength = thirdText.length + fourthText.length;

        if (combinedLength > 70) {
          // Combine the third & fourth child's HTML for a single cell
          const combinedHTML =
            childElements[2].innerHTML + "<br/>" + childElements[3].innerHTML;

          // Remove them from the childElements for the main row
          // Keep the first 2, and any beyond the 4th
          const afterFourth = childElements.slice(4); // If there are more than 4
          childElements.splice(2); // remove everything after second index
          childElements.push(...afterFourth);

          // Prepare a "second row" cell that spans the entire table width
          // We'll just store it in secondRowContent, then render it below
          secondRowContent = combinedHTML;
        }
      }

      // Build the main row's cells
      const mainRowCells = childElements.map((child, idx) => (
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

      // If we created a secondRowContent, we render an additional row
      // with a single cell spanning all columns
      const numColumns = mainRowCells.length || 1;

      return (
        <React.Fragment key={index}>
          {/* First (main) row */}
          <tr className="border-b">{mainRowCells}</tr>

          {/* Second row if needed */}
          {secondRowContent && (
            <tr className="border-b">
              <td
                colSpan={numColumns}
                className="py-3 px-4 text-left"
                style={{ verticalAlign: "middle" }}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: secondRowContent }}
                />
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });

  // -----------------------------------
  // Final JSX Return
  // -----------------------------------
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        {/* Search Bar */}
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
          {/* Inner Sidebar */}
          <InnerSidebar
            docNodes={data.docNodes}
            activeNode={activeNode}
            onSelect={(name) => {
              setActiveNode(name);
              setCurrentPage(1);
            }}
          />

          {/* Main Content Area */}
          <div className="flex-1 ml-4 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>{paginatedContent}</tbody>
            </table>

            {/* Pagination Controls */}
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
                <span className="text-sm px-3 py-1">
                  {`Page ${currentPage} of ${totalPages}`}
                </span>
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
