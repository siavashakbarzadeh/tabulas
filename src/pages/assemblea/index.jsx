import React, { useEffect, useState } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

function AssembleaPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the kiosk endpoint which works with GET
      const res = await swaggerApi.get("/v2/tabulas/kiosk/assemblea");
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assemblea data:", error);
      setError("Errore nel caricamento dei dati");
      setLoading(false);
    }
  };

  // Find specific node by name
  const findNode = (nodeName) => {
    if (!data?.docNodes) return null;
    return data.docNodes.find(node => 
      node.name?.toLowerCase().includes(nodeName.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center p-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Riprova
        </button>
      </div>
    );
  }

  const ordineDelGiorno = findNode("ordine del giorno");
  const calendario = findNode("calendario");
  const comunicati = findNode("comunicati");

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        <h1 className="text-xl font-bold text-red-800 mb-6">Assemblea</h1>
        
        {/* Ordine del Giorno */}
        {ordineDelGiorno && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              {ordineDelGiorno.name}
            </h2>
            <div 
              className="rich-text-content bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: ordineDelGiorno.docContentStreamContent || '' }}
            />
          </section>
        )}

        {/* Calendario dei Lavori */}
        {calendario && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              {calendario.name}
            </h2>
            <div 
              className="rich-text-content bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: calendario.docContentStreamContent || '' }}
            />
          </section>
        )}

        {/* Comunicati di Seduta */}
        {comunicati && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              {comunicati.name}
            </h2>
            <div 
              className="rich-text-content bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: comunicati.docContentStreamContent || '' }}
            />
          </section>
        )}

        {/* Fallback: Show all nodes if specific ones not found */}
        {!ordineDelGiorno && !calendario && !comunicati && data?.docNodes && (
          <div>
            {data.docNodes.map((node, idx) => (
              <section key={idx} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  {node.name}
                </h2>
                <div 
                  className="rich-text-content bg-gray-50 p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: node.docContentStreamContent || '' }}
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssembleaPage;
