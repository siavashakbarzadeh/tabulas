import { Link, Outlet } from "react-router-dom";
import SearchIcon from "../assets/svg/search.svg";
import PlayIcon from "../icons/Play";
import NotificationIcon from "../icons/Notification";
import Sidebar2 from "./sidebar2";
import AppIcon from "../icons/App";
import User from "../icons/User";
import { useState } from "react";

function DashboardLayout({ ...props }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebarClickHandler = (event) => {
    setIsSidebarActive((prevSatate) => !prevSatate);
  };

  return (
    <div className="flex w-full bg-primary-900 pb-12 lg:pb-0">
      <Sidebar2 isSidebarActive={isSidebarActive} />
      <div className="flex w-full pl-0 lg:pl-68">
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
          <div className="w-full bg-white rounded-tl-none lg:rounded-tl-2xl rounded-tr-none lg:rounded-tr-2xl rounded-bl-2xl rounded-br-2xl relative px-4 pt-4 pb-13">
            <div className="w-full flex-1 flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0">
              <div className="w-full md:w-4/6">
                <form>
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
                <div className="w-full flex mt-8">
                  <div className="py-3 px-6 bg-primary-900 text-white rounded-2xl leading-6">
                    <div className="">Martedì 27 febbraio 2024</div>
                    <div className="">alle ore 16,30</div>
                    <div className="">163A Seduta Pubblica</div>
                  </div>
                </div>
                <div className="w-full mt-8 space-y-4">
                  <div className="w-full bg-neutral-200 rounded-2xl p-6 text-zinc-800 space-y-4 leading-7">
                    <p>
                      <strong>
                        I. Ratifiche di accordi internazionali (elenco allegato)
                      </strong>
                    </p>
                    <p>
                      <strong>II. Discussione del disegno di legge:</strong>
                    </p>
                    <p>
                      Interventi a sostegno della competitività dei capitali e
                      delega al Governo per la riforma organica delle
                      disposizioni in materia di mercati dei capitali recate dal
                      testo unico di cui al decreto legislativo 24 febbraio
                      1998, n. 58, e delle disposizioni in materia di società
                      di capitali contenute nel codice civile applicabili anche
                      agli emittenti (approvato dal Senato e modificato dalla
                      Camera dei deputati) (collegato alla manovra di finanza
                      pubblica)  (voto finale con la presenza del numero
                      legale) - Relatore ORSOMARSO (Relazione orale) {" "}
                      <span className="inline-block rounded-lg leading-7 text-white bg-primary-900 px-2 mx-1">
                        674-B
                      </span>
                    </p>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-2xl p-6 text-zinc-800 space-y-4 leading-7">
                    <p>
                      <strong>
                        I. Ratifiche di accordi internazionali (elenco allegato)
                      </strong>
                    </p>
                    <p>
                      <strong>II. Discussione del disegno di legge:</strong>
                    </p>
                    <p>
                      Interventi a sostegno della competitività dei capitali e
                      delega al Governo per la riforma organica delle
                      disposizioni in materia di mercati dei capitali recate dal
                      testo unico di cui al decreto legislativo 24 febbraio
                      1998, n. 58, e delle disposizioni in materia di società
                      di capitali contenute nel codice civile applicabili anche
                      agli emittenti (approvato dal Senato e modificato dalla
                      Camera dei deputati) (collegato alla manovra di finanza
                      pubblica)  (voto finale con la presenza del numero
                      legale) - Relatore ORSOMARSO (Relazione orale) {" "}
                      <span className="inline-block rounded-lg leading-7 text-white bg-primary-900 px-2 mx-1">
                        674-B
                      </span>
                    </p>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-2xl p-6 text-zinc-800 space-y-4 leading-7">
                    <p>
                      <strong>
                        I. Ratifiche di accordi internazionali (elenco allegato)
                      </strong>
                    </p>
                    <p>
                      <strong>II. Discussione del disegno di legge:</strong>
                    </p>
                    <p>
                      Interventi a sostegno della competitività dei capitali e
                      delega al Governo per la riforma organica delle
                      disposizioni in materia di mercati dei capitali recate dal
                      testo unico di cui al decreto legislativo 24 febbraio
                      1998, n. 58, e delle disposizioni in materia di società
                      di capitali contenute nel codice civile applicabili anche
                      agli emittenti (approvato dal Senato e modificato dalla
                      Camera dei deputati) (collegato alla manovra di finanza
                      pubblica)  (voto finale con la presenza del numero
                      legale) - Relatore ORSOMARSO (Relazione orale) {" "}
                      <span className="inline-block rounded-lg leading-7 text-white bg-primary-900 px-2 mx-1">
                        674-B
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/6">
                <Link className="w-full block">
                  <div className="w-full aspect-video relative">
                    <img
                      src="images/thumbnail.jpg"
                      alt=""
                      className="w-full object-contain"
                    />
                    <span className="bg-primary-900 text-white leading-6 px-2 absolute left-2 top-2">
                      Live
                    </span>
                  </div>
                  <div className="w-full flex items-center space-x-2 p-3 bg-zinc-200 rounded-bl-2xl rounded-br-2xl">
                    <PlayIcon className="w-6 h-6" />
                    <span className="text-primary-900 font-medium text-lg">
                      In diretta
                    </span>
                  </div>
                </Link>
                <div className="w-full mt-8 bg-zinc-200 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <NotificationIcon className="w-6 h-6" />
                    <span className="text-primary-900 font-medium text-lg">
                      Altre notizie
                    </span>
                  </div>
                  <div className="w-full mt-4 text-zinc-800 space-y-2">
                    <p>
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim.
                    </p>
                    <p>
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim.
                    </p>
                    <p>
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim.
                    </p>
                    <p>
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim.
                    </p>
                    <p>
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim.
                    </p>
                    <p>
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim.
                    </p>
                  </div>
                  <Link className="w-full h-12 flex items-center justify-center bg-zinc-800 text-white rounded-xl mt-4 transition-colors hover:bg-zinc-900">
                    NOTIFICA
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 line-clamp-1 leading-9 h-9 overflow-hidden rounded-bl-2xl rounded-br-2xl">
              16.25 Scuola: Gilda, ministeri trovino soluzione per stipendi
              precari (z ANSA Politica) ~ 16.25 Confartigianato, 'no alla
              patente a crediti nell'edilizia' (z ANSA Economia e Finanza) ~
              16.25 Agricoltori: Fidanza (Fdi), richieste in linea nostre
              battaglie = (AGI) ~ 16.25 ++ 'Biden al confine col Messico lo
              stesso giorno di Trump' ++ (z ANSA Politica) ~ 16.26 Scontri Pisa:
              Conti, 'è pagina buia, polizia si può criticare' (z ANSA Cronaca)
              ~ 16.26 Giustizia: sabato riunione Anm su reclutamento
              straordinario = (AGI) ~ 16.28 Schlein, vita di Don Nicolini
              dedicata agli ultimi, mancherà (z ANSA Politica) ~ 16.28
              Hezbollah, 60 razzi contro base militare israeliana (2) (z ANSA
              Politica) ~ 16.30 Legale due poliziotti uccisi, 'dissento da
              Mattarella' (z ANSA Cronaca) ~ 16.30 Al via il Consiglio dei
              ministri (z ANSA Polit
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-12 flex lg:hidden fixed bottom-0 inset-x-0 bg-primary-900 z-20">
        <div className="w-1/2 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div
          className="w-1/2 flex items-center justify-center"
          onClick={toggleSidebarClickHandler}
        >
          <AppIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
