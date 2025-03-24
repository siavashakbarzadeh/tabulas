import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 20;

function Ultimidossierage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ultimdossier")
      .then((res) => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const displayedRecords = records.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-right">Document Identifier</th>
              <th className="py-3 px-4 text-right">Servizio</th>
              <th className="py-3 px-4 text-right">Date</th>
              <th className="py-3 px-4 text-right">Label</th>
            </tr>
          </thead>
          <tbody>
            {displayedRecords.map((record, index) => (
              <React.Fragment key={index}>
                {/* Header row */}
                <tr className="border-b bg-gray-100">
                  <td className="py-3 px-4 text-right">{record.documentIdentifier}</td>
                  <td className="py-3 px-4 text-right">{record.servizio}</td>
                  <td className="py-3 px-4 text-right">{record.date}</td>
                  <td className="py-3 px-4 text-right">{record.label}</td>
                </tr>
                {/* Content row */}
                <tr className="border-b bg-white">
                  <td colSpan="4" className="py-3 px-4 text-right">
                    <strong>Description:</strong> {record.description || "-"}
                    {record.riferimenti.length > 0 && (
                      <>
                        <br />
                        <strong>Riferimenti:</strong>
                        <ul className="list-disc ml-6 text-right">
                          {record.riferimenti.map((ref, idx) => (
                            <li key={idx}>{ref}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ultimidossierage;
