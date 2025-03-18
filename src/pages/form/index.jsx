import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import TextInput from "../../componenets/forms/TextInput";
import CustomSelect from "../../componenets/forms/CustomSelect";
import DateInput from "../../componenets/forms/DateInput";
import CustomButton from "../../componenets/forms/CustomButton";
import FileInput from "../../componenets/forms/FileInput";
import axios from "../../configs/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Example dropdown data
const act_types = ["DDL 1", "DDL 2", "DDL 3", "DDL 4", "DDL 5"];
const recipient_offices = [
  "Ufficio 1",
  "Ufficio 2",
  "Ufficio 3",
  "Ufficio 4",
  "Ufficio 5",
];

function FormPage() {
  // Logged-in user from context
  const { user } = useAuth();

  // Local form state
  const [formData, setFormData] = useState({
    name: user?.email || "", // or user?.name
    act_type: "",
    recipient_office: "",
    submission_date: "",
    document: null,
    firmatarios: [], // will hold actual selected user objects
  });

  // This holds the text typed by the user for searching/adding firmatarios
  const [firmatarioInput, setFirmatarioInput] = useState("");

  // Search results returned by the API
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle updating form data fields (except firmatarios)
  const handleUpdateFormData = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle changes to the firmatario text area
  const handleFirmatarioChange = (e) => {
    const value = e.target.value;
    setFirmatarioInput(value);

    // Basic example: search the entire text. 
    // In a real scenario, you might parse the last typed "word" or use a mention approach.
    if (value.trim().length > 0) {
      handleSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Search API call
  const handleSearch = (query) => {
    axios
      .get(`/users/search?query=${query}`)
      .then((res) => {
        // Adjust as per your actual API response structure
        setSearchResults(res.data.data || []);
      })
      .catch(() => setSearchResults([]));
  };

  // When user clicks a search suggestion
  const handleSelectFirmatario = (selectedUser) => {
    // Avoid duplicates
    const alreadySelected = formData.firmatarios.some((f) => f.id === selectedUser.id);
    if (!alreadySelected) {
      // Add to the array of selected firmatarios
      setFormData((prev) => ({
        ...prev,
        firmatarios: [...prev.firmatarios, selectedUser],
      }));
      // Append the user's name to the text area, plus a comma or space
      setFirmatarioInput((prevText) =>
        (prevText.trim() ? prevText.trim() + " " : "") + selectedUser.name + ", "
      );
    }
    setSearchResults([]);
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

    // Append each firmatario ID
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
    <>
      {/* Header / Search Bar */}
      <div className="p-4 border-b border-gray-300">
        <input
          type="text"
          placeholder="Cerca..."
          className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-4 ring-0 focus:ring-0 focus:border-none"
        />
      </div>

      {/* Main Form Container */}
      <div className="p-4">
        {/* Nome atto - disabled */}
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

        {/* Tipo atto & Ufficio destinatario */}
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

        {/* Firmatari - single textarea with dynamic suggestions */}
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
          {/* Dropdown with search results */}
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

        {/* Data Invio & Document */}
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
    </>
  );
}

export default FormPage;
