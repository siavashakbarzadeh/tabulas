import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

function Ultimidossierage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ultimdossier")
      .then((res) => {
        setRecords(res.data);
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
    <div className="flex flex-col min-h-screen w-full p-4">
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
                <td colSpan="4" className="py-3 px-4">
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
    </div>
  );
}

export default Ultimidossierage;
