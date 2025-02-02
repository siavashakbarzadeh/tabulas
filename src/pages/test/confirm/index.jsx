import SearchIcon from "../../../assets/svg/search.svg";
import PlayIcon from "../../../icons/Play";
import NotificationIcon from "../../../icons/Notification";
import { Link } from "react-router-dom";
import CheckIcon from "../../../icons/Check";

function TestConfirmPage() {
  return (
    <>
      <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] z-40 pl-0 lg:pl-68 flex">
        <div className="w-full flex p-2 md:p-4">
          <div className="w-full flex relative overflow-auto">
            <div className="w-96 p-4 bg-white rounded-xl drop-shadow-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="w-full flex justify-center">
                <div className="size-16 border-2 border-green-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="size-12 text-green-500" />
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="text-center text-xl font-medium text-zinc-700 leading-7">
                  Documento inviato correttamente alla Segreteria
                </div>
                <p className="font-light text-zinc-500 text-sm mt-2 text-center">
                  (ricevuta dell'invio, con documento allegato, via mail al suo
                  indirizzo)
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button className="min-w-18 text-white bg-primary-900 text-sm leading-6 py-1 px-2 rounded-md">
                    SI
                  </button>
                  <button className="min-w-18 text-white bg-gray-700 text-sm leading-6 py-1 px-2 rounded-md">
                    No Grazie
                  </button>
                </div>
              </div>
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

export default TestConfirmPage;
