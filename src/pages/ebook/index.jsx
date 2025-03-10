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
        <label className="relative w-full flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mr-2" />
          <input
            type="text"
            placeholder="Cerca..."
            className="w-full h-12 bg-gray-100 text-gray-800 text-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-xl"
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
      <div className="absolute inset-x-0 bottom-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-bl-xl rounded-br-xl overflow-hidden line-clamp-1">
        16.25 Scuola: <a href="#">Gilda, ministeri trovino soluzione per stipendi precari</a> (z ANSA Politica) ~ 16.25 <a href="#">Confartigianato, 'no alla patente a crediti nell'edilizia'</a> (z ANSA Economia e Finanza) ~ 16.25 <a href="#">Agricoltori: Fidanza (Fdi), richieste in linea nostre battaglie</a> = (AGI) ~ 16.25 ++ <a href="#">'Biden al confine col Messico lo stesso giorno di Trump'</a> ++ (z ANSA Politica)
      </div>

      {/* Global Styles for Links */}
      <style>
        {`
          a {
            color: rgb(151, 0, 45);
            text-decoration: none;
            transition: color 0.2s ease-in-out;
            display: inline-flex;
            align-items: center;
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
