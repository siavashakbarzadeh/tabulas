import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

function CommissioniPageBase({ pageTitle }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [sinotticoData, setSinotticoData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [weekOffset, setWeekOffset] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data?.docNodes?.length) {
            data.docNodes.forEach((topNode) => {
                const commName = topNode.name;
                if (!commName) return;

                swaggerApi
                    .get(`/v1/tabulas/sinottico/?descTipoCommissione='${commName}'`)
                    .then((res) => {
                        setSinotticoData((prev) => ({
                            ...prev,
                            [commName]: res.data,
                        }));
                    })
                    .catch((err) => {
                        console.error("Error fetching sinottico for", commName, err);
                    });
            });
        }
    }, [data]);

    const fetchData = () => {
        setLoading(true);
        swaggerApi
            .get("/v2/tabulas/mobile/commissioni")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const openInPopupWindow = (url) => {
        if (!url) return;
        const width = Math.min(1200, window.screen.width * 0.8);
        const height = Math.min(800, window.screen.height * 0.8);
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        window.open(
            url,
            'Documento',
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
        );
    };

    const handleOpenUltimaSeduta = (node) => {
        if (!node) return;
        setModalTitle("Ultima Seduta");

        if (node.docContentStreamContent) {
            setModalContent(node.docContentStreamContent);
        } else if (node.docContentUrl) {
            openInPopupWindow(node.docContentUrl);
            return;
        } else {
            setModalContent("Nessun contenuto disponibile.");
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalTitle("");
        setModalContent("");
    };

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                handleCloseModal();
            }
        };
        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showModal]);

    if (loading) {
        return <Loading />;
    }

    const getWeekDays = (offset = 0) => {
        const days = [];
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek - 1) + (offset * 7));

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(monday);
            currentDay.setDate(monday.getDate() + i);
            
            days.push({
                date: currentDay,
                dayName: currentDay.toLocaleDateString("it-IT", { weekday: "short" }),
                dayNum: currentDay.getDate(),
                monthName: currentDay.toLocaleDateString("it-IT", { month: "short" }),
                fullLabel: currentDay.toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                isToday: currentDay.toDateString() === new Date().toDateString(),
                isWeekend: i >= 5,
            });
        }
        return days;
    };

    const weekDays = getWeekDays(weekOffset);
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];

    const findChildByName = (parent, targetName) => {
        if (!parent?.docNodes) return null;
        return parent.docNodes.find(
            (child) => child.name?.toLowerCase() === targetName.toLowerCase()
        );
    };

    const getDayNode = (parentDocNode, fullLabel) => {
        const firstWord = fullLabel.split(" ")[0].toLowerCase();
        return findChildByName(parentDocNode, firstWord);
    };

    const getSinotticoForRow = (topNodeName, rowName) => {
        const sinotticoList = sinotticoData[topNodeName] || [];
        // Extract commission number from row name (e.g., "1ª Commissione" -> "1")
        const commNum = rowName?.match(/(\d+)/)?.[1];
        
        // Try exact match first
        let match = sinotticoList.find((item) => item.nomeComm === rowName);
        
        // Try partial match if no exact match
        if (!match && rowName) {
            match = sinotticoList.find((item) => 
                item.nomeComm?.toLowerCase().includes(rowName.toLowerCase()) ||
                rowName.toLowerCase().includes(item.nomeComm?.toLowerCase())
            );
        }
        
        // Try matching by commission number
        if (!match && commNum) {
            match = sinotticoList.find((item) => 
                item.nomeComm?.includes(`${commNum}ª`) || 
                item.nomeComm?.includes(`${commNum}°`) ||
                item.nomeComm?.match(new RegExp(`\\b${commNum}\\b`))
            );
        }
        
        return match;
    };

    const getSinoGiornoInfo = (sinotticoItem, targetDateStr) => {
        if (!sinotticoItem?.sinoGiorni) return null;

        const splitted = targetDateStr.split(" ");
        if (splitted.length < 4) return null;
        const day = splitted[1].padStart(2, "0");
        const monthName = splitted[2].toLowerCase();
        const year = splitted[3];

        const monthMap = {
            gennaio: "01", febbraio: "02", marzo: "03", aprile: "04",
            maggio: "05", giugno: "06", luglio: "07", agosto: "08",
            settembre: "09", ottobre: "10", novembre: "11", dicembre: "12",
        };
        const mm = monthMap[monthName] || "01";
        const formattedStr = `${day}/${mm}/${year}`;

        return sinotticoItem.sinoGiorni.find((g) => g.dataGiorno === formattedStr);
    };

    // Get icon for commission type
    const getTabIcon = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('permanent')) return 'fa-building-columns';
        if (lowerName.includes('special')) return 'fa-star';
        if (lowerName.includes('bicamer')) return 'fa-link';
        if (lowerName.includes('giunte')) return 'fa-scale-balanced';
        return 'fa-clipboard-list';
    };

    const filteredDocNodes = data?.docNodes?.filter((topNode) => {
        if (!topNode.docNodes || topNode.docNodes.length === 0) return false;
        if (!pageTitle) return true;
        return topNode.name === pageTitle;
    }) || [];

    const currentTopNode = filteredDocNodes[activeTab];

    return (
        <>
            <div className="flex flex-col min-h-screen w-full">
                <div className="flex-1 bg-white rounded-2xl relative p-6 space-y-4">
                {/* Tabs for commission types */}
                {filteredDocNodes.length > 1 && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {filteredDocNodes.map((topNode, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                        activeTab === idx
                                            ? 'bg-red-800 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <i className={`fa-duotone ${getTabIcon(topNode.name)}`} aria-hidden="true"></i>
                                    <span className="hidden md:inline">{topNode.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Week Navigation */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setWeekOffset(weekOffset - 1)}
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-lg"
                            aria-label="Settimana precedente"
                        >
                            ←
                        </button>
                        
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {weekStart.dayNum} {weekStart.monthName} - {weekEnd.dayNum} {weekEnd.monthName}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {weekOffset === 0 ? 'Questa settimana' : 
                                 weekOffset === -1 ? 'Settimana scorsa' :
                                 weekOffset === 1 ? 'Prossima settimana' :
                                 `${Math.abs(weekOffset)} settimane ${weekOffset > 0 ? 'avanti' : 'fa'}`}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setWeekOffset(weekOffset + 1)}
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-lg"
                            aria-label="Settimana successiva"
                        >
                            →
                        </button>
                    </div>
                    
                    {weekOffset !== 0 && (
                        <button
                            onClick={() => setWeekOffset(0)}
                            className="mt-3 w-full py-2 text-sm text-red-800 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            ↻ Torna a oggi
                        </button>
                    )}
                </div>

                {/* Calendar Grid for Active Tab */}
                {currentTopNode && (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        {/* Section Header */}
                        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-4">
                            <h2 className="text-xl font-semibold flex items-center gap-3">
                                <i className={`fa-duotone ${getTabIcon(currentTopNode.name)}`} aria-hidden="true"></i>
                                {currentTopNode.name}
                            </h2>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-8 bg-gray-100 text-gray-700 text-sm font-medium">
                            <div className="p-3 border-r border-gray-200">
                                Commissione
                            </div>
                            {weekDays.map((day, idx) => (
                                <div
                                    key={idx}
                                    className={`p-2 text-center border-r border-gray-200 last:border-r-0 ${
                                        day.isToday ? 'bg-red-100' : ''
                                    } ${day.isWeekend ? 'bg-gray-200/50' : ''}`}
                                >
                                    <div className="text-xs uppercase opacity-70">{day.dayName}</div>
                                    <div className={`text-lg font-bold ${day.isToday ? 'text-red-800' : ''}`}>
                                        {day.dayNum}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Commission Rows */}
                        {currentTopNode.docNodes.map((rowNode, rowIdx) => {
                            const rowSinottico = getSinotticoForRow(currentTopNode.name, rowNode.name);
                            const convocazioniNode = findChildByName(rowNode, "Convocazioni");
                            const ultimaNode = findChildByName(rowNode, "Ultima seduta");
                            const convUrl = convocazioniNode?.docContentUrl || rowSinottico?.convocazioneUrl;
                            
                            return (
                                <div
                                    key={rowIdx}
                                    className={`grid grid-cols-8 border-t border-gray-100 ${
                                        rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    } hover:bg-red-50/30 transition-colors`}
                                >
                                    {/* Commission Name */}
                                    <div className="p-3 border-r border-gray-200 flex items-center justify-between gap-2">
                                        <span className="font-medium text-sm text-gray-800 truncate">{rowNode.name}</span>
                                        <div className="flex gap-1 flex-shrink-0">
                                            {convUrl && (
                                                <button
                                                    onClick={() => openInPopupWindow(convUrl)}
                                                    className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 flex items-center justify-center text-xs transition-colors"
                                                    title="Convocazioni"
                                                >
                                                    <i className="fa-duotone fa-calendar-alt" aria-hidden="true"></i>
                                                </button>
                                            )}
                                            {ultimaNode && (
                                                <button
                                                    onClick={() => handleOpenUltimaSeduta(ultimaNode)}
                                                    className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 flex items-center justify-center text-xs transition-colors"
                                                    title="Ultima Seduta"
                                                >
                                                    <i className="fa-duotone fa-file-lines" aria-hidden="true"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Day Cells */}
                                    {weekDays.map((day, dayIdx) => {
                                        const dayNode = getDayNode(rowNode, day.fullLabel);
                                        const sinoDayInfo = getSinoGiornoInfo(rowSinottico, day.fullLabel);
                                        const hasContent = dayNode?.docContentUrl || sinoDayInfo;
                                        
                                        // Build convocazioni URL for this commission
                                        const commNum = rowNode.name?.match(/(\d+)/)?.[1] || '';
                                        const convocazioniUrl = commNum ? `https://www.senato.it/CLS/pub/conv/0/${commNum}` : convUrl;
                                        
                                        return (
                                            <div
                                                key={dayIdx}
                                                className={`p-2 border-r border-gray-200 last:border-r-0 text-center min-h-[60px] flex flex-col justify-center ${
                                                    day.isToday ? 'bg-yellow-50/50' : ''
                                                } ${day.isWeekend ? 'bg-gray-100/30' : ''}`}
                                            >
                                                {sinoDayInfo && (
                                                    <button
                                                        onClick={() => openInPopupWindow(convocazioniUrl)}
                                                        className="w-full px-2 py-1.5 bg-red-800 hover:bg-red-900 text-white text-xs rounded transition-colors"
                                                    >
                                                        {sinoDayInfo.primaConvOra || '—'}
                                                    </button>
                                                )}
                                                {!sinoDayInfo && !dayNode?.docContentUrl && (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                                {!sinoDayInfo && dayNode?.docContentUrl && (
                                                    <button
                                                        onClick={() => openInPopupWindow(dayNode.docContentUrl)}
                                                        className="w-full px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
                                                    >
                                                        Apri
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {filteredDocNodes.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                        <i className="fa-duotone fa-clipboard-list text-4xl mb-4 block" aria-hidden="true"></i>
                        <p>Nessuna commissione disponibile</p>
                    </div>
                )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
                    >
                        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{modalTitle}</h3>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div
                            className="commissioni-modal-content p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(90vh - 80px)" }}
                            dangerouslySetInnerHTML={{ __html: modalContent }}
                        />
                    </div>
                </div>
            )}

            {/* Custom styles for modal content */}
            <style>{`
                .commissioni-modal-content {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #374151;
                }
                
                .commissioni-modal-content * {
                    font-family: inherit !important;
                    background: transparent !important;
                }
                
                .commissioni-modal-content h1,
                .commissioni-modal-content h2,
                .commissioni-modal-content h3,
                .commissioni-modal-content h4,
                .commissioni-modal-content h5 {
                    color: #97002D !important;
                    font-weight: 600;
                    margin: 1.25rem 0 0.75rem;
                }
                
                .commissioni-modal-content h2 {
                    font-size: 1.25rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #f3f4f6;
                }
                
                .commissioni-modal-content h3 {
                    font-size: 1.1rem;
                }
                
                .commissioni-modal-content p {
                    margin-bottom: 0.75rem;
                }
                
                .commissioni-modal-content a {
                    color: #97002D !important;
                    font-weight: 500;
                    text-decoration: none;
                    background: #fef2f2 !important;
                    padding: 0.125rem 0.5rem;
                    border-radius: 0.25rem;
                    transition: all 0.2s;
                }
                
                .commissioni-modal-content a:hover {
                    background: #fee2e2 !important;
                    color: #7f1d1d !important;
                }
                
                .commissioni-modal-content ul,
                .commissioni-modal-content ol {
                    background: #f8f9fa !important;
                    padding: 1rem 1rem 1rem 2rem !important;
                    border-radius: 0.5rem;
                    margin: 0.75rem 0;
                    border: 1px solid #e5e7eb !important;
                }
                
                .commissioni-modal-content li {
                    margin-bottom: 0.5rem;
                }
                
                .commissioni-modal-content table {
                    width: 100% !important;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                
                .commissioni-modal-content th {
                    background: #97002D !important;
                    color: white !important;
                    padding: 0.75rem;
                    text-align: left;
                    font-weight: 600;
                }
                
                .commissioni-modal-content td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .commissioni-modal-content tr:hover td {
                    background: #f9fafb !important;
                }
                
                .commissioni-modal-content b,
                .commissioni-modal-content strong {
                    font-weight: 600;
                    color: #1f2937 !important;
                }
                
                .commissioni-modal-content hr {
                    border: none;
                    border-top: 2px solid #e5e7eb;
                    margin: 1.5rem 0;
                }
            `}</style>
        </>
    );
}

CommissioniPageBase.propTypes = {
    pageTitle: PropTypes.string,
};

export default CommissioniPageBase;
