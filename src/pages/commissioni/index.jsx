import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // We still have a modal, but maybe just for day columns. 
  // If you don’t want *any* modal at all, you can remove all modal code.
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/commissioni")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  /**
   *  Opens a new tab with docContentUrl.
   *  If docContentUrl is missing, tries docContentStreamContent (raw HTML).
   */
  const handleOpenUltimaSeduta = (node) => {
    if (!node) return;

    // If there's a URL, open it directly:
    if (node.docContentUrl) {
      window.open(node.docContentUrl, "_blank", "noopener,noreferrer");
    }
    // Otherwise, if we have raw HTML, open a blank tab and write the HTML there.
    else if (node.docContentStreamContent) {
      const newWin = window.open("", "_blank", "noopener,noreferrer");
      if (newWin) {
        newWin.document.write(node.docContentStreamContent);
        newWin.document.close();
      }
    } else {
      alert("Nessun contenuto disponibile per Ultima Seduta.");
    }
  };

  /**
   *  Opens a new tab for "Convocazioni" or day columns 
   *  (since X-Frame-Options may block iframes).
   */
  const handleOpenModalWithUrl = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer,width=900,height=600");
  };

  /**
   * For the day columns, if you still prefer an actual modal with an iframe, 
   * you could do that here. But typically it will be blocked by X-Frame-Options 
   * if from senato.it. 
   */
  const openModal = (title, node) => {
    if (!node) return;

    setModalTitle(title || "");
    if (node.docContentUrl) {
      // show in an iframe => might be blocked
      setIsIframe(true);
      const iframeHtml = `<iframe 
          src="${node.docContentUrl}" 
          style="width:100%; height:600px;" 
          frameborder="0">
        </iframe>`;
      setModalContent(iframeHtml);
    } else if (node.docContentStreamContent) {
      // raw HTML
      setIsIframe(false);
      setModalContent(node.docContentStreamContent);
    } else {
      setModalContent("Nessun contenuto disponibile.");
      setIsIframe(false);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle("");
    setModalContent("");
    setIsIframe(false);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  // Generate dynamic headers for the current week
  const getCurrentWeekDays = () => {
    const days = [];
    const today = new Date();
    // Anchor on Monday (JS: Sunday=0, Monday=1, etc.)
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek - 1));

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);

      const label = currentDay.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      days.push(label);
    }
    return days;
  };

  // Columns
  const columns = [
    { id: "name", label: "" }, // Commission name column
    { id: "convocazioni", label: "Convocazioni" },
    ...getCurrentWeekDays().map((dayLabel) => ({ id: dayLabel, label: dayLabel })),
    { id: "ultimaSeduta", label: "Ultima Seduta" },
  ];

  // Utility: find child docNode by case-insensitive `name`
  const findChildByName = (parent, targetName) => {
    if (!parent?.docNodes) return null;
    return parent.docNodes.find(
      (child) => child.name?.toLowerCase() === targetName.toLowerCase()
    );
  };

  // Since columns are "lunedì 20 marzo ..." we only match the first word
  const getDayNode = (parentDocNode, fullLabel) => {
    const firstWord = fullLabel.split(" ")[0].toLowerCase(); // e.g. "lunedì"
    return findChildByName(parentDocNode, firstWord);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg relative px-4 pt-4 pb-10">
        {/* Search Bar */}
        <form className="w-full mb-4">
          <label className="w-full block relative">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-10 bg-neutral-200 text-sm rounded-md border border-neutral-300 px-4 focus:outline-none"
            />
          </label>
        </form>

        {/* For each first-level node => create a table */}
        {data?.docNodes
          ?.filter((topNode) => topNode.docNodes && topNode.docNodes.length > 0)
          .map((topNode, tableIdx) => (
            <div
              key={tableIdx}
              className="border border-gray-300 rounded-md overflow-hidden mb-6"
            >
              {/* Table Title = topNode.name */}
              <div className="bg-red-800 text-white px-4 py-2 text-lg font-semibold">
                {topNode.name}
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-dark">
                    {columns.map((col, cIdx) => (
                      <th
                        key={cIdx}
                        className="py-2 px-3 border text-center"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Each second-level node => row */}
                  {topNode.docNodes.map((rowNode, rowIdx) => (
                    <tr key={rowIdx} className="odd:bg-white even:bg-gray-50">
                      {columns.map((col, colIdx) => {
                        if (col.id === "name") {
                          //  Row's name
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 font-semibold text-sm"
                            >
                              {rowNode.name}
                            </td>
                          );
                        } else if (col.id === "convocazioni") {
                          //  Child named "Convocazioni"
                          const convocazioniNode = findChildByName(
                            rowNode,
                            "Convocazioni"
                          );
                          // Use a DIFFERENT icon, e.g. fa-calendar-alt
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              {convocazioniNode?.docContentUrl && (
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() =>
                                    handleOpenModalWithUrl(
                                      convocazioniNode.docContentUrl
                                    )
                                  }
                                >
                                  <i
                                    className="fas fa-calendar-alt text-xl"
                                    title="Apri Convocazioni"
                                  ></i>
                                </span>
                              )}
                            </td>
                          );
                        } else if (col.id === "ultimaSeduta") {
                          //  Child named "Ultima seduta"
                          const ultimaNode = findChildByName(
                            rowNode,
                            "Ultima seduta"
                          );
                          // Instead of a modal, open a new tab
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              {ultimaNode && (
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() => handleOpenUltimaSeduta(ultimaNode)}
                                >
                                  <i
                                    className="fas fa-file-alt text-xl"
                                    title="Ultima Seduta"
                                  />
                                </span>
                              )}
                            </td>
                          );
                        } else {
                          //  Day columns
                          const dayNode = getDayNode(rowNode, col.label);
                          if (dayNode?.docContentUrl) {
                            return (
                              <td
                                key={colIdx}
                                className="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() =>
                                    handleOpenModalWithUrl(dayNode.docContentUrl)
                                  }
                                >
                                  <i
                                    className="fas fa-file-alt text-xl"
                                    title="Apri Documento"
                                  ></i>
                                </span>
                              </td>
                            );
                          } else {
                            return (
                              <td
                                key={colIdx}
                                className="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                {/* No link for that day */}
                              </td>
                            );
                          }
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      {/* We still have a modal for day columns if you prefer an iframe, 
          or you could remove it entirely if you never want a modal. */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-3/4 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">{modalTitle}</h2>
            <div
              className="rich-text-content p-4 bg-gray-100 rounded"
              dangerouslySetInnerHTML={{ __html: modalContent }}
            />
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CommissioniPage;
