import React, { useEffect, useState, useRef } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

const ITEMS_PER_PAGE = 20;

const extractHref = (htmlString) => {
    const match = htmlString.match(/href="([^"]+)"/);
    return match ? match[1] : "#";
};

function Ultimidossierage1() {
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const headerRefs = useRef([]);

    useEffect(() => {
        axios.get("tabulas/mobile/ultimdossier")
            .then((res) => {
                setRecords(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const stickyHeader = document.getElementById("main-sticky-header");
            const isOverlapping = headerRefs.current.some((el) => {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.top <= 0 && rect.bottom > 0;
            });

            if (stickyHeader) {
                stickyHeader.style.visibility = isOverlapping ? "hidden" : "visible";
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="w-full flex justify-center">
                <Loading />
            </div>
        );
    }

    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
    const displayedRecords = records.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex flex-col min-h-screen w-full">
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

                <table className="w-full border-collapse ">
                    <thead>
                        <tr id="main-sticky-header"
                            style={{ position: "sticky", top: 0, zIndex: 10 }}
                            className="bg-red-800 text-white"
                        >
                            <th className="py-3 px-4 text-left">
                                Identificativo Documento
                            </th>
                            <th className="py-3 px-4 text-left">Servizio</th>
                            <th className="py-3 px-4 text-left">Data</th>
                            <th className="py-3 px-4 text-left">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedRecords.map((record, index) => (
                            <React.Fragment key={index}>
                                {/* Header row */}
                                <tr
                                    ref={(el) => headerRefs.current[index] = el}
                                    className="bg-gray-100 header-row"
                                >
                                    <td className="py-3 px-4 text-left">
                                        {record.documentIdentifier}
                                    </td>
                                    <td className="py-3 px-4 text-left">{record.servizio}</td>
                                    <td className="py-3 px-4 text-left">{record.date}</td>
                                    <td className="py-3 px-4 text-left">
                                        <div className="flex space-x-4">
                                            <a
                                                href={extractHref(record.label)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="fa-duotone fa-globe text-xl text-red-800"></i>
                                            </a>
                                            <a
                                                href={extractHref(record.pdf)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="fa-duotone fa-file-pdf text-xl text-red-800"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                {/* Content row */}
                                <tr className="border-b border-l border-r bg-white" style={{ boxShadow: '4px 3px 6px #b8b8b85c' }}>
                                    <td colSpan="4" className="py-3 px-4 text-left description-row">
                                        <strong>Description:</strong>{" "}
                                        {record.description || "-"}
                                        {record.riferimenti.length > 0 && (
                                            <>
                                                <br />
                                                <strong>Riferimenti:</strong>
                                                <ul className="list-disc ml-6 text-left">
                                                    {record.riferimenti.map((ref, idx) => (
                                                        <li key={idx}>{ref}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr style={{ height: '30px' }}></tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* Style block for description row */}
            <style jsx>{`
        .description-row {
          position: relative;
        }
        .description-row::before {
          content: "";
          display: inline-block;
          width: 20px;
          height: 20px;
          position: absolute;
          top: -6px;
          transform: rotate(45deg);
          background: white;
        }
      `}</style>
        </div >
    );
}

export default Ultimidossierage1;
