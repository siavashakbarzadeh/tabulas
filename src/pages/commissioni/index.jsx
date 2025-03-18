// CommissioniPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Modal controls
  const [showModal, setShowModal] = useState(false);
  // We'll store the structured result of parsing the "Convocazioni" HTML here
  const [convocazioniSchedule, setConvocazioniSchedule] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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

  /**
   * This function takes the entire HTML snippet (the <html>… from senato.it)
   * and parses out an array of days, where each day has an array of "events".
   */
  const parseConvocazioniHtml = (htmlString) => {
    if (!htmlString) return [];

    // 1) Parse HTML via DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // We’ll store the final result here
    // Example shape: [ { day: "Mar 18", events: [ { time: "13:20", substructure: "...", text: "..."}, ... ] }, ... ]
    let schedule = [];

    // Each <table class="csc-table"> can contain multiple days
    const tables = doc.querySelectorAll("table.csc-table");

    tables.forEach((table) => {
      // Each row that belongs to the schedule has class "ls-rcs-row"
      // The day is in a <td> with class "day-column"
      const rows = table.querySelectorAll("tr.ls-rcs-row");

      let currentDay = null; // We'll update this whenever we see a "day-column" cell.

      rows.forEach((row) => {
        // If there's a <td class="day-column">, that tells us the day for subsequent rows
        const dayTd = row.querySelector(".day-column");
        if (dayTd) {
          currentDay = dayTd.textContent.trim();
          // Start a new day entry in schedule
          schedule.push({ day: currentDay, events: [] });
        }

        // Time is usually in <td class="time-column"> 
        const timeTd = row.querySelector(".time-column");
        const timeText = timeTd?.innerText?.trim() || "";

        // Substructure (like "Plenaria," "Assemblea," "Sottocommissione pareri")
        // is in <td class="sottostruttura-column">
        const substructureTd = row.querySelector(".sottostruttura-column");
        // We'll keep the inner HTML so we can preserve <br> etc.
        const substructureHtml = substructureTd?.innerHTML?.trim() || "";

        // The main text of the convocazione is in <td class="views-field-field-testo-convocazione">
        const textTd = row.querySelector(".views-field-field-testo-convocazione");
        const textHtml = textTd?.innerHTML?.trim() || "";

        // Add an event to the *most recent* day in our schedule array
        // If for some reason "day-column" never appeared, schedule.length might be 0, so check
        if (schedule.length > 0) {
          schedule[schedule.length - 1].events.push({
            time: timeText,
            substructure: substructureHtml,
            text: textHtml,
          });
        }
      });
    });

    return schedule;
  };

  /**
   * Called when user clicks the “Convocazioni” icon.
   * We parse the HTML, store it in state, and show the modal.
   */
  const handleOpenConvocazioniModal = (title, htmlString) => {
    setModalTitle(title);

    // parse the HTML into a structured array of days
    const scheduleData = parseConvocazioniHtml(htmlString);

    setConvocazioniSchedule(scheduleData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setConvocazioniSchedule([]);
    setModalTitle("");
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  // Example columns, etc. (shortened for clarity)
  // We just show how to call handleOpenConvocazioniModal with the HTML snippet
  return (
    <>
      <div className="w-full bg-white rounded-lg relative px-4 pt-4 pb-10">
        <h1 className="text-2xl font-bold mb-4">Commissioni</h1>

        {data?.docNodes?.map((topNode, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="bg-red-800 text-white px-4 py-2">
              {topNode.name}
            </h2>
            {topNode.docNodes?.map((child, cIdx) => {
              // If this child is “Convocazioni”, we show an icon to parse & open it
              if (child.name === "Convocazioni") {
                return (
                  <div key={cIdx} className="p-2">
                    <span
                      className="inline-block cursor-pointer text-blue-600"
                      onClick={() =>
                        handleOpenConvocazioniModal(
                          `${topNode.name} - Convocazioni`,
                          child.docContentStreamContent // The big HTML snippet
                        )
                      }
                    >
                      <i className="fas fa-file-alt text-xl" /> Apri Convocazioni
                    </span>
                  </div>
                );
              }
              // else show something else...
              return null;
            })}
          </div>
        ))}
      </div>

      {/* Modal that shows the "parsed" data (days & events) */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 max-w-5xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">{modalTitle}</h3>

            {convocazioniSchedule.map((dayObj, dIdx) => (
              <div key={dIdx} className="mb-4 border-b border-gray-200 pb-2">
                <h4 className="font-semibold text-red-700">{dayObj.day}</h4>
                {/* Each day has an array of “events” */}
                <table className="w-full mt-2 border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 border">Ora</th>
                      <th className="px-2 py-1 border">Sottostruttura</th>
                      <th className="px-2 py-1 border">Testo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayObj.events.map((evt, eIdx) => (
                      <tr key={eIdx} className="odd:bg-white even:bg-gray-50">
                        <td className="border px-2 py-1 text-sm">
                          {evt.time}
                        </td>
                        <td
                          className="border px-2 py-1 text-sm"
                          dangerouslySetInnerHTML={{ __html: evt.substructure }}
                        />
                        <td
                          className="border px-2 py-1 text-sm"
                          dangerouslySetInnerHTML={{ __html: evt.text }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommissioniPage;
