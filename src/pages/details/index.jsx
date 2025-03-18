import { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import { useParams } from "react-router-dom";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function DetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    fetchApplication(id);
  }, []);

  useEffect(() => {
    console.log(application);
  }, [application]);

  const fetchApplication = (id) => {
    setLoading(true);
    axios
      .get(`applications/${id}`)
      .then((res) => {
        setLoading(false);
        setApplication(res.data.data.application);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] z-40 pl-0 lg:pl-68 flex">
        <div className="w-full flex p-2 md:p-4">
          <div className="w-full flex relative overflow-auto">
            <div className="w-11/12 lg:w-10/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="w-full">
                <span className="text-sm text-zinc-900 leading-6 font-medium">
                  Anteprima Documento Firmato
                </span>
              </div>
              <div className="w-full max-h-52 overflow-auto bg-white rounded-lg p-2 mt-2">
                {loading || application === null ? (
                  <div className="w-full flex justify-center">
                    <Loading />
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-2 gap-2">
                    <div className="col-span-1 text-sm p-2 border border-gray-100 rounded-lg">
                      <div className="text-zinc-300 mb-1">Nome atto</div>
                      <div className="text-zinc-900">{application.name}</div>
                    </div>
                    <div className="col-span-1 text-sm p-2 border border-gray-100 rounded-lg">
                      <div className="text-zinc-300 mb-1">Tipo atto</div>
                      <div className="text-zinc-900">
                        {application.act_type}
                      </div>
                    </div>
                    <div className="col-span-1 text-sm p-2 border border-gray-100 rounded-lg">
                      <div className="text-zinc-300 mb-1">
                        Ufficio destinatario
                      </div>
                      <div className="text-zinc-900">
                        {application.act_type}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="w-full h-10 mt-2 rounded-md bg-primary-900 text-white text-sm flex items-center justify-center">
                Prepara per Invio
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-tl-none lg:rounded-tl-2xl rounded-tr-none lg:rounded-tr-2xl rounded-bl-2xl rounded-br-2xl relative px-4 pt-4 pb-13">
        <div className="w-full flex-1 flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0">
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

export default DetailsPage;
