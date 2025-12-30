import React, { useEffect, useState, useRef } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

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
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        <h1 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-3">
          <i className="fa-duotone fa-landmark-dome" aria-hidden="true"></i>
          Assemblea
        </h1>
        
        {/* Section cards/tabs */}
        {sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(idx)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  activeSection === idx
                    ? 'border-red-800 bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }`}
                aria-selected={activeSection === idx}
                role="tab"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeSection === idx ? 'bg-red-800 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <i className={`fa-duotone ${section.icon} text-lg`} aria-hidden="true"></i>
                  </div>
                  <span className={`font-medium ${activeSection === idx ? 'text-red-800' : 'text-gray-700'}`}>
                    {section.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active section content */}
        {sections[activeSection] && (
          <section 
            className="bg-gray-50 rounded-xl p-6 shadow-inner"
            role="tabpanel"
            aria-label={sections[activeSection].name}
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-red-800 text-white flex items-center justify-center">
                <i className={`fa-duotone ${sections[activeSection].icon} text-xl`} aria-hidden="true"></i>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {sections[activeSection].name}
              </h2>
            </div>
            
            <div 
              ref={contentRef}
              className="rich-text-content bg-white rounded-lg p-4 shadow-sm"
              dangerouslySetInnerHTML={{ __html: sections[activeSection].content }}
            />
            
            {/* Info message about links */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-center gap-2">
              <i className="fa-duotone fa-info-circle" aria-hidden="true"></i>
              <span>Clicca sui link nel documento per aprirli in una nuova finestra</span>
            </div>
          </section>
        )}

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="fa-duotone fa-inbox text-4xl mb-4" aria-hidden="true"></i>
            <p>Nessun contenuto disponibile</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssembleaPage;
