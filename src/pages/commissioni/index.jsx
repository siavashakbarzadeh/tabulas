import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // We'll store sinottico results keyed by topNode.name
  const [sinotticoData, setSinotticoData] = useState({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // After “commissioni” data arrives, we trigger a sinottico fetch for each topNode.
  useEffect(() => {
    if (data?.docNodes?.length) {
      data.docNodes.forEach((topNode) => {
        const commName = topNode.name;
        if (!commName) return;

        // NOTE: If your back end truly requires that single-quoted format in the query,
        // then literally use ?descTipoCommissione='NOME' as shown below:
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
      .get("tabulas/mobile/commissioni") // This is your original API call
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
      // We have raw HTML => show it
      setIsIframe(false);
      setModalContent(node.docContentStreamContent);
    } else if (node.docContentUrl) {
      // We have a URL => load it in an iframe
      setIsIframe(true);
      const iframeHtml = `<iframe 
          src="${node.docContentUrl}" 
          style="width:100%; height:600px;" 
          frameborder="0">
        </iframe>`;
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

  // Generate dynamic headers for the current week
  const getCurrentWeekDays = () => {
    const days = [];
    const today = new Date();
    // Anchor on Monday
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
    { id: "name", label: "" }, // Commission name column
    { id: "convocazioni", label: "Convocazioni" },
    ...getCurrentWeekDays().map((dayLabel) => ({ id: dayLabel, label: dayLabel })),
    { id: "ultimaSeduta", label: "Ultima Seduta" },
  ];

  // Utility: find child docNode by case-insensitive `name`
  const findChildByName = (parent, targetName) => {
    if (!parent?.docNodes) return null;
    return parent.docNodes.find(
      (child) => child.name?.toLowerCase() === targetName.toLowerCase()
    );
  };

  // We only match the first word to docNode child if needed
  const getDayNode = (parentDocNode, fullLabel) => {
    const firstWord = fullLabel.split(" ")[0].toLowerCase();
    return findChildByName(parentDocNode, firstWord);
  };

  // For each row, find the matching sinottico item by rowName (es: "1ª Commissione permanente").
  const getSinotticoForRow = (topNodeName, rowName) => {
    const sinotticoList = sinotticoData[topNodeName] || [];
    return sinotticoList.find((item) => item.nomeComm === rowName);
  };

  // Use column label (e.g. "martedì 9 aprile 2025") to find matching day in “sinoGiorni”.
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
    const formattedStr = `${day}/${mm}/${year}`; // e.g. “09/04/2025”

    return sinotticoItem.sinoGiorni.find((g) => g.dataGiorno === formattedStr);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg relative px-4 pt-4 pb-10">
        {/* Search Bar */}
        <form className="w-full mb-4">
          <label className="w-full block relative">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-10 bg-neutral-200 text-sm rounded-md border border-neutral-300 px-4 focus:outline-none"
            />
          </label>
        </form>

        {/* For each top-level node => create a table */}
        {data?.docNodes
          ?.filter((topNode) => topNode.docNodes && topNode.docNodes.length > 0)
          .map((topNode, tableIdx) => (
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
                  {/* Each second-level node => row */}
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
                            const convocazioniNode = findChildByName(
                              rowNode,
                              "Convocazioni"
                            );
                            // Also check sinottico for a fallback
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
                                    onClick={() => handleOpenModalWithUrl(fallbackUrl)}
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
                            // const ultimaNode = findChildByName(rowNode, "Ultima seduta");
                            const ultimaNode = rowSinottico?.ultimaSedutaUrl;
                            // Or fallback to rowSinottico?.ultimaSedutaUrl if desired
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
                            // Day columns
                            const dayNode = getDayNode(rowNode, col.label);
                            const sinoDayInfo = getSinoGiornoInfo(rowSinottico, col.label);

                            return (
                              <td
                                key={colIdx}
                                className="border border-gray-300 px-3 py-2 text-sm text-center"
                              >
                                {/* Show docNode link if available */}
                                {dayNode?.docContentUrl && (
                                  <span
                                    className="inline-block cursor-pointer mr-2"
                                    onClick={() => handleOpenModalWithUrl(dayNode.docContentUrl)}
                                  >
                                    <i
                                      className="fas fa-file-alt text-xl"
                                      title="Apri Documento"
                                    ></i>
                                  </span>
                                )}
                                {/* Show sinottico times if available */}
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

export default CommissioniPage;
