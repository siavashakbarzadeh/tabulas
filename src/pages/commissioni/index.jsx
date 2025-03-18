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

  const columns = [
    { label: "" }, // Empty header for the first column
    { label: "Convocazioni" },
    { label: "Lunedì" },
    { label: "Martedì" },
    { label: "Mercoledì" },
    { label: "Giovedì" },
    { label: "Venerdì" },
    { label: "Sabato" },
    { label: "Domenica" },
    { label: "Ultima Seduta" },
  ];

  const renderDocNode = (docNode) => {
    return (
      <tr className="odd:bg-white even:bg-gray-50">
        {/* First column: Name */}
        <td className="border border-gray-300 px-3 py-2 font-semibold text-sm">
          {docNode.name}
        </td>

        {/* Convocazioni - Display as an icon with link */}
        <td className="border border-gray-300 px-3 py-2 text-sm text-center">
          {docNode.name === "Convocazioni" ? (
            <span
              className="inline-block cursor-pointer"
              onClick={() => handleOpenModal("<p>Convocazioni Content</p>")}
            >
              <i className="fas fa-link text-xl" title="Convocazioni"></i>
            </span>
          ) : null}
        </td>

        {/* Days of the week columns - Empty for now */}
        {columns.slice(2, 8).map((col, idx) => (
          <td key={idx} className="border border-gray-300 px-3 py-2 text-sm text-center"></td>
        ))}

        {/* Ultima Seduta - Display as an icon with popup */}
        <td className="border border-gray-300 px-3 py-2 text-sm text-center">
          {docNode.docNodes?.some((n) => n.name === "Ultima seduta") && (
            <span
              className="inline-block cursor-pointer"
              onClick={() => handleOpenModal(docNode.docContentStreamContent)}
            >
              <i className="fas fa-file-alt text-xl" title="Ultima Seduta"></i>
            </span>
          )}
        </td>
      </tr>
    );
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
        {data?.docNodes?.map((topNode, idx) => (
          <div key={idx} className="border border-gray-300 rounded-md overflow-hidden mb-6">
            <div className="bg-red-800 text-white px-4 py-2 text-lg font-semibold">{topNode.name}</div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-700 text-white">
                  {columns.map((col, cIdx) => (
                    <th key={cIdx} className="py-2 px-3 border border-red-800 text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topNode.docNodes?.map((subNode, sIdx) => (
                  <React.Fragment key={sIdx}>
                    {renderDocNode(subNode)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Modal for Convocazioni and Ultima Seduta */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-3/4 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Contenuto</h2>
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
