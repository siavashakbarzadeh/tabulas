import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function EbookPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ebook")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 relative">
      {/* Search Bar */}
      <form className="w-full mb-4">
        <label className="relative w-full block">
          <input
            type="text"
            placeholder="Cerca..."
            className="w-full h-12 bg-gray-100 text-gray-800 text-sm rounded-full pl-12 pr-4 border focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <img
            src={SearchIcon}
            alt="Search"
            className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
          />
        </label>
      </form>

      {/* Content Section */}
      <div className="w-full flex justify-center">
        {loading || data === null ? (
          <Loading />
        ) : (
          <div
            className="w-full prose max-w-none"
            style={{ color: "#333" }}
            dangerouslySetInnerHTML={{ __html: data.docContentStreamContent }}
          ></div>
        )}
      </div>

      {/* News Bar */}
      <div className="absolute inset-x-0 bottom-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-bl-2xl rounded-br-2xl overflow-hidden line-clamp-1">
        16.25 Scuola: Gilda, ministeri trovino soluzione per stipendi precari
        (z ANSA Politica) ~ 16.25 Confartigianato, 'no alla patente a crediti
        nell'edilizia' (z ANSA Economia e Finanza) ~ 16.25 Agricoltori: Fidanza
        (Fdi), richieste in linea nostre battaglie = (AGI) ~ 16.25 ++ 'Biden al
        confine col Messico lo stesso giorno di Trump' ++ (z ANSA Politica) ~
        16.26 Scontri Pisa: Conti, 'è pagina buia, polizia si può criticare' (z
        ANSA Cronaca) ~ 16.26 Giustizia: sabato riunione Anm su reclutamento
        straordinario = (AGI) ~ 16.28 Schlein, vita di Don Nicolini dedicata
        agli ultimi, mancherà (z ANSA Politica) ~ 16.28 Hezbollah, 60 razzi
        contro base militare israeliana (2) (z ANSA Politica) ~ 16.30 Legale due
        poliziotti uccisi, 'dissento da Mattarella' (z ANSA Cronaca) ~ 16.30 Al
        via il Consiglio dei ministri (z ANSA Politica)
      </div>

      {/* Global Styles for Links */}
      <style>
        {`
          a {
            color: rgb(151, 0, 45);
            text-decoration: none;
            transition: color 0.2s ease-in-out;
          }
          a:hover {
            color: rgb(200, 0, 60);
          }
        `}
      </style>
    </div>
  );
}

export default EbookPage;
