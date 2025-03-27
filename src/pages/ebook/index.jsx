import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig"; // adjust path if needed
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

function EbookPage() {
  const [loading, setLoading] = useState(true);
  const [ebookHtml, setEbookHtml] = useState("");
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // When ebookHtml is set, parse it into ebook items
  useEffect(() => {
    if (ebookHtml) {
      parseEbookHtml(ebookHtml);
    }
  }, [ebookHtml]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch the JSON from your backend (it contains docContentStreamContent)
      const res = await axios.get("tabulas/mobile/ebook");
      // Assume res.data has the structure and docContentStreamContent is our HTML string.
      setEbookHtml(res.data.docContentStreamContent);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ebook data:", error);
      setLoading(false);
    }
  };

  const parseEbookHtml = (htmlString) => {
    // Use DOMParser to parse the HTML string.
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    // Get all paragraph elements
    const paragraphs = Array.from(doc.querySelectorAll("p"));
    // We assume ebook entries have an <img> and an <a> inside.
    const ebookEntries = paragraphs.filter((p) => p.querySelector("a") && p.querySelector("img"));
    const parsedEbooks = ebookEntries.map((p) => {
      const linkEl = p.querySelector("a");
      const imgEl = p.querySelector("img");
      return {
        name: linkEl ? linkEl.textContent.trim() : "",
        href: linkEl ? linkEl.getAttribute("href") : "",
        icon: imgEl ? imgEl.getAttribute("src") : "",
      };
    });
    setEbooks(parsedEbooks);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 w-full flex flex-col items-center">
      {/* Full-width Search Bar */}
      <form className="w-full max-w-3xl mb-6">
        <label className="relative w-full flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mr-2" />
          <input
            type="text"
            placeholder="Cerca..."
            className="w-full h-12 bg-gray-100 text-gray-800 text-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-xl"
          />
        </label>
      </form>

      {/* Centered container for ebook list */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full">
          <tbody>
            {ebooks.map((ebook, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4 font-medium">{ebook.name}</td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={ebook.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    // If you prefer a popup, you can use onClick with window.open instead
                    onClick={(e) => {
                      // e.preventDefault();
                      // window.open(ebook.href, 'popup', 'width=800,height=600');
                    }}
                  >
                    <img src={ebook.icon} alt={ebook.name} className="w-10 h-10" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EbookPage;
