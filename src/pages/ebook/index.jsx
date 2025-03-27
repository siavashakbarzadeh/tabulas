import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 10; // Adjust as needed

function EbookPage() {
  const [loading, setLoading] = useState(true);
  const [ebookHtml, setEbookHtml] = useState("");
  const [ebooks, setEbooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // When ebookHtml is loaded, parse it into ebook items
  useEffect(() => {
    if (ebookHtml) {
      parseEbookHtml(ebookHtml);
    }
  }, [ebookHtml]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch your ebook JSON from the backend
      const res = await axios.get("tabulas/mobile/ebook");
      // Assume the JSON structure contains docContentStreamContent
      setEbookHtml(res.data.docContentStreamContent || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ebook data:", error);
      setLoading(false);
    }
  };

  const parseEbookHtml = (htmlString) => {
    // Use DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    // Select all <p> elements (assuming each ebook entry is in a <p>)
    const paragraphs = Array.from(doc.querySelectorAll("p"));
    // Filter paragraphs that contain both an <img> and an <a>
    const ebookEntries = paragraphs.filter(
      (p) => p.querySelector("a") && p.querySelector("img")
    );
    const parsed = ebookEntries.map((p) => {
      const linkEl = p.querySelector("a");
      const imgEl = p.querySelector("img");
      return {
        name: linkEl ? linkEl.textContent.trim() : "",
        href: linkEl ? linkEl.getAttribute("href") : "",
        icon: imgEl ? imgEl.getAttribute("src") : "",
      };
    });
    setEbooks(parsed);
  };

  // Filter ebooks if a search query is provided
  const filteredEbooks = query
    ? ebooks.filter((ebook) =>
      ebook.name.toLowerCase().includes(query.toLowerCase())
    )
    : ebooks;

  // Pagination logic: slice filtered results
  const totalPages = Math.ceil(filteredEbooks.length / ITEMS_PER_PAGE);
  const displayedEbooks = filteredEbooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col min-h-screen w-full p-4 md:p-8 bg-white rounded-md">
      {/* Full-width Search Bar */}
      <form className="w-full mb-6">
        <label className="relative w-full flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mr-2" />
          <input
            type="text"
            placeholder="Cerca ebook..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-12 bg-gray-100 text-gray-800 text-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-xl"
          />
        </label>
      </form>

      <div className="flex-1 bg-white mx-auto w-full">
        {loading ? (
          <Loading />
        ) : ebooks.length === 0 ? (
          <p className="text-center text-gray-600">No ebooks found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="py-3 px-4 text-left">Ebook Disponibili</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {displayedEbooks.map((ebook, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{ebook.name || "Scriba"}</td>
                  <td className="py-3 px-4">
                    {ebook.icon ? (
                      <a
                        href={ebook.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      // Optionally, use window.open in an onClick handler to pop up a new tab
                      >
                        <i className="fa-duotone fa-book-section text-xl text-red-800"></i>

                      </a>
                    ) : (
                      "Scriba"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination: Show "Load More" button if there are more ebooks */}
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
      </div>
    </div>
  );
}

export default EbookPage;
