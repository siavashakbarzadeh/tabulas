import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Single modal for both raw HTML and iframes
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(""); // We'll store raw HTML here
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
   *  1) If we have docContentStreamContent => treat as raw HTML
   *  2) Else if we have docContentUrl => open in iframe
   */
  const openModal = (title, node) => {
    if (!node) return;

    setModalTitle(title || "");
    if (node.docContentStreamContent) {
      // Show raw HTML
      setIsIframe(false);
      setModalContent(node.docContentStreamContent);
    } else if (node.docContentUrl) {
      // Show iframe
      setIsIframe(true);
      // We’ll store an <iframe> in `modalContent`, rendered via dangerouslySetInnerHTML
      const iframeHtml = `<iframe 
          src="${node.docContentUrl}" 
          style="width:100%; height:600px;" 
          frameborder="0">
        </iframe>`;
      setModalContent(iframeHtml);
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

  // Generate dynamic headers (Mon-Sun)
  const getCurrentWeekDays = () => {
    const days = [];
    const today = new Date();
    // Anchor on Monday
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

  // Table columns
  const columns = [
    { id: "name", label: "" },
    { id: "convocazioni", label: "Convocazioni" },
    ...getCurrentWeekDays().map((dayLabel) => ({
      id: dayLabel,
      label: dayLabel,
    })),
    { id: "ultimaSeduta", label: "Ultima Seduta" },
  ];

  // Helpers
  const findChildByName = (parent, targetName) => {
    return parent?.docNodes?.find(
      (child) => child.name?.toLowerCase() === targetName.toLowerCase()
    );
  };

  // Our day columns are labeled "lunedì 20 marzo" => we match the first word
  const getDayNode = (parent, fullLabel) => {
    const firstWord = fullLabel.split(" ")[0].toLowerCase();
    return findChildByName(parent, firstWord);
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

        {/* Each first-level docNode => table */}
        {data?.docNodes
          ?.filter((topNode) => topNode.docNodes && topNode.docNodes.length > 0)
          .map((topNode, tableIdx) => (
            <div
              key={tableIdx}
              className="border border-gray-300 rounded-md overflow-hidden mb-6"
            >
              <div className="bg-red-800 text-white px-4 py-2 text-lg font-semibold">
                {topNode.name}
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-700 text-white">
                    {columns.map((col, cIdx) => (
                      <th
                        key={cIdx}
                        className="py-2 px-3 border border-red-800 text-center"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topNode.docNodes.map((rowNode, rowIdx) => (
                    <tr key={rowIdx} className="odd:bg-white even:bg-gray-50">
                      {columns.map((col, colIdx) => {
                        if (col.id === "name") {
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 font-semibold text-sm"
                            >
                              {rowNode.name}
                            </td>
                          );
                        }

                        if (col.id === "convocazioni") {
                          const convocazioniNode = findChildByName(
                            rowNode,
                            "Convocazioni"
                          );
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              {convocazioniNode && (
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() =>
                                    openModal("Convocazioni", convocazioniNode)
                                  }
                                >
                                  <i
                                    className="fas fa-file-alt text-xl"
                                    title="Apri Convocazioni"
                                  />
                                </span>
                              )}
                            </td>
                          );
                        }

                        if (col.id === "ultimaSeduta") {
                          const ultimaNode = findChildByName(
                            rowNode,
                            "Ultima seduta"
                          );
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              {ultimaNode && (
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() => openModal("Ultima Seduta", ultimaNode)}
                                >
                                  <i
                                    className="fas fa-file-alt text-xl"
                                    title="Ultima Seduta"
                                  />
                                </span>
                              )}
                            </td>
                          );
                        }

                        // A day column
                        const dayNode = getDayNode(rowNode, col.label);
                        return (
                          <td
                            key={colIdx}
                            className="border border-gray-300 px-3 py-2 text-sm text-center"
                          >
                            {dayNode && (
                              <span
                                className="inline-block cursor-pointer"
                                onClick={() =>
                                  openModal(`Documento - ${col.label}`, dayNode)
                                }
                              >
                                <i
                                  className="fas fa-file-alt text-xl"
                                  title="Apri Documento"
                                />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      {/* Single Modal */}
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
              style={{ minHeight: "400px" }}
              // If isIframe === false => raw HTML (e.g. Ultima Seduta)
              // If isIframe === true => iframe
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
