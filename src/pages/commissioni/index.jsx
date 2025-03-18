import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
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

  const handleOpenModal = (content) => {
    setModalContent(content);
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
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1); // Get Monday
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      days.push(
        currentDay.toLocaleDateString("it-IT", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    }
    return days;
  };

  const columns = [
    { label: "Convocazioni" },
    ...getCurrentWeekDays().map((day) => ({ label: day })),
    { label: "Ultima Seduta" },
  ];

  const getDayContent = (docNode, dayName) => {
    const dayNode = docNode.docNodes?.find(
      (node) => node.name.toLowerCase() === dayName.toLowerCase()
    );
    return dayNode ? (
      <a
        href={dayNode.docContentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Link
      </a>
    ) : null;
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

        {/* Calendar Table */}
        {data?.docNodes
          ?.find((node) => node.name === "Permanenti")
          ?.docNodes?.map((commission, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-md overflow-hidden mb-6"
            >
              <div className="bg-red-800 text-white px-4 py-2 text-lg font-semibold">
                {commission.name}
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
                  {commission.docNodes?.map((subNode, sIdx) => (
                    <tr key={sIdx} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-semibold text-sm">
                        {subNode.name}
                      </td>

                      {/* Days columns */}
                      {columns.slice(1, 8).map((col, idx) => (
                        <td
                          key={idx}
                          className="border border-gray-300 px-3 py-2 text-sm text-center"
                        >
                          {getDayContent(subNode, col.label)}
                        </td>
                      ))}

                      {/* Ultima Seduta */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                        {subNode.docNodes?.some(
                          (n) => n.name === "Ultima seduta"
                        ) && (
                          <span
                            className="inline-block cursor-pointer"
                            onClick={() =>
                              handleOpenModal(
                                subNode.docNodes.find(
                                  (n) => n.name === "Ultima seduta"
                                )?.docContentStreamContent
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      {/* Modal for Ultima Seduta */}
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
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CommissioniPage;