import React, { useEffect, useState } from "react";
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

  // Form state
  const [formData, setFormData] = useState({
    name: user?.email || "", // Prefill with logged-in user's email
    act_type: "",
    recipient_office: "",
    submission_date: "",
    document: null,
    firmatarios: [], // Array of selected firmatario user objects
  });

  // This state holds the text typed into the firmatario textarea.
  const [firmatarioInput, setFirmatarioInput] = useState("");

  // For API search results
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleUpdateFormData = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // When user types in the textarea for firmatari, update the input and trigger a search.
  const handleFirmatarioChange = (e) => {
    const value = e.target.value;
    setFirmatarioInput(value);
    if (value.trim().length > 0) {
      handleSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // API call to search for users based on the query.
  const handleSearch = (query) => {
    axios
      .get(`/users/search?query=${query}`)
      .then((res) => {
        setSearchResults(res.data.data || []);
      })
      .catch(() => setSearchResults([]));
  };

  // When the user selects a suggestion from the dropdown.
  const handleSelectFirmatario = (selectedUser) => {
    // Prevent duplicates.
    const alreadySelected = formData.firmatarios.some(
      (f) => f.id === selectedUser.id
    );
    if (!alreadySelected) {
      setFormData((prev) => ({
        ...prev,
        firmatarios: [...prev.firmatarios, selectedUser],
      }));
      // Append the selected user's name (with a comma separator) to the textarea.
      setFirmatarioInput((prevText) =>
        (prevText.trim() ? prevText.trim() + " " : "") + selectedUser.name + ", "
      );
    }
    setSearchResults([]);
  };

  // Form submission.
  const handleSubmit = () => {
    setIsLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("act_type", formData.act_type);
    formDataObj.append("recipient_office", formData.recipient_office);
    formDataObj.append("submission_date", formData.submission_date);
    formDataObj.append("document", formData.document);
    // Append each selected firmatario's ID.
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
    <div className="flex flex-col min-h-screen w-full">
      {/* Header Search Bar */}
      <div className="p-4 border-b border-gray-300">
        <form className="w-full">
          <label className="w-full block relative">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-16 ring-0 focus:ring-0 focus:border-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
            />
          </label>
        </form>
      </div>

      {/* Main Form Container */}
      <div className="p-4 bg-white rounded-2xl relative">
        {/* Nome atto (prefilled and disabled) */}
        <div className="mb-4">
          <TextInput
            id="name"
            label="Nome atto"
            value={formData.name}
            disabled
            onChange={() => { }}
            placeholder="Nome atto"
          />
        </div>

        {/* Act Type and Ufficio destinatario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <CustomSelect
              id="act_type"
              label="Tipo atto"
              value={formData.act_type}
              error_message={errors.act_type}
              onChange={(e) => handleUpdateFormData("act_type", e.target.value)}
              options={act_types}
            />
          </div>
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
        </div>

        {/* Firmatari Selection */}
        <div className="mb-4">
          <label htmlFor="firmatarioInput" className="block text-sm font-medium mb-1">
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
          {/* Dropdown for API search suggestions */}
          {searchResults.length > 0 && (
            <div className="border rounded bg-white max-h-40 overflow-auto mt-1">
              {searchResults.map((userItem) => (
                <div
                  key={userItem.id}
                  className="cursor-pointer p-2 hover:bg-gray-200 border-b"
                  onClick={() => handleSelectFirmatario(userItem)}
                >
                  {userItem.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Invio & Document Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
          <div>
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
        </div>

        {/* Submit Button */}
        <div>
          <CustomButton
            label="Prepara per Invio"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default FormPage;
