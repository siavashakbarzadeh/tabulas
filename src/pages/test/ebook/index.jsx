import React, { useEffect, useState } from "react";
import SearchIcon from "../../../assets/svg/search.svg";
import axios from "../../../configs/axiosConfig.js";
import Loading from "../../../layout/components/Loading.jsx";

function TestEbookPage() {
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
      .get("https://svil-tabulas4.intra.senato.it/v2/tabulas/mobile/ebook")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="w-full bg-white rounded-tl-none lg:rounded-tl-2xl rounded-tr-none lg:rounded-tr-2xl rounded-bl-2xl rounded-br-2xl relative px-4 pt-4 pb-13">
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
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: data.docContentStreamContent }}
            ></div>
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
          (z ANSA Polit
        </div>
      </div>
    </>
  );
}

export default TestEbookPage;
