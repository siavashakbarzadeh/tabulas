import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../configs/axiosConfig.js";

function ConfirmPage() {
  const { id } = useParams(); // the application_id from the URL
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/applications/${id}`)
      .then((res) => {
        setApplication(res.data.data.application); // or however your API returns it
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>No application found.</div>;
  }

  // Suppose your API returns a "document" relationship with a "files" array
  // that includes a URL to the PDF, e.g. application.document.files.pdf
  const pdfUrl = application.document?.[0]?.files?.pdf || null;

  const handleConfirm = () => {
    // Handle “SI” action, e.g. finalize or do something
    // ...
    navigate("/thank-you");
  };

  const handleCancel = () => {
    // Handle “No Grazie” action
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Anteprima Documento Firmato</h2>

        {/* Show the PDF preview */}
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="400px"
          />
        ) : (
          <p>Nessun documento caricato.</p>
        )}

        {/* Show the form data fields */}
        <div className="mt-4">
          <p><strong>Tipo Atto:</strong> {application.act_type}</p>
          <p><strong>Ufficio Destinatario:</strong> {application.recipient_office}</p>
          <p><strong>Data Invio:</strong> {application.submission_date}</p>
          {/* ... any other fields you need to show ... */}
        </div>

        {/* Confirmation Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            Invia
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={handleCancel}
          >
            No Grazie
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
