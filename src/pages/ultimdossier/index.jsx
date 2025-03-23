import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import InnerSidebar from "../../layout/sidebar2/InnerSidebar.jsx"; // Optional inner sidebar

// --- PARSING FUNCTION ---
// Assumes raw data is a string with dossier records separated by empty lines.
function parseDossierData(rawData) {
  const records = [];
  // Split records by one or more blank lines
  const rawRecords = rawData.split(/\n\s*\n/);
  rawRecords.forEach((recordStr) => {
    // Split each record into lines, trimming whitespace
    const lines = recordStr.split("\n").map((line) => line.trim()).filter((line) => line !== "");
    if (lines.length === 0) return;
    // The first line is the header.
    // We try to split by tab or by two or more spaces.
    const headerParts = lines[0].split(/\t+|\s{2,}/).filter((p) => p !== "");
    const documentIdentifier = headerParts[0] || "-";
    const servizio = headerParts[1] || "-";
    const date = headerParts[2] || "-";
    const label = headerParts[3] || "-";
    // The remaining lines are the description and references.
    let description = "";
    const riferimenti = [];
    let inReferences = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("Riferimenti:")) {
        inReferences = true;
        const refLine = line.replace("Riferimenti:", "").trim();
        if (refLine) {
          riferimenti.push(refLine);
        }
      } else if (inReferences) {
        riferimenti.push(line);
      } else {
        description += (description ? " " : "") + line;
      }
    }
    records.push({
      documentIdentifier,
      servizio,
      date,
      label,
      description,
      riferimenti,
    });
  });
  return records;
}

// --- TABLE COMPONENT ---
// Displays the structured dossier records in a table.
function DossierTable({ records }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-3 px-4">Document Identifier</th>
          <th className="py-3 px-4">Servizio</th>
          <th className="py-3 px-4">Date</th>
          <th className="py-3 px-4">Label</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <React.Fragment key={index}>
            {/* Header row */}
            <tr className="border-b bg-gray-100">
              <td className="py-3 px-4">{record.documentIdentifier}</td>
              <td className="py-3 px-4">{record.servizio}</td>
              <td className="py-3 px-4">{record.date}</td>
              <td className="py-3 px-4">{record.label}</td>
            </tr>
            {/* Content row */}
            <tr className="border-b">
              <td colSpan={4} className="py-3 px-4">
                <strong>Description:</strong> {record.description || "-"}
                {record.riferimenti.length > 0 && (
                  <>
                    <br />
                    <strong>Riferimenti:</strong>
                    <ul className="list-disc ml-6">
                      {record.riferimenti.map((ref, idx) => (
                        <li key={idx}>{ref}</li>
                      ))}
                    </ul>
                  </>
                )}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

// --- MAIN COMPONENT ---
function Ultimidossierage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  // Optionally, if you still need the inner sidebar you can use activeNode, etc.
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch raw dossier data and parse it
  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ultimdossier")
      .then((res) => {
        // Assume res.data is raw text
        const parsedRecords = parseDossierData(res.data);
        setRecords(parsedRecords);
        // Optionally, set activeNode if needed based on parsedRecords
        if (parsedRecords.length > 0 && !activeNode) {
          setActiveNode(parsedRecords[0].documentIdentifier);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        {/* Search Bar */}
        <form className="w-full mb-4">
          <label className="w-full block relative">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
            />
          </label>
        </form>

        <div className="flex w-full">
          {/* Inner Sidebar (if needed) */}
          <InnerSidebar
            docNodes={[]} // Provide appropriate data if needed
            activeNode={activeNode}
            onSelect={(name) => setActiveNode(name)}
          />

          {/* Main Content Area */}
          <div className="flex-1 ml-4 overflow-x-auto">
            <DossierTable records={records} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ultimidossierage;
