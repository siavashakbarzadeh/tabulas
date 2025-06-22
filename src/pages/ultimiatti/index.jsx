import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 20;

function UltimiattiPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Endpoint returning your structured JSON (documentIdentifier, date, seduta, etc.)
      const res = await axios.get("tabulas/mobile/ultimiatti");
      setRecords(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ultimi atti data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const displayedRecords = records.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        {/* Search Bar (not currently filtering anything) */}
        <form className="w-full mb-4 dm-mt-8">
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

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr
              style={{ position: "sticky", top: 0, zIndex: 10 }}
              className="bg-red-800 text-white"
            >
              <th className="py-3 px-4 text-left">Identificativo Documento</th>
              <th className="py-3 px-4 text-left">Data</th>
              <th className="py-3 px-4 text-left">Seduta</th>
              <th className="py-3 px-4 text-left">PDF</th>
            </tr>
          </thead>
          <tbody>
            {displayedRecords.map((record, index) => (
              <React.Fragment key={index}>
                {/* Main row */}
                <tr className="border-b bg-gray-100">
                  <td className="py-3 px-4 text-left">
                    {record.documentIdentifier}
                  </td>
                  <td className="py-3 px-4 text-left">{record.date}</td>
                  <td className="py-3 px-4 text-left">{record.seduta}</td>
                  <td className="py-3 px-4 text-left">
                    {record.pdf && record.pdf !== "-" ? (
                      <a href={record.pdf} target="_blank" rel="noopener noreferrer">
                        <i className="fa-duotone fa-file-pdf text-xl text-red-800"></i>
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                {/* Description row */}
                <tr className="border-b bg-white">
                  <td colSpan="4" className="py-3 px-4 text-left description-row">
                    <strong>Descrizione:</strong>{" "}
                    {record.description && record.description !== "-"
                      ? record.description
                      : "-"}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Style block for description row */}
      <style jsx>{`
        .description-row {
          position: relative;
        }
        .description-row::before {
          content: "";
          display: inline-block;
          width: 20px;
          height: 20px;
          position: absolute;
          top: -6px;
          transform: rotate(45deg);
          background: white;
        }
      `}</style>
    </div>
  );
}

export default UltimiattiPage;
