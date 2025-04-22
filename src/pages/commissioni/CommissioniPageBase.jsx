import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

function CommissioniPageBase({ pageTitle }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [sinotticoData, setSinotticoData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [isIframe, setIsIframe] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data?.docNodes?.length) {
            data.docNodes.forEach((topNode) => {
                const commName = topNode.name;
                if (!commName) return;

                axios
                    .get(
                        `https://svil-tabulas4.intra.senato.it/v1/tabulas/sinottico/?descTipoCommissione='${commName}'`
                    )
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
        axios
            .get("tabulas/mobile/commissioni")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleOpenModalWithUrl = (url) => {
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer,width=900,height=600");
    };

    const handleOpenUltimaSeduta = (node) => {
        if (!node) return;
        setModalTitle("Ultima Seduta");

        if (node.docContentStreamContent) {
            setIsIframe(false);
            setModalContent(node.docContentStreamContent);
        } else if (node.docContentUrl) {
            setIsIframe(true);
            const iframeHtml = `<iframe src="${node.docContentUrl}" style="width:100%; height:600px;" frameborder="0"></iframe>`;
            setModalContent(iframeHtml);
        } else {
            setIsIframe(false);
            setModalContent("Nessun contenuto disponibile.");
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalTitle("");
        setModalContent("");
        setIsIframe(false);
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center">
                <Loading />
            </div>
        );
    }

    const getCurrentWeekDays = () => {
        const days = [];
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek - 1));

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(monday);
            currentDay.setDate(monday.getDate() + i);

            const label = currentDay.toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            days.push(label);
        }
        return days;
    };

    const columns = [
        { id: "name", label: "" },
        { id: "convocazioni", label: "Convocazioni" },
        ...getCurrentWeekDays().map((dayLabel) => ({ id: dayLabel, label: dayLabel })),
        { id: "ultimaSeduta", label: "Ultima Seduta" },
    ];

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
        return sinotticoList.find((item) => item.nomeComm === rowName);
    };

    const getSinoGiornoInfo = (sinotticoItem, targetDateStr) => {
        if (!sinotticoItem?.sinoGiorni) return null;

        const splitted = targetDateStr.split(" ");
        if (splitted.length < 4) return null;
        const day = splitted[1].padStart(2, "0");
        const monthName = splitted[2].toLowerCase();
        const year = splitted[3];

        const monthMap = {
            gennaio: "01",
            febbraio: "02",
            marzo: "03",
            aprile: "04",
            maggio: "05",
            giugno: "06",
            luglio: "07",
            agosto: "08",
            settembre: "09",
            ottobre: "10",
            novembre: "11",
            dicembre: "12",
        };
        const mm = monthMap[monthName] || "01";
        const formattedStr = `${day}/${mm}/${year}`;

        return sinotticoItem.sinoGiorni.find((g) => g.dataGiorno === formattedStr);
    };

    const filteredDocNodes = data?.docNodes?.filter((topNode) => {
        if (!topNode.docNodes || topNode.docNodes.length === 0) return false;
        if (!pageTitle) return true;
        return topNode.name === pageTitle;
    });

    return (
        <>
            <div className="w-full bg-white rounded-lg relative px-4 pt-4 pb-10">
                {filteredDocNodes?.map((topNode, tableIdx) => (
                    <div
                        key={tableIdx}
                        className="border border-gray-300 rounded-md overflow-hidden mb-6"
                    >
                        <div className="bg-red-800 text-white px-4 py-2 text-lg font-semibold">
                            {topNode.name}
                        </div>

                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-dark">
                                    {columns.map((col, cIdx) => (
                                        <th key={cIdx} className="py-2 px-3 border text-center">
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {topNode.docNodes.map((rowNode, rowIdx) => {
                                    const rowSinottico = getSinotticoForRow(topNode.name, rowNode.name);
                                    return (
                                        <tr key={rowIdx} className="odd:bg-white even:bg-gray-50">
                                            {columns.map((col, colIdx) => {
                                                if (col.id === "name") {
                                                    return (
                                                        <td
                                                            key={colIdx}
                                                            className="border border-gray-300 px-3 py-2 font-semibold text-sm"
                                                        >
                                                            {rowNode.name}
                                                        </td>
                                                    );
                                                } else if (col.id === "convocazioni") {
                                                    const convocazioniNode = findChildByName(rowNode, "Convocazioni");
                                                    const fallbackUrl = rowSinottico?.convocazioneUrl;
                                                    const linkUrl = convocazioniNode?.docContentUrl || fallbackUrl;

                                                    return (
                                                        <td
                                                            key={colIdx}
                                                            className="border border-gray-300 px-3 py-2 text-sm text-center"
                                                        >
                                                            {linkUrl && (
                                                                <span
                                                                    className="inline-block cursor-pointer"
                                                                    onClick={() => handleOpenModalWithUrl(linkUrl)}
                                                                >
                                                                    <i
                                                                        className="fa-duotone fa-calendar-alt text-xl text-red-800"
                                                                        title="Apri Convocazioni"
                                                                    ></i>
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                } else if (col.id === "ultimaSeduta") {
                                                    const ultimaNode = findChildByName(rowNode, "Ultima seduta");
                                                    return (
                                                        <td
                                                            key={colIdx}
                                                            className="border border-gray-300 px-3 py-2 text-sm text-center"
                                                        >
                                                            {ultimaNode && (
                                                                <span
                                                                    className="inline-block cursor-pointer"
                                                                    onClick={() => handleOpenUltimaSeduta(ultimaNode)}
                                                                >
                                                                    <i
                                                                        className="fa-duotone fa-file-alt text-xl text-red-800"
                                                                        title="Ultima Seduta"
                                                                    />
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                } else {
                                                    const dayNode = getDayNode(rowNode, col.label);
                                                    const sinoDayInfo = getSinoGiornoInfo(rowSinottico, col.label);

                                                    return (
                                                        <td
                                                            key={colIdx}
                                                            className="border border-gray-300 px-3 py-2 text-sm text-center"
                                                        >
                                                            {dayNode?.docContentUrl && (
                                                                <span
                                                                    className="inline-block cursor-pointer mr-2"
                                                                    onClick={() => handleOpenModalWithUrl(dayNode.docContentUrl)}
                                                                >
                                                                    <i className="fas fa-file-alt text-xl" title="Apri Documento" />
                                                                </span>
                                                            )}
                                                            {sinoDayInfo && (
                                                                <div>
                                                                    <small>
                                                                        {sinoDayInfo.primaConvOra} - {sinoDayInfo.ultConvOra}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                }
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-3/4 max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="rich-text-content p-4 bg-gray-100 rounded overflow-y-auto"
                            style={{ maxHeight: "70vh" }}
                            dangerouslySetInnerHTML={{ __html: modalContent }}
                        />
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

CommissioniPageBase.propTypes = {
    pageTitle: PropTypes.string,
};

export default CommissioniPageBase;
