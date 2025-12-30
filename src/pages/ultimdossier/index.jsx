import React, { useEffect, useState } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 20;

function Ultimidossierage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [modalUrl, setModalUrl] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
      let webUrl = '';
      
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.toLowerCase().includes('.pdf')) {
          pdfUrl = href;
        } else if (href.includes('http')) {
          webUrl = href;
        }
        if (!title && link.textContent.trim()) {
          title = link.textContent.trim();
        }
      });
      
      description = text.replace(title, '').trim().substring(0, 200);
      
      if (!title && !description) return null;
      
      return {
        id: idx,
        title: title || `Dossier ${idx + 1}`,
        description: description,
        pdfUrl: pdfUrl,
        webUrl: webUrl
      };
    }).filter(Boolean);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await swaggerApi.get("/v2/tabulas/mobile/ultimdossier");
      const data = res.data;
      
      if (data?.docNodes?.[0]?.docContentStreamContent) {
        const parsed = parseHtmlToRecords(data.docNodes[0].docContentStreamContent);
        setRecords(parsed);
      } else {
        setRecords([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ultimi dossier data:", error);
      setError("Errore nel caricamento dei dati");
      setLoading(false);
    }
  };

  const openModal = (url, title, isPdfFile = false) => {
    setModalUrl(url);
    setModalTitle(title);
    setIsPdf(isPdfFile);
  };

  const closeModal = () => {
    setModalUrl(null);
    setModalTitle('');
    setIsPdf(false);
  };

  // Get embeddable URL - use Google Docs viewer for PDFs
  const getEmbedUrl = (url) => {
    if (isPdf) {
      // Use Google Docs Viewer to embed PDFs (bypasses CORS)
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return url;
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
              aria-label="Cerca dossier"
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
          {records.length} dossier trovati
        </p>

        {/* Card-style rows with shadow */}
        <div className="space-y-4">
          {displayedRecords.map((record) => (
            <div 
              key={record.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                    {record.title}
                  </h3>
                  {record.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {record.description}
                    </p>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {record.webUrl && (
                    <button 
                      onClick={() => openModal(record.webUrl, record.title, false)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition-colors"
                      aria-label={`Apri online: ${record.title}`}
                    >
                      <i className="fa-duotone fa-globe text-lg" aria-hidden="true"></i>
                      <span className="hidden sm:inline">Web</span>
                    </button>
                  )}
                  {record.pdfUrl && (
                    <button 
                      onClick={() => openModal(record.pdfUrl, record.title, true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-medium transition-colors"
                      aria-label={`Visualizza PDF: ${record.title}`}
                    >
                      <i className="fa-duotone fa-file-pdf text-lg" aria-hidden="true"></i>
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {records.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun dossier trovato
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

      {/* Mac-style Modal Window */}
      {modalUrl && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            {/* Mac-style window header */}
            <div className="flex items-center px-4 py-3 bg-gradient-to-b from-gray-200 to-gray-300 border-b border-gray-400">
              {/* Traffic lights */}
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
                  aria-label="Chiudi"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-red-900 text-xs font-bold leading-none">×</span>
                </button>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              {/* Title */}
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-700 font-medium truncate block px-4">
                  {modalTitle}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={modalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-gray-400/50 hover:bg-gray-400/70 text-xs text-gray-700 transition-colors"
                >
                  Apri in nuova scheda ↗
                </a>
              </div>
            </div>
            
            {/* Content - iframe with Google Docs Viewer for PDFs */}
            <div className="flex-1 bg-white">
              <iframe
                src={getEmbedUrl(modalUrl)}
                className="w-full h-full border-none"
                title={modalTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ultimidossierage;
