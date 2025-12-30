import React, { useEffect, useState } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 20;

function UltimiattiPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Open URL in a popup window
  const openInPopupWindow = (url, title) => {
    const width = Math.min(1200, window.screen.width * 0.8);
    const height = Math.min(800, window.screen.height * 0.8);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
  };

  const parseHtmlToRecords = (htmlContent) => {
    if (!htmlContent) return [];
    
    const items = htmlContent.split(/<hr[^>]*class="?defrss"?[^>]*>/i);
    
    return items.map((item, idx) => {
      const div = document.createElement('div');
      div.innerHTML = item;
      
      const links = div.querySelectorAll('a');
      const text = div.textContent?.trim() || '';
      
      let title = '';
      let description = '';
      let pdfUrl = '';
      
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.toLowerCase().includes('.pdf')) {
          pdfUrl = href;
        }
        if (!title && link.textContent.trim()) {
          title = link.textContent.trim();
        }
      });
      
      description = text.replace(title, '').trim().substring(0, 200);
      
      if (!title && !description) return null;
      
      return {
        id: idx,
        title: title || `Documento ${idx + 1}`,
        description: description,
        pdfUrl: pdfUrl
      };
    }).filter(Boolean);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await swaggerApi.get("/v2/tabulas/mobile/ultimiatti");
      const data = res.data;
      
      if (data?.docNodes?.[0]?.docContentStreamContent) {
        const parsed = parseHtmlToRecords(data.docNodes[0].docContentStreamContent);
        setRecords(parsed);
      } else {
        setRecords([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ultimi atti data:", error);
      setError("Errore nel caricamento dei dati");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
        >
          Riprova
        </button>
      </div>
    );
  }

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
              className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-14 ring-0 focus:ring-2 focus:ring-red-800"
              aria-label="Cerca documenti"
            />
            <img
              src={SearchIcon}
              alt=""
              className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
              aria-hidden="true"
            />
          </label>
        </form>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          {records.length} documenti trovati
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" role="table">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="py-3 px-4 text-left font-semibold" scope="col">Documento</th>
                <th className="py-3 px-4 text-left font-semibold" scope="col">Descrizione</th>
                <th className="py-3 px-4 text-center font-semibold w-24" scope="col">PDF</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.map((record, index) => (
                <tr 
                  key={record.id} 
                  className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {record.title}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {record.description || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {record.pdfUrl ? (
                      <button 
                        onClick={() => openInPopupWindow(record.pdfUrl, record.title)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        aria-label={`Scarica PDF: ${record.title}`}
                      >
                        <i className="fa-duotone fa-file-pdf text-xl text-red-800" aria-hidden="true"></i>
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {records.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun documento trovato
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center mt-6 gap-2" aria-label="Paginazione">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina precedente"
            >
              ← Prec
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Pagina {currentPage} di {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina successiva"
            >
              Succ →
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default UltimiattiPage;
