import React, { useEffect, useState } from "react";
import swaggerApi from "../../configs/swaggerApiConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import "../../assets/css/custom/rich-text-content.css";

function Ultimidossierage1() {
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await swaggerApi.get("/v2/tabulas/mobile/ultimdossier");
      const data = res.data;
      
      if (data?.docNodes?.[0]?.docContentStreamContent) {
        setHtmlContent(data.docNodes[0].docContentStreamContent);
      } else if (data?.docNodes) {
        const html = data.docNodes.map(node => 
          `<div class="mb-4 p-4 bg-gray-50 rounded"><h3 class="font-bold">${node.name || ''}</h3>${node.docContentStreamContent || ''}</div>`
        ).join('');
        setHtmlContent(html);
      } else {
        setError("Formato dati non riconosciuto");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ultimi dossier data:", error);
      setError("Errore nel caricamento dei dati");
      setLoading(false);
    }
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

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 bg-white rounded-2xl relative p-4">
        <h1 className="text-xl font-bold text-red-800 mb-4">Ultimi Dossier</h1>
        <div 
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

export default Ultimidossierage1;
