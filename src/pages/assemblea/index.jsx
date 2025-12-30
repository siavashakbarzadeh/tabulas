import React, { useEffect, useState } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

function AssembleaPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Add click handler for links in rich-text-content
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  // Intercept clicks on links inside rich-text-content to open in popup
  const handleLinkClick = (e) => {
    const link = e.target.closest('.rich-text-content a');
    if (link) {
      e.preventDefault();
      const url = link.href;
      const title = link.textContent || 'Documento';
      openInPopupWindow(url, title);
    }
  };

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

  const cleanHtml = (html) => {
    if (!html) return '';
    return html.replace(/style="[^"]*"/gi, '');
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
        <h1 className="text-2xl font-bold text-red-800 mb-6">Assemblea</h1>
        
        {/* Section tabs */}
        {sections.length > 0 && (
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex flex-wrap gap-2" aria-label="Sezioni">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(idx)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeSection === idx
                      ? 'bg-red-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-selected={activeSection === idx}
                  role="tab"
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Active section content */}
        {sections[activeSection] && (
          <section 
            className="bg-gray-50 rounded-lg p-6"
            role="tabpanel"
            aria-label={sections[activeSection].name}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {sections[activeSection].name}
            </h2>
            <div 
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: sections[activeSection].content }}
            />
          </section>
        )}

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun contenuto disponibile
          </div>
        )}
      </div>
    </div>
  );
}

export default AssembleaPage;
