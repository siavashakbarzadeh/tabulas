// src/pages/ConfirmPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../configs/axiosConfig.js";
import { toast } from "react-toastify";

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
      .catch((err) => {
        toast.error("Failed to load application preview");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!application) return <div>No application found.</div>;

  // Extract the PDF URL from the document relationship (adjust as needed)
  const pdfUrl = application.document?.files?.original || null;

  const handleConfirm = () => {
    // Handle confirmation (e.g., finalize the application)
    // You can also navigate to a final thank-you page
    navigate(`/finalize/${id}`);
  };

  const handleDecline = () => {
    // For example, call an API to decline the application or update its status
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
    <div className="flex flex-col items-center p-4">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl">
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
          {/* Add more fields as needed */}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Conferma
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            No Grazie
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
