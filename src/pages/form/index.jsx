import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import SearchIcon from "../../assets/svg/search.svg";
import TextInput from "../../componenets/forms/TextInput";
import CustomSelect from "../../componenets/forms/CustomSelect";
import DateInput from "../../componenets/forms/DateInput";
import CustomButton from "../../componenets/forms/CustomButton";
import FileInput from "../../componenets/forms/FileInput";
import axios from "../../configs/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const act_types = ["DDL 1", "DDL 2", "DDL 3", "DDL 4", "DDL 5"];
const recipient_offices = [
  "Ufficio 1",
  "Ufficio 2",
  "Ufficio 3",
  "Ufficio 4",
  "Ufficio 5",
];

function FormPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.email || "", // prefill with user's email
    act_type: "",
    recipient_office: "",
    submission_date: "",
    document: null,
    firmatarios: [], // stores selected users
  });

  // Holds the text typed into the firmatario textarea
  const [firmatarioInput, setFirmatarioInput] = useState("");

  // Search results from the API (expects response.data.data.users)
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleUpdateFormData = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Trigger API search as the user types
  const handleFirmatarioChange = (e) => {
    const value = e.target.value;
    setFirmatarioInput(value);

    if (value.trim().length > 0) {
      handleSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Perform API search and retrieve users from res.data.data.users
  const handleSearch = (query) => {
    axios
      .get(`/users/search?query=${query}`)
      .then((res) => {
        // Adjusted to access the "users" array inside the data object
        setSearchResults(res.data.data.users || []);
      })
      .catch(() => setSearchResults([]));
  };

  // When a user is selected from the dropdown
  const handleSelectFirmatario = (selectedUser) => {
    // Use name if available; otherwise, use email
    const displayValue = selectedUser.name || selectedUser.email;

    // Prevent duplicates
    const alreadySelected = formData.firmatarios.some(
      (f) => f.id === selectedUser.id
    );
    if (!alreadySelected) {
      setFormData((prev) => ({
        ...prev,
        firmatarios: [...prev.firmatarios, selectedUser],
      }));
      // Append the display value (email or name) to the textarea (with a comma)
      setFirmatarioInput((prevText) =>
        (prevText.trim() ? prevText.trim() + " " : "") + displayValue + ", "
      );
    }
    setSearchResults([]);
  };

  // Form submission handler
  const handleSubmit = () => {
    setIsLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("act_type", formData.act_type);
    formDataObj.append("recipient_office", formData.recipient_office);
    formDataObj.append("submission_date", formData.submission_date);
    formDataObj.append("document", formData.document);

    // Append each firmatario's ID
    formData.firmatarios.forEach((f) => {
      formDataObj.append("firmatarios[]", f.id);
    });

    axios
      .post("/applications", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate("/confirm");
      })
      .catch((error) => {
        if (error.response?.status === 422) {
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
          toast.error(error.response?.data?.data?.message || "Error", {
            position: "bottom-right",
            hideProgressBar: true,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
      <div className="flex flex-col min-h-screen w-full">
        {/* Main white container */}
        <div className="flex-1 bg-white rounded-2xl relative p-4">
          {/* Search Bar */}
          <form className="w-full mb-4">
            <label className="w-full block relative">
              <input
                type="text"
                placeholder="Cerca..."
                className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
              />
              <img
                src={SearchIcon}
                alt="Search"
                className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
              />
            </label>
          </form>
          <div className="flex w-full">
            {/* Main content area with centered white card */}
            <div className="p-4 flex-1 flex justify-center items-start">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-11/12 lg:w-10/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* 2-column grid for fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Nome Atto */}
                  <div>
                    <TextInput
                      id="name"
                      label="Nome atto"
                      value={formData.name}
                      disabled
                      onChange={() => { }}
                      placeholder="Nome atto"
                    />
                  </div>
                  {/* Tipo atto */}
                  <div>
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
                  {/* Firmatari */}
                  <div className="col-span-2">
                    <label
                      htmlFor="firmatarioInput"
                      className="block text-sm font-medium mb-1"
                    >
                      Firmatari
                    </label>
                    <textarea
                      id="firmatarioInput"
                      rows={2}
                      className="border p-2 rounded w-full"
                      placeholder="Digita per cercare e selezionare i firmatari..."
                      value={firmatarioInput}
                      onChange={handleFirmatarioChange}
                    />
                    {/* Dropdown for search suggestions */}
                    {searchResults.length > 0 && (
                      <div className="border rounded bg-white max-h-40 overflow-auto mt-1">
                        {searchResults.map((userItem) => (
                          <div
                            key={userItem.id}
                            className="cursor-pointer p-2 hover:bg-gray-200 border-b"
                            onClick={() => handleSelectFirmatario(userItem)}
                          >
                            {userItem.name || userItem.email}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Ufficio destinatario */}
                  <div>
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
                  <div>
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
                  <div className="col-span-2">
                    <FileInput
                      id="document"
                      label="File da Inviare"
                      file={formData.document}
                      error_message={errors.document}
                      onChange={(e) =>
                        handleUpdateFormData("document", e.target.files[0])
                      }
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <div className="mt-6">
                  <CustomButton
                    label="Prepara per Invio"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
