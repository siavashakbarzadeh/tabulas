import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
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

  // Pop-up (or new tab) helper
  const openPopup = (url) => {
    // Using window.open with specs can create a pop-up
    // But many browsers / popup-blockers may open it as a tab or block it.
    // The 'noopener,noreferrer' is recommended to avoid security issues.
    window.open(url, "_blank", "noopener,noreferrer,width=900,height=600");
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
    return parent?.docNodes?.find(
      (child) => child.name?.toLowerCase() === targetName.toLowerCase()
    );
  };

  const getDayNode = (parent, fullLabel) => {
    const firstWord = fullLabel.split(" ")[0].toLowerCase();
    return findChildByName(parent, firstWord);
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

        {/* For each top-level node => table */}
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
                  <tr className="bg-red-700 text-white">
                    {columns.map((col, cIdx) => (
                      <th
                        key={cIdx}
                        className="py-2 px-3 border border-red-800 text-center"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topNode.docNodes.map((rowNode, rowIdx) => (
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
                        }
                        if (col.id === "convocazioni") {
                          const convocazioniNode = findChildByName(
                            rowNode,
                            "Convocazioni"
                          );
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              {convocazioniNode?.docContentUrl && (
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() =>
                                    openPopup(convocazioniNode.docContentUrl)
                                  }
                                >
                                  <i
                                    className="fas fa-file-alt text-xl"
                                    title="Apri Convocazioni"
                                  />
                                </span>
                              )}
                            </td>
                          );
                        }
                        if (col.id === "ultimaSeduta") {
                          const ultimaNode = findChildByName(rowNode, "Ultima seduta");
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              {ultimaNode?.docContentStreamContent && (
                                <span
                                  className="inline-block cursor-pointer"
                                  onClick={() =>
                                    // If you still want “Ultima seduta” in a
                                    // React-based modal with raw HTML,
                                    // you could show it similarly to previous examples.
                                    // For a direct pop-up approach:
                                    // openPopup('data:text/html,' + encodeURIComponent(ultimaNode.docContentStreamContent))
                                    // (but raw HTML in a new window can be messy)
                                    openPopup(
                                      // Option 1: If ultimaSeduta is actually a separate page,
                                      // you can store a docContentUrl. Otherwise, there's no
                                      // direct, safe way to open raw HTML in a new window
                                      ultimaNode.docContentUrl || "#"
                                    )
                                  }
                                >
                                  <i
                                    className="fas fa-file-alt text-xl"
                                    title="Ultima Seduta"
                                  />
                                </span>
                              )}
                            </td>
                          );
                        }

                        // Else it's one of the day columns
                        const dayNode = getDayNode(rowNode, col.label);
                        if (dayNode?.docContentUrl) {
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-3 py-2 text-sm text-center"
                            >
                              <span
                                className="inline-block cursor-pointer"
                                onClick={() => openPopup(dayNode.docContentUrl)}
                              >
                                <i
                                  className="fas fa-file-alt text-xl"
                                  title="Apri Documento"
                                />
                              </span>
                            </td>
                          );
                        }
                        return (
                          <td
                            key={colIdx}
                            className="border border-gray-300 px-3 py-2 text-sm text-center"
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </>
  );
}

export default CommissioniPage;
