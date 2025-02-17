import SearchIcon from "../../../assets/svg/search.svg";
import PlayIcon from "../../../icons/Play";
import NotificationIcon from "../../../icons/Notification";
import { Link } from "react-router-dom";
import CheckIcon from "../../../icons/Check";
import CloseIcon from "../../../icons/Close";

function TestFormPage() {
  return (
    <>
      <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] z-40 pl-0 lg:pl-68 flex">
        <div className="w-full flex p-2 md:p-4">
          <div className="w-full flex relative overflow-auto">
            <div className="w-11/12 lg:w-10/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="name"
                    className="text-sm text-zinc-900 mb-1 font-medium"
                  >
                    Nome atto
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Nome atto"
                    className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="act_type"
                    className="text-sm text-zinc-900 mb-1 font-medium"
                  >
                    Tipo atto
                  </label>
                  <select
                    id="act_type"
                    placeholder="Tipo atto"
                    className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
                  >
                    <option value="DDL 1">DDL 1</option>
                    <option value="DDL 2">DDL 2</option>
                    <option value="DDL 3">DDL 3</option>
                  </select>
                </div>
              </div>
              <div className="w-full flex flex-col mt-4">
                <label
                  htmlFor="signatory"
                  className="text-sm text-zinc-900 mb-1 font-medium"
                >
                  Firmatario
                </label>
                <div className="w-full flex bg-white p-4 rounded-md flex-wrap gap-2">
                  <div className="h-8 flex bg-gray-100">
                    <span className="text-sm leading-8 px-2">
                      Roberto Battistoni
                    </span>
                    <button className="px-2 border-l border-l-gray-300">
                      <CloseIcon className="size-4.5 text-zinc-500" />
                    </button>
                  </div>
                  <div className="h-8 flex bg-gray-100">
                    <span className="text-sm leading-8 px-2">
                      Amirreza Allahverdi
                    </span>
                    <button className="px-2 border-l border-l-gray-300">
                      <CloseIcon className="size-4.5 text-zinc-500" />
                    </button>
                  </div>
                  <div className="h-8 flex">
                    <label className="flex">
                      <input
                        type="text"
                        placeholder="Robert ..."
                        className="font-light ring-0 outline-none border-none focus:ring-0 focus:outline-none focus:border-none"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-4 mt-4">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="recipient_office"
                    className="text-sm text-zinc-900 mb-1 font-medium"
                  >
                    Ufficio destinatario
                  </label>
                  <select
                    id="recipient_office"
                    placeholder="Ufficio destinatario"
                    className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
                  >
                    <option value="Assemblea 1">Assemblea 1</option>
                    <option value="Assemblea 2">Assemblea 2</option>
                    <option value="Assemblea 3">Assemblea 3</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="submission_date"
                    className="text-sm text-zinc-900 mb-1 font-medium"
                  >
                    Data Invio
                  </label>
                  <input
                    type="date"
                    id="submission_date"
                    placeholder="Data Invio"
                    className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-4 mt-4">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="files_to_send"
                    className="text-sm text-zinc-900 mb-1 font-medium"
                  >
                    File da Inviare
                  </label>
                  <select
                    id="files_to_send"
                    placeholder="File da Inviare"
                    className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
                  >
                    <option value="Submitted file 1">Submitted file 1</option>
                    <option value="Submitted file 2">Submitted file 2</option>
                    <option value="Submitted file 3">Submitted file 3</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2 flex items-end">
                  <button className="w-full h-10 bg-primary-900 rounded-lg flex items-center justify-center text-white text-sm">
                    Prepara per Invio
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

export default TestFormPage;
