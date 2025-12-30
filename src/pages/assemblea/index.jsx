import React, { useEffect, useState, useRef } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";
import "../../assets/css/custom/rich-text-content.css";

// Senato TV YouTube Live Stream - specific video that's always live
const SENATO_YOUTUBE_VIDEO_ID = "sPbVV3E737E";

function AssembleaPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Reset filters when changing tabs
  useEffect(() => {
    setSearchQuery('');
    setDateFilter('');
  }, [activeSection]);

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
    
    let cleaned = html.replace(/style="[^"]*"/gi, '');
    cleaned = cleaned.replace(/<div[^>]*id="?dxSmall"?[^>]*>[\s\S]*?<\/div>/gi, '');
    cleaned = cleaned.replace(/onclick="[^"]*"/gi, '');
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

  // Get section type for filter logic
  const getSectionType = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('comunicati')) return 'comunicati'; // past dates
    if (lowerName.includes('calendario')) return 'calendario'; // future dates
    if (lowerName.includes('ordine')) return 'ordine'; // search only
    return 'other';
  };

  // Filter content based on search and date
  const filterContent = (html) => {
    if (!searchQuery && !dateFilter) return html;
    
    // Simple highlight for search
    if (searchQuery) {
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      html = html.replace(regex, '<mark style="background: #fef3c7; padding: 0 2px;">$1</mark>');
    }
    
    return html;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
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
          type: getSectionType(node.name || ''),
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

  const currentSection = sections[activeSection];
  const sectionType = currentSection?.type || 'other';

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* White container like other pages */}
      <div className="flex-1 bg-white rounded-2xl relative p-6">
        {/* Top section: Tabs on left, YouTube on right - aligned heights */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Section tabs - left side, same height as video, centered */}
          <div className="flex-1 flex items-center">
            {sections.length > 0 && (
              <div className="flex flex-wrap gap-3 w-full">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(idx)}
                    className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2.5 ${
                      activeSection === idx
                        ? 'bg-red-800 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-selected={activeSection === idx}
                    role="tab"
                  >
                    <i className={`fa-duotone ${section.icon} text-lg`} aria-hidden="true"></i>
                    <span className="hidden sm:inline">{section.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Live Stream - top right */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm h-full border border-gray-100">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${SENATO_YOUTUBE_VIDEO_ID}?autoplay=1&mute=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Senato TV - In diretta"
                />
              </div>
              <div className="px-3 py-2 flex items-center gap-2 bg-white border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-red-600 font-medium text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  In diretta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cerca nel contenuto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-gray-50 text-sm rounded-xl border border-gray-200 pl-12 pr-4 focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
              aria-label="Cerca nel contenuto"
            />
            <img
              src={SearchIcon}
              alt=""
              className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 opacity-50"
              aria-hidden="true"
            />
          </div>
          
          {/* Date filter - only for comunicati and calendario */}
          {(sectionType === 'comunicati' || sectionType === 'calendario') && (
            <div className="sm:w-56">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                max={sectionType === 'comunicati' ? getTodayDate() : undefined}
                min={sectionType === 'calendario' ? getTodayDate() : undefined}
                className="w-full h-12 bg-gray-50 text-sm rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                aria-label={sectionType === 'comunicati' ? 'Filtra per data (fino ad oggi)' : 'Filtra per data (da oggi in poi)'}
              />
              <p className="text-xs text-gray-500 mt-1 px-1">
                {sectionType === 'comunicati' ? 'Date passate (max oggi)' : 'Date future (min oggi)'}
              </p>
            </div>
          )}
        </div>

        {/* Active section content */}
        {currentSection && (
          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
            {/* Section header */}
            <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-4">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <i className={`fa-duotone ${currentSection.icon}`} aria-hidden="true"></i>
                {currentSection.name}
              </h2>
            </div>
            
            {/* Content with styled cards */}
            <div 
              ref={contentRef}
              className="p-6 assemblea-content bg-white"
              dangerouslySetInnerHTML={{ __html: filterContent(currentSection.content) }}
            />
          </div>
        )}

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="fa-duotone fa-inbox text-4xl mb-4" aria-hidden="true"></i>
            <p>Nessun contenuto disponibile</p>
          </div>
        )}
      </div>

      {/* Custom styles for assemblea content */}
      <style>{`
        .assemblea-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #374151;
        }
        
        .assemblea-content * {
          font-family: inherit !important;
          color: inherit !important;
          background: transparent !important;
        }
        
        .assemblea-content h1,
        .assemblea-content h2,
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
          border-radius: 0.625rem;
          font-size: 0.95rem;
          margin: 1.5rem 0 1rem;
          font-weight: 600;
        }
        
        .assemblea-content p,
        .assemblea-content div {
          margin-bottom: 0.75rem;
        }
        
        .assemblea-content ul,
        .assemblea-content ol {
          background: #f8f9fa !important;
          padding: 1.5rem 1.5rem 1.5rem 2.5rem !important;
          border-radius: 0.75rem;
          margin: 1rem 0;
          border: 1px solid #e5e7eb !important;
        }
        
        .assemblea-content li {
          margin-bottom: 0.625rem;
          line-height: 1.7;
        }
        
        /* Links with pastel red background */
        .assemblea-content a {
          color: #97002D !important;
          font-weight: 500;
          text-decoration: none;
          background: #fef2f2 !important;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid #fecaca;
        }
        
        .assemblea-content a:hover {
          background: #fee2e2 !important;
          color: #7f1d1d !important;
        }
        
        .assemblea-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
        
        .assemblea-content b,
        .assemblea-content strong {
          font-weight: 600;
          color: #1f2937 !important;
        }
        
        /* Date badges */
        .assemblea-content .data,
        .assemblea-content [class*="data"] {
          display: inline-block;
          background: #97002D !important;
          color: white !important;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 500;
          margin: 0.5rem 0;
        }
        
        /* Better table styling */
        .assemblea-content table {
          width: 100% !important;
          border-collapse: collapse;
          margin: 1rem 0;
          background: white !important;
        }
        
        .assemblea-content th {
          background: #97002D !important;
          color: white !important;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
        }
        
        .assemblea-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .assemblea-content tr:hover td {
          background: #f9fafb !important;
        }
      `}</style>
    </div>
  );
}

export default AssembleaPage;
