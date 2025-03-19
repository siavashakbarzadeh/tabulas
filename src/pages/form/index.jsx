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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", // start empty; update when user is available
    act_type: "",
    recipient_office: "",
    submission_date: "",
    document: null,
    firmatarios: [], // stores the selected user objects
  });

  // When the user object becomes available, update "name" field.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.email || user.name,
      }));
    }
  }, [user]);

  // Holds the current search query (what the user types)
  const [firmatarioQuery, setFirmatarioQuery] = useState("");

  // Holds the API search results
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleUpdateFormData = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle changes to the firmatario search input
  const handleFirmatarioQueryChange = (e) => {
    const value = e.target.value;
    setFirmatarioQuery(value);
    if (value.trim().length > 0) {
      handleSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Call the API to search for users by email (or name)
  const handleSearch = (query) => {
    axios
      .get(`/users/search?query=${query}`)
      .then((res) => {
        // Expecting the JSON response to include users in res.data.data.users
        setSearchResults(res.data.data.users || []);
      })
      .catch(() => setSearchResults([]));
  };

  // When a user is selected from the dropdown
  const handleSelectFirmatario = (selectedUser) => {
    // Use name if available; otherwise, fallback to email
    const displayValue = selectedUser.name || selectedUser.email;
    // Avoid duplicates
    const alreadySelected = formData.firmatarios.some(
      (f) => f.id === selectedUser.id
    );
    if (!alreadySelected) {
      setFormData((prev) => ({
        ...prev,
        firmatarios: [...prev.firmatarios, selectedUser],
      }));
    }
    // Clear the query so the dropdown hides and the input resets
    setFirmatarioQuery("");
    setSearchResults([]);
  };

  // Allow removal of a selected firmatario
  const removeFirmatario = (userId) => {
    setFormData((prev) => ({
      ...prev,
      firmatarios: prev.firmatarios.filter((f) => f.id !== userId),
    }));
  };

  // Handle form submission
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
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // Extract the application ID from the response
        const applicationId = res.data.data.application.id;
        navigate(`/confirm/${applicationId}`);
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
          toast.error(
            error.response?.data?.data?.message || "Error",
            { position: "bottom-right", hideProgressBar: true }
          );
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
              <div className="gap-4 w-10/12 lg:w-10/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
                  {/* Firmatari Section */}
                  <div className="col-span-2 relative">
                    <label
                      htmlFor="firmatarioQuery"
                      className="block text-sm font-medium mb-1"
                    >
                      Firmatari
                    </label>
                    <input
                      id="firmatarioQuery"
                      type="text"
                      className="border p-2 rounded w-full"
                      placeholder="Digita per cercare e selezionare i firmatari..."
                      value={firmatarioQuery}
                      onChange={handleFirmatarioQueryChange}
                    />
                    {/* Dropdown for search suggestions */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-50 top-full left-0 w-full border bg-white mt-1 max-h-40 overflow-auto">
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
                    {/* Display selected firmatarios as chips */}
                    <div className="flex flex-wrap mt-2 gap-2">
                      {formData.firmatarios.map((userItem) => (
                        <div
                          key={userItem.id}
                          className="bg-gray-200 text-sm rounded-full px-3 py-1 flex items-center"
                        >
                          <span>{userItem.name || userItem.email}</span>
                          <button
                            type="button"
                            className="ml-2 text-gray-600 hover:text-gray-800"
                            onClick={() => removeFirmatario(userItem.id)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
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
                  {/* Submit Button */}
                  <div className="mt-6 col-span-2">
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
    </div>
  );
}

export default FormPage;
