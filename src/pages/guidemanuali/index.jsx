import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 10; // Number of items to show initially and per "Load More"

function GuidemanualiPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("tabulas/mobile/guidemanuali");
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching guide data:", error);
      setLoading(false);
    }
  };

  // Filter docNodes if a search query is provided
  const filteredDocNodes =
    data && data.docNodes
      ? data.docNodes.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      : [];

  const totalPages = Math.ceil(filteredDocNodes.length / ITEMS_PER_PAGE);
  const displayedItems = filteredDocNodes.slice(0, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 w-full">
      {/* Full-width search bar */}
      <form className="w-full max-w-3xl mx-auto mb-6">
        <label className="relative w-full flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mr-2" />
          <input
            type="text"
            placeholder="Cerca..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-12 bg-gray-100 text-gray-800 text-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-xl"
          />
        </label>
      </form>

      {/* Centered card container for the guide items */}
      <div className="flex-1 bg-white mx-auto w-full max-w-3xl rounded-2xl shadow-lg p-6">
        {loading || data === null ? (
          <Loading />
        ) : (
          <>
            {/* Header title */}
            <div className="text-center font-medium text-lg mb-4">
              {data.name}
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-800 text-white">
                  <th className="py-3 px-4 text-left">Guide e Manuali</th>
                  <th className="py-3 px-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{item.name || "-"}</td>
                    <td className="py-3 px-4">
                      {item.docContentUrl ? (
                        <a
                          href={item.docContentUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-duotone fa-file-pdf text-xl text-red-800"></i>
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GuidemanualiPage;
