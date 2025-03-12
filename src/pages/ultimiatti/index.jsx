import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function UltimiattiPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
      modifyPdfLinks();
    }
  }, [data]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/ultimiatti")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modifyPdfLinks = () => {
    setTimeout(() => {
      document.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
        const img = link.querySelector('img[title*=".pdf"]');
        if (img) {
          img.style.display = "none"; // Hide small PDF icon
        }
  
        // Check if the icon is already added to prevent duplication
        if (!link.querySelector(".custom-pdf-icon")) {
          const icon = document.createElement("i");
          icon.className = "fas fa-file-pdf mr-2 custom-pdf-icon"; // Font Awesome icon
          icon.style.color = "rgb(151, 0, 45)"; // Apply custom color
          link.prepend(icon);
        }
      });
    }, 100);
  };

  return (
    <div className="w-full bg-white rounded-lg px-4 pt-4 pb-13">
      <form className="w-full">
        <label className="w-full block relative before:w-px before:h-2/3 before:bg-neutral-300 before:absolute before:left-14 before:top-1/2 before:-translate-y-1/2">
          <input
            type="text"
            placeholder="Cerca..."
            className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
          />
          <img
            src={SearchIcon}
            alt="Search"
            className="w-6 h-6 select-none absolute left-4 top-1/2 -translate-y-1/2"
          />
        </label>
      </form>

      <div className="w-full flex mt-4">
        {loading || data === null ? (
          <div className="w-full flex justify-center">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Titolo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Data</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Seduta</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.docNodes.map((item, key) => (
                    <tr key={key} className="border-b">
                      <td className="py-3 px-4 text-left font-bold text-red-700">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-left font-semibold">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 text-left font-semibold">
                        {item.session}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <a href={item.pdfLink} target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-file-pdf mr-2 custom-pdf-icon" style={{ color: "rgb(151, 0, 45)" }}></i>
                          {item.pdfName}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 line-clamp-1 leading-9 h-9 overflow-hidden rounded-bl-2xl rounded-br-2xl">
        16.25 Scuola: Gilda, ministeri trovino soluzione per stipendi precari
        (z ANSA Politica) ~ 16.25 Confartigianato, 'no alla patente a crediti
        nell'edilizia' (z ANSA Economia e Finanza) ~ 16.25 Agricoltori:
        Fidanza (Fdi), richieste in linea nostre battaglie = (AGI) ~ 16.25 ++
        'Biden al confine col Messico lo stesso giorno di Trump' ++ (z ANSA
        Politica) ~ 16.26 Scontri Pisa: Conti, 'è pagina buia, polizia si può
        criticare' (z ANSA Cronaca) ~ 16.26 Giustizia: sabato riunione Anm su
        reclutamento straordinario = (AGI) ~ 16.28 Schlein, vita di Don
        Nicolini dedicata agli ultimi, mancherà (z ANSA Politica) ~ 16.28
        Hezbollah, 60 razzi contro base militare israeliana (2) (z ANSA
        Politica) ~ 16.30 Legale due poliziotti uccisi, 'dissento da
        Mattarella' (z ANSA Cronaca) ~ 16.30 Al via il Consiglio dei ministri
        (z ANSA Politica)
      </div>
    </div>
  );
}

export default UltimiattiPage;
