import React, { useEffect, useState, useRef } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

// Senato TV YouTube Live Stream
const SENATO_YOUTUBE_EMBED = "https://www.youtube.com/embed/live_stream?channel=UCySGVkEUDJmPYnWsBqgsVMA&autoplay=1&mute=1";

function AssembleaPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Set up click handler for links when content changes
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        e.preventDefault();
        e.stopPropagation();
        const url = link.href;
        const title = link.textContent || 'Documento';
        openInPopupWindow(url, title);
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [activeSection, sections]);

  // Open URL in a popup window
  const openInPopupWindow = (url, title) => {
    const width = Math.min(1200, window.screen.width * 0.8);
    const height = Math.min(800, window.screen.height * 0.8);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      url,
      title.substring(0, 50),
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
  };

  // Clean and prepare HTML content
  const cleanHtml = (html) => {
    if (!html) return '';
    
    // Remove inline styles but keep structure
    let cleaned = html.replace(/style="[^"]*"/gi, '');
    
    // Remove sidebar elements (printable version, etc)
    cleaned = cleaned.replace(/<div[^>]*id="?dxSmall"?[^>]*>[\s\S]*?<\/div>/gi, '');
    
    // Remove onclick handlers (we handle clicks ourselves)
    cleaned = cleaned.replace(/onclick="[^"]*"/gi, '');
    
    // Make sure all links have href
    cleaned = cleaned.replace(/href=["']javascript:[^"']*["']/gi, 'href="#"');
    
    return cleaned;
  };

  // Get icon for section
  const getSectionIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ordine')) return 'fa-list-check';
    if (lowerName.includes('calendario')) return 'fa-calendar';
    if (lowerName.includes('comunicati')) return 'fa-bullhorn';
    return 'fa-file-lines';
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await swaggerApi.get("/v2/tabulas/kiosk/assemblea");
      const data = res.data;
      
      if (data?.docNodes && data.docNodes.length > 0) {
        const parsed = data.docNodes.map((node, idx) => ({
          id: idx,
          name: node.name || `Sezione ${idx + 1}`,
          icon: getSectionIcon(node.name || ''),
          content: cleanHtml(node.docContentStreamContent || '')
        }));
        setSections(parsed);
      } else {
        setSections([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assemblea data:", error);
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

  return (
    <div className="flex flex-col min-h-screen w-full space-y-6">
      {/* YouTube Live Stream Section */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md">
        <div className="aspect-video w-full">
          <iframe
            src={SENATO_YOUTUBE_EMBED}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Senato TV - In diretta"
          />
        </div>
        <div className="px-4 py-3 flex items-center gap-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 text-red-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            In diretta
          </span>
          <span className="text-gray-500 text-sm">Senato TV</span>
        </div>
      </div>

      {/* Section tabs */}
      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeSection === idx
                  ? 'bg-red-800 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              aria-selected={activeSection === idx}
              role="tab"
            >
              <i className={`fa-duotone ${section.icon}`} aria-hidden="true"></i>
              {section.name}
            </button>
          ))}
        </div>
      )}

      {/* Active section content */}
      {sections[activeSection] && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md">
          {/* Section header */}
          <div className="bg-red-800 text-white px-6 py-4">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <i className={`fa-duotone ${sections[activeSection].icon}`} aria-hidden="true"></i>
              {sections[activeSection].name}
            </h2>
          </div>
          
          {/* Content with styled cards */}
          <div 
            ref={contentRef}
            className="p-6 assemblea-content"
            dangerouslySetInnerHTML={{ __html: sections[activeSection].content }}
          />
        </div>
      )}

      {/* Empty state */}
      {sections.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
          <i className="fa-duotone fa-inbox text-4xl mb-4" aria-hidden="true"></i>
          <p>Nessun contenuto disponibile</p>
        </div>
      )}

      {/* Custom styles for assemblea content */}
      <style>{`
        .assemblea-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: #333;
        }
        
        .assemblea-content * {
          font-family: inherit !important;
          color: inherit !important;
          background: transparent !important;
        }
        
        .assemblea-content h1,
        .assemblea-content h2,
        .assemblea-content h3,
        .assemblea-content h4,
        .assemblea-content h5 {
          color: #97002D !important;
          font-weight: 600;
          margin: 1.5rem 0 1rem;
        }
        
        .assemblea-content h3 {
          display: inline-block;
          background: #97002D !important;
          color: white !important;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          margin: 1.5rem 0 1rem;
        }
        
        .assemblea-content p,
        .assemblea-content div {
          margin-bottom: 0.75rem;
        }
        
        .assemblea-content ul,
        .assemblea-content ol {
          background: #f3f4f6 !important;
          padding: 1.25rem 1.25rem 1.25rem 2.5rem !important;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }
        
        .assemblea-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        
        .assemblea-content a {
          color: #97002D !important;
          font-weight: 500;
          text-decoration: underline;
          cursor: pointer;
        }
        
        .assemblea-content a:hover {
          color: #c41048 !important;
        }
        
        .assemblea-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1.5rem 0;
        }
        
        .assemblea-content b,
        .assemblea-content strong {
          font-weight: 600;
          color: #1a1a1a !important;
        }
        
        /* Date badges - matches red style in screenshot */
        .assemblea-content .data,
        .assemblea-content [class*="data"] {
          display: inline-block;
          background: #97002D !important;
          color: white !important;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}

export default AssembleaPage;
