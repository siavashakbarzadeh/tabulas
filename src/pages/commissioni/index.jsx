import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Which "mode" the sidebar is in: "main" or "sub"
  const [sidebarMode, setSidebarMode] = useState("main");
  // The top-level item we clicked on (if any) that has sub docNodes
  const [selectedMainDocNode, setSelectedMainDocNode] = useState(null);
  // The docNode whose content we are showing in the main area
  const [selectedContentNode, setSelectedContentNode] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("tabulas/mobile/commissioni")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Handle clicking on a top-level docNode in the sidebar
   */
  const handleClickTopLevel = (node) => {
    // Reset any selected content
    setSelectedContentNode(null);

    // If this node has child docNodes, switch to "sub" mode
    if (node.docNodes && node.docNodes.length > 0) {
      setSelectedMainDocNode(node);
      setSidebarMode("sub");
    }
    // Otherwise, if it has docContent, show it in the main area
    else if (node.docContentStreamContent) {
      setSelectedContentNode(node);
    }
  };

  /**
   * Handle clicking on a sub-level docNode
   */
  const handleClickSubNode = (node) => {
    // Show this node's content in the main area
    setSelectedContentNode(node);
  };

  /**
   * Go back from "sub" mode to "main" mode
   */
  const handleBack = () => {
    setSidebarMode("main");
    setSelectedMainDocNode(null);
    setSelectedContentNode(null);
  };

  /**
   * Render the sidebar according to sidebarMode
   */
  const renderSidebar = () => {
    if (sidebarMode === "main") {
      // Show the top-level docNodes
      const topNodes = data?.docNodes || [];
      return (
        <ul className="space-y-1">
          {topNodes.map((node, index) => (
            <li key={index}>
              <button
                onClick={() => handleClickTopLevel(node)}
                className="w-full text-left px-4 py-2 rounded bg-white text-gray-800 hover:bg-gray-200"
              >
                {node.name}
              </button>
            </li>
          ))}
        </ul>
      );
    } else {
      // "sub" mode: show a Back button + sub docNodes of selectedMainDocNode
      const subNodes = selectedMainDocNode?.docNodes || [];
      return (
        <div>
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-2 px-3 py-2 rounded bg-red-600 text-white"
          >
            &larr; Back
          </button>
          <ul className="space-y-1">
            {subNodes.map((node, index) => (
              <li key={index}>
                <button
                  onClick={() => handleClickSubNode(node)}
                  className="w-full text-left px-4 py-2 rounded bg-white text-gray-800 hover:bg-gray-200"
                >
                  {node.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  /**
   * Render the main content area for selectedContentNode
   */
  const renderContent = () => {
    if (!selectedContentNode) {
      return (
        <div className="p-4 text-gray-500">
          Seleziona un elemento dal menu per visualizzare i dettagli.
        </div>
      );
    }
    // If there's HTML content, render it
    if (selectedContentNode.docContentStreamContent) {
      return (
        <div
          className="rich-text-content p-4 bg-gray-100 rounded"
          dangerouslySetInnerHTML={{
            __html: selectedContentNode.docContentStreamContent,
          }}
        />
      );
    }
    // Otherwise, just show the name or a fallback
    return (
      <div className="p-4 bg-gray-100 rounded">
        Nessun contenuto HTML per: {selectedContentNode.name}
      </div>
    );
  };

  // Show loading if data not loaded
  if (loading || data === null) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white rounded-lg relative px-4 pt-4 pb-10">
        {/* Search Bar */}
        <form className="w-full">
          <label className="w-full block relative">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-10 bg-neutral-200 text-sm rounded-md border border-neutral-300 px-4 focus:outline-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2"
            />
          </label>
        </form>

        {/* Layout: Sidebar on the left, Content on the right */}
        <div className="flex mt-4">
          <div className="w-64 mr-4 bg-gray-100 p-3 rounded-md">
            {/* Title if you want */}
            <div className="font-medium text-gray-700 mb-2">{data.name}</div>
            {renderSidebar()}
          </div>

          <div className="flex-1 ml-4">{renderContent()}</div>
        </div>

        {/* Footer / News Section */}
        <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 text-sm leading-8 h-8 overflow-hidden rounded-b-md">
          News Section Here...
        </div>
      </div>

      {/* Style links in any dynamically inserted content */}
      <style>
        {`
          .rich-text-content a {
            color: rgb(151, 0, 45) !important;
            font-weight: bold;
            text-decoration: underline;
          }
        `}
      </style>
    </>
  );
}

export default CommissioniPage;
