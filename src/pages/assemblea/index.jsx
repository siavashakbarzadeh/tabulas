import React, { useEffect, useState, useRef, useCallback } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
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
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [news, setNews] = useState([]);
  const [newsExpanded, setNewsExpanded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Reset filters when changing tabs
  useEffect(() => {
    setSearchQuery('');
    setDateFilter('');
    setMatchCount(0);
    setCurrentMatch(0);
  }, [activeSection]);

  // Count and navigate matches
  useEffect(() => {
    if (!contentRef.current || !searchQuery) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    const marks = contentRef.current.querySelectorAll('mark[data-search-match]');
    setMatchCount(marks.length);
    if (marks.length > 0 && currentMatch === 0) {
      setCurrentMatch(1);
      scrollToMatch(1);
    }
  }, [searchQuery, sections, activeSection]);

  // Scroll to specific match
  const scrollToMatch = useCallback((index) => {
    if (!contentRef.current) return;
    
    const marks = contentRef.current.querySelectorAll('mark[data-search-match]');
    marks.forEach((mark, i) => {
      if (i === index - 1) {
        // Current match - bold orange
        mark.style.background = '#f97316';
        mark.style.color = '#000';
        mark.style.fontWeight = 'bold';
        mark.style.padding = '1px 4px';
      } else {
        // Other matches - light yellow
        mark.style.background = '#fef3c7';
        mark.style.color = 'inherit';
        mark.style.fontWeight = 'inherit';
        mark.style.padding = '0 2px';
      }
    });
    
    if (marks[index - 1]) {
      marks[index - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const goToNextMatch = () => {
    if (matchCount === 0) return;
    const next = currentMatch >= matchCount ? 1 : currentMatch + 1;
    setCurrentMatch(next);
    scrollToMatch(next);
  };

  const goToPrevMatch = () => {
    if (matchCount === 0) return;
    const prev = currentMatch <= 1 ? matchCount : currentMatch - 1;
    setCurrentMatch(prev);
    scrollToMatch(prev);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMatchCount(0);
    setCurrentMatch(0);
  };

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
    if (lowerName.includes('comunicati')) return 'comunicati';
    if (lowerName.includes('calendario')) return 'calendario';
    if (lowerName.includes('ordine')) return 'ordine';
    return 'other';
  };

  // Filter content based on search
  const filterContent = (html) => {
    if (!searchQuery) return html;
    
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    html = html.replace(regex, '<mark data-search-match style="background: #fef3c7; padding: 0 2px; border-radius: 2px;">$1</mark>');
    
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
      // Fetch assemblea data and news in parallel
      const [assembleaRes, newsRes] = await Promise.all([
        swaggerApi.get("/v2/tabulas/kiosk/assemblea"),
        swaggerApi.get("/v1/tabulas/news/nodes").catch(() => ({ data: null }))
      ]);
      
      const data = assembleaRes.data;
      
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
      
      // Parse news
      if (newsRes.data?.docNodes) {
        setNews(newsRes.data.docNodes.slice(0, 20)); // Limit to 20 news items
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
      {/* Main white background wrapper */}
      <div className="bg-white rounded-2xl p-4 lg:p-6">
        {/* Two column layout: main content (8) + news sidebar (4) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - 8 columns */}
          <div className="flex-1 lg:w-8/12">
          {/* Top section: Tabs + Filters */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Section tabs */}
            {sections.length > 0 && (
              <div className="flex flex-wrap gap-3">
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

            {/* Search and Date Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <input
                  type="text"
                  placeholder="Cerca nel contenuto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-gray-50 text-sm rounded-lg border border-gray-200 pl-10 pr-4 focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                  aria-label="Cerca nel contenuto"
                />
                <i className="fa-duotone fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true"></i>
              </div>
              
              {(sectionType === 'comunicati' || sectionType === 'calendario') && (
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  max={sectionType === 'comunicati' ? getTodayDate() : undefined}
                  min={sectionType === 'calendario' ? getTodayDate() : undefined}
                  className="h-10 bg-gray-50 text-sm rounded-lg border border-gray-200 px-3 focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all cursor-pointer"
                  aria-label={sectionType === 'comunicati' ? 'Filtra data (fino ad oggi)' : 'Filtra data (da oggi)'}
                />
              )}
            </div>
          </div>

          {/* YouTube Live Stream - Diretta */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-video w-full lg:max-w-sm">
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

          {/* Mobile News Section - Ultime Notizie */}
          <div className="lg:hidden mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <button
                onClick={() => setNewsExpanded(!newsExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <i className="fa-duotone fa-newspaper text-red-800" aria-hidden="true"></i>
                  <span className="font-semibold text-gray-800">Ultime Notizie</span>
                  <span className="text-xs text-gray-500">({news.length})</span>
                </div>
                <i className={`fa-duotone fa-chevron-down text-gray-400 transition-transform ${newsExpanded ? 'rotate-180' : ''}`} aria-hidden="true"></i>
              </button>
              
              {newsExpanded && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {news.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">Nessuna notizia</p>
                  ) : (
                    news.slice(0, 10).map((item, idx) => {
                      const match = item.name?.match(/^(\d{2}\.\d{2})\s+(.+)$/);
                      const time = match ? match[1] : '';
                      const headline = match ? match[2].replace(/^\+\+\s*/, '').replace(/\s*\+\+$/, '') : item.name || '';
                      return (
                        <div key={idx} className="p-2 bg-white rounded-lg text-xs">
                          <div className="flex items-start gap-2">
                            {time && <span className="text-red-800 font-mono bg-red-100 px-1 rounded">{time}</span>}
                            <p className="text-gray-700 line-clamp-2">{headline}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
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

      {/* Search Navigation Bar - Bottom Center */}
      {searchQuery && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-50">
          <span className="text-sm font-semibold min-w-[50px] text-center bg-white text-gray-900 px-2 py-0.5 rounded">
            {matchCount > 0 ? `${currentMatch}/${matchCount}` : '0/0'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevMatch}
              disabled={matchCount === 0}
              className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-bold"
              aria-label="Risultato precedente"
            >
              ↑
            </button>
            <button
              onClick={goToNextMatch}
              disabled={matchCount === 0}
              className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-bold"
              aria-label="Risultato successivo"
            >
              ↓
            </button>
          </div>
          <button
            onClick={clearSearch}
            className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center transition-colors text-lg font-bold"
            aria-label="Cancella ricerca"
          >
            ✕
          </button>
        </div>
      )}

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
        
        /* Search match highlighting */
        .assemblea-content mark[data-search-match] {
          background: #fef3c7 !important;
          color: inherit !important;
          padding: 0 2px;
          border-radius: 2px;
        }
      `}</style>
          </div>

          {/* Sidebar - Desktop only (Diretta + Ultime Notizie) */}
          <div className="hidden lg:block lg:w-4/12 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            {/* Diretta - YouTube Live Stream */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
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

            {/* Ultime Notizie Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <i className="fa-duotone fa-newspaper text-red-800 text-lg" aria-hidden="true"></i>
              <h2 className="text-lg font-semibold text-gray-800">Ultime Notizie</h2>
            </div>
            
            {/* News list */}
            <div className="space-y-2">
              {news.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Nessuna notizia disponibile</p>
              ) : (
                news.map((item, idx) => {
                  const match = item.name?.match(/^(\d{2}\.\d{2})\s+(.+)$/);
                  const time = match ? match[1] : '';
                  const headline = match ? match[2].replace(/^\+\+\s*/, '').replace(/\s*\+\+$/, '') : item.name || '';
                  
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 hover:bg-red-50/50 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-2">
                        {time && (
                          <span className="text-xs font-mono text-red-800 bg-red-100 px-1.5 py-0.5 rounded flex-shrink-0">
                            {time}
                          </span>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2 group-hover:text-gray-900">
                          {headline}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssembleaPage;
