import { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import CloseIcon from "../../icons/Close";
import TextInput from "../../componenets/forms/TextInput";
import CustomSelect from "../../componenets/forms/CustomSelect";
import DateInput from "../../componenets/forms/DateInput";
import CustomButton from "../../componenets/forms/CustomButton";
import FileInput from "../../componenets/forms/FileInput";
import axios from "../../configs/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Initial state now includes firmatarios as an empty array and removes the sign field.
const formInitialState = {
  name: "", // will be set to currentUser.name below
  act_type: "",
  recipient_office: "",
  submission_date: "",
  document: null,
  firmatarios: [],
};

function FormPage({ currentUser }) {
  const [formData, setFormData] = useState({
    ...formInitialState,
    name: currentUser?.name || "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const act_types = ["DDL 1", "DDL 2", "DDL 3", "DDL 4", "DDL 5"];
  const recipient_offices = [
    "Ufficio 1",
    "Ufficio 2",
    "Ufficio 3",
    "Ufficio 4",
    "Ufficio 5",
  ];

  // Search for firmatario users as the user types.
  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    axios
      .get(`/users/search?query=${query}`)
      .then((res) => setSearchResults(res.data.data))
      .catch(() => setSearchResults([]));
  };

  const handleUpdateFormData = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle submission by building a FormData payload.
  // Note: firmatarios are appended as an array (firmatarios[])
  const handleSubmit = () => {
    setIsLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("act_type", formData.act_type);
    formDataObj.append("recipient_office", formData.recipient_office);
    formDataObj.append("submission_date", formData.submission_date);
    formDataObj.append("document", formData.document);
    // Append each selected firmatario ID
    formData.firmatarios.forEach((user) => {
      formDataObj.append("firmatarios[]", user.id);
    });
    axios
      .post("/applications", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        navigate("/confirm");
      })
      .catch((error) => {
        if (error.response.status === 422) {
          const responseErrors = error.response.data.errors;
          const result = Object.keys(responseErrors).reduce((acc, key) => {
            const item = responseErrors[key];
            if (item && item.length) {
              acc[key] = item[0];
            }
            return acc;
          }, {});
          setErrors(result);
        } else {
          toast.error(error.response.data.data.message, {
            position: "bottom-right",
            hideProgressBar: true,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {/* Form Container */}
      <div className="w-full flex p-2 md:p-4">
        <div className="w-full flex relative overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-11/12 lg:w-10/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {/* Nome atto - disabled and set to logged-in user's name */}
            <div className="col-span-1">
              <TextInput
                id="name"
                label="Nome atto"
                value={formData.name}
                disabled={true}
                onChange={() => { }}
                placeholder="Nome atto"
              />
            </div>
            {/* Tipo atto */}
            <div className="col-span-1">
              <CustomSelect
                id="act_type"
                label="Tipo atto"
                value={formData.act_type}
                error_message={errors.act_type}
                onChange={(e) =>
                  handleUpdateFormData("act_type", e.target.value)
                }
                options={act_types}
              />
            </div>
            {/* Firmatario - search and select multiple */}
            <div className="col-span-1">
              <label htmlFor="firmatario" className="block text-sm font-medium">
                Firmatario
              </label>
              <input
                id="firmatario"
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Cerca firmatario..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              {/* Dropdown for search results */}
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="cursor-pointer p-2 hover:bg-gray-200 border-b"
                  onClick={() => {
                    // Add the selected user if not already added
                    if (
                      !formData.firmatarios.some(
                        (selected) => selected.id === user.id
                      )
                    ) {
                      setFormData((prevState) => ({
                        ...prevState,
                        firmatarios: [...prevState.firmatarios, user],
                      }));
                    }
                    setSearchResults([]);
                  }}
                >
                  {user.name}
                </div>
              ))}
              {/* Display selected firmatarios */}
              {formData.firmatarios.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.firmatarios.map((user) => (
                    <div
                      key={user.id}
                      className="px-2 py-1 bg-gray-200 rounded flex items-center"
                    >
                      {user.name}
                      <button
                        onClick={() => {
                          setFormData((prevState) => ({
                            ...prevState,
                            firmatarios: prevState.firmatarios.filter(
                              (u) => u.id !== user.id
                            ),
                          }));
                        }}
                        className="ml-1 text-red-500"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Ufficio destinatario */}
            <div className="col-span-1">
              <CustomSelect
                id="recipient_office"
                label="Ufficio destinatario"
                value={formData.recipient_office}
                error_message={errors.recipient_office}
                onChange={(e) =>
                  handleUpdateFormData("recipient_office", e.target.value)
                }
                options={recipient_offices}
              />
            </div>
            {/* Data Invio */}
            <div className="col-span-1">
              <DateInput
                id="submission_date"
                label="Data Invio"
                placeholder="Data Invio"
                value={formData.submission_date}
                error_message={errors.submission_date}
                onChange={(e) =>
                  handleUpdateFormData("submission_date", e.target.value)
                }
              />
            </div>
            {/* Document Upload */}
            <div className="col-span-1">
              <FileInput
                id="document"
                label="Documenti"
                file={formData.document}
                error_message={errors.document}
                onChange={(e) =>
                  handleUpdateFormData("document", e.target.files[0])
                }
              />
            </div>
            {/* Sign Upload removed as requested */}
            <div className="col-span-1 flex items-end">
              <CustomButton
                label="Submit"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Page Content (e.g. search bar, ticker) */}
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
