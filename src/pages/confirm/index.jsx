// src/pages/ConfirmPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../configs/axiosConfig.js";
import { toast } from "react-toastify";
import SearchIcon from "../../assets/svg/search.svg";

function ConfirmPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/applications/${id}`)
      .then((res) => {
        // Assuming the API returns the application in res.data.data.application
        setApplication(res.data.data.application);
      })
      .catch(() => {
        toast.error("Failed to load application preview");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!application) return <div>No application found.</div>;

  // Extract the PDF URL from the document relationship (adjust as needed)
  const pdfUrl = application.document?.files?.original || null;

  const handleConfirm = () => {
    axios
      .post(`/applications/${id}/confirm`)
      .then(() => {
        toast.success("Application confirmed successfully");
        navigate(`/finalize/${id}`);
      })
      .catch(() => {
        toast.error("Failed to confirm application");
      });
  };

  const handleDecline = () => {
    axios
      .post(`/applications/${id}/decline`)
      .then(() => {
        toast.success("Application declined");
        navigate("/");
      })
      .catch(() => {
        toast.error("Failed to decline application");
      });
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
          <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Anteprima Applicazione</h2>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-96 mb-4"
              />
            ) : (
              <p>Nessun documento caricato.</p>
            )}
            <div className="mb-4">
              <p>
                <strong>Tipo Atto:</strong> {application.act_type}
              </p>
              <p>
                <strong>Ufficio Destinatario:</strong> {application.recipient_office}
              </p>
              <p>
                <strong>Data Invio:</strong> {application.submission_date}
              </p>
              {/* Add any additional fields as needed */}
            </div>
            <div className="flex justify-start mt-6 space-x-5">
              <button
                onClick={handleConfirm}
                className="bg-red-700 text-white px-4 py-2 rounded w-10/12"
              >
                Conferma
              </button>
              <button
                onClick={handleDecline}
                className="bg-neutral-200 text-dark px-4 py-2 rounded"
              >
                No Grazie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
