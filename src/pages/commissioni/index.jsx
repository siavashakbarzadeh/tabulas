import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

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

  const handleOpenModal = (htmlContent) => {
    setModalContent(htmlContent || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent("");
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
    // "today" can be changed to always anchor on Monday, or to the actual current day
    const today = new Date();
    // Start from Monday of this week
    const monday = new Date(today);
    // In JS, getDay() gives: Sunday = 0, Monday = 1, etc.
    const dayOfWeek = monday.getDay() === 0 ? 7 : monday.getDay(); 
    monday.setDate(today.getDate() - (dayOfWeek - 1));

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      // For the cell label, e.g. "lunedì 18 marzo"
      const label = currentDay.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      days.push(label);
    }
    return days;
  };

  // Our columns: 
  // 1) Name (blank label in thead) 
  // 2) Convocazioni
  // 3) The 7 dynamic days
  // 4) Ultima seduta
  const columns = [
    { id: "name", label: "" },
    { id: "convocazioni", label: "Convocazioni" },
    ...getCurrentWeekDays().map((dayLabel) => ({ id: dayLabel, label: dayLabel })),
    { id: "ultimaSeduta", label: "Ultima Seduta" },
  ];

  // Helper that tries to find a child named exactly "Convocazioni", "Ultima seduta", "lunedì", etc.
  const findChildByName = (parentDocNode, targetName) => {
    if (!parentDocNode?.docNodes) return null;
    // match by name, ignoring case
    return parentDocNode.docNodes.find(
      (child) => child.name?.toLowerCase() === targetName.toLowerCase()
    );
  };

  // Because the columns have "lunedì 18 marzo", "martedì 19 marzo", etc.,
  // we only want to match the first word (e.g. "lunedì", "martedì", etc.)
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

        {/* Iterate over ALL first-level docNodes (e.g. "Quadro sinottico", "Permanenti", etc.) */}
        {data?.docNodes
          ?.filter((topNode) => topNode?.docNodes?.length > 0) // only tables that have children
          .map((topNode, tableIdx) => (
            <div
              key={tableIdx}
              className="border border-gray-300 rounded-md overflow-hidden mb-6"
            >
              {/* Table Title (the first-level docNode name) */}
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
                  {/* Each second-level docNode => one row */}
                  {topNode.docNodes?.map((rowNode, rowIdx) => {
                    // rowNode is e.g. "1ª Commissione permanente"
                    return (
                      <tr key={rowIdx} className="odd:bg-white even:bg-gray-50">
                        {columns.map((col, colIdx) => {
                          // Switch logic based on col.id
                          if (col.id === "name") {
                            // The row's name (e.g. "1ª Commissione permanente")
                            return (
                              <td
                                key={colIdx}
                                className="border border-gray-300 px-3 py-2 font-semibold text-sm"
                              >
                                {rowNode.name}
                              </td>
                            );
                          } else if (col.id === "convocazioni") {
                            // If there's a child named "Convocazioni" => show link
                            const convocazioniNode = findChildByName(
                              rowNode,
                              "Convocazioni"
                            );
                            return (
                              <td
                                key={colIdx}
                                className="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                {convocazioniNode?.docContentUrl ? (
                                  <a
                                    href={convocazioniNode.docContentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Link
                                  </a>
                                ) : null}
                              </td>
                            );
                          } else if (col.id === "ultimaSeduta") {
                            // If there's a child named "Ultima seduta", show icon to open the modal
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
                                    onClick={() =>
                                      handleOpenModal(
                                        ultimaNode.docContentStreamContent
                                      )
                                    }
                                  >
                                    <i
                                      className="fas fa-file-alt text-xl"
                                      title="Ultima Seduta"
                                    ></i>
                                  </span>
                                )}
                              </td>
                            );
                          } else {
                            // Otherwise, assume it's a day column => "lunedì 18 marzo", "martedì 19 marzo", etc.
                            const dayNode = getDayNode(rowNode, col.label);
                            return (
                              <td
                                key={colIdx}
                                className="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                {dayNode?.docContentUrl ? (
                                  <a
                                    href={dayNode.docContentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Link
                                  </a>
                                ) : null}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      {/* Modal for Ultima Seduta (or any other HTML content) */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-3/4 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Ultima Seduta</h2>
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
