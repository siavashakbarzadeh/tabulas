import { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import CloseIcon from "../../icons/Close";
import TextInput from "../../componenets/forms/TextInput";
import CustomSelect from "../../componenets/forms/CustomSelect";
import DateInput from "../../componenets/forms/DateInput";
import CustomButton from "../../componenets/forms/CustomButton";
import FileInput from "../../componenets/forms/FileInput";

function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    act_type: "",
  });
  const [file, setFile] = useState(null);
  const [actType, setActType] = useState(null);

  const act_types = ["DDL 1", "DDL 2", "DDL 3", "DDL 4", "DDL 5"];

  const recipient_offices = [
    "Ufficio 1",
    "Ufficio 2",
    "Ufficio 3",
    "Ufficio 4",
    "Ufficio 5",
  ];

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] z-40 pl-0 lg:pl-68 flex">
        <div className="w-full flex p-2 md:p-4">
          <div className="w-full flex relative overflow-auto">
            <div className="grid grid-cols-2 gap-4 w-11/12 lg:w-10/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="col-span-1">
                <TextInput
                  id="name"
                  label="Nome atto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Nome atto"
                />
              </div>
              <div className="col-span-1">
                <CustomSelect
                  id="act_type"
                  label="Tipo atto"
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      act_type: e.target.value,
                    }))
                  }
                  options={act_types}
                />
              </div>
              <div className="col-span-1">
                <CustomSelect
                  id="recipient_office"
                  label="Ufficio destinatario"
                  onChange={(e) => setActType(e.target.value)}
                  options={recipient_offices}
                />
              </div>
              <div className="col-span-1">
                <DateInput
                  id="submission_date"
                  label="Data Invio"
                  placeholder="Data Invio"
                  onChange={(e) => setActType(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <FileInput
                  id="document"
                  label="Documenti"
                  onChange={(e) => setActType(e)}
                />
              </div>
              <div className="col-span-1 flex items-end">
                <CustomButton label="Submit" onClick={handleSubmit} />
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

export default FormPage;
