import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // "level0" = top-level menu
  // "level1" = sub-level menu
  // "level2" = sub-sub-level, etc. (you can keep going if needed)
  const [sidebarMode, setSidebarMode] = useState("level0");

  // The node whose children we are currently showing in the sidebar
  const [selectedNode, setSelectedNode] = useState(null);

  // The node whose content we display in the main area
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

  // -----------------------------
  // Handlers for Sidebar Clicks
  // -----------------------------

  /**
   * Clicking a top-level item in the "level0" sidebar.
   */
  const handleClickTopLevel = (node) => {
    setSelectedContentNode(null); // Clear main area by default

    // If the node has children, switch to next level
    if (node.docNodes && node.docNodes.length > 0) {
      setSelectedNode(node);
      setSidebarMode("level1");
    }
    // If the node has HTML content, show it
    if (node.docContentStreamContent) {
      setSelectedContentNode(node);
    }
  };

  /**
   * Clicking an item in the sub-level (level1) sidebar.
   */
  const handleClickSubLevel = (node) => {
    setSelectedContentNode(null);

    // If it has child docNodes, we can go deeper or show them
    if (node.docNodes && node.docNodes.length > 0) {
      // Switch to next mode if you want more nesting
      // For simplicity, let's just re-use "level1" or call it "level2".
      setSelectedNode(node);
      setSidebarMode("level2");
    }
    // Show content if it has any
    if (node.docContentStreamContent) {
      setSelectedContentNode(node);
    }
  };

  /**
   * Clicking an item in "level2" (or deeper).
   */
  const handleClickSubSubLevel = (node) => {
    setSelectedContentNode(null);
    if (node.docNodes && node.docNodes.length > 0) {
      // You could go still deeper if needed
      setSelectedNode(node);
      setSidebarMode("level3");
    }
    if (node.docContentStreamContent) {
      setSelectedContentNode(node);
    }
  };

  // -----------------------------
  // Back Buttons
  // -----------------------------

  /**
   * Go back from level1 to level0
   */
  const handleBackLevel1 = () => {
    setSidebarMode("level0");
    setSelectedNode(null);
    setSelectedContentNode(null);
  };

  /**
   * Go back from level2 to level1
   */
  const handleBackLevel2 = () => {
    // Go back to showing the docNodes of whichever node took us to level1
    // For simplicity, let's assume that was the selectedNode from level0
    // or you can store separate states for each level
    setSidebarMode("level1");
    // We do NOT reset selectedNode to null because we want to show the children
    // of that node from level1. Possibly store a separate "parentNode" if needed.
    setSelectedContentNode(null);
  };

  // -----------------------------
  // Rendering the Sidebar
  // -----------------------------

  const renderSidebar = () => {
    if (sidebarMode === "level0") {
      // Show top-level items (like "Quadro sinottico", "Permanenti", etc.)
      const topNodes = data?.docNodes || [];
      return (
        <div>
          <ul className="space-y-1">
            {topNodes.map((node, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleClickTopLevel(node)}
                  className="w-full text-left px-4 py-2 rounded bg-white text-gray-800 hover:bg-gray-200"
                >
                  {node.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (sidebarMode === "level1") {
      // Show sub-level of selectedNode
      const subNodes = selectedNode?.docNodes || [];
      return (
        <div>
          {/* Back button */}
          <button
            onClick={handleBackLevel1}
            className="mb-2 px-3 py-2 rounded bg-red-600 text-white"
          >
            &larr; Back
          </button>
          <ul className="space-y-1">
            {subNodes.map((node, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleClickSubLevel(node)}
                  className="w-full text-left px-4 py-2 rounded bg-white text-gray-800 hover:bg-gray-200"
                >
                  {node.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (sidebarMode === "level2") {
      // We can keep going deeper
      const subNodes = selectedNode?.docNodes || [];
      return (
        <div>
          {/* Back button */}
          <button
            onClick={handleBackLevel2}
            className="mb-2 px-3 py-2 rounded bg-red-600 text-white"
          >
            &larr; Back
          </button>
          <ul className="space-y-1">
            {subNodes.map((node, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleClickSubSubLevel(node)}
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
    // If you need more levels, you can add "level3" etc.
    return <div>Unknown sidebar mode</div>;
  };

  // -----------------------------
  // Rendering the Main Content
  // -----------------------------

  const renderContent = () => {
    if (!selectedContentNode) {
      return (
        <div className="p-4 text-gray-500">
          Seleziona un elemento dal menu per visualizzare i dettagli.
        </div>
      );
    }
    // If there's HTML content, display it
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
    // Otherwise, show a fallback
    return (
      <div className="p-4 bg-gray-100 rounded">
        Nessun contenuto HTML per: {selectedContentNode.name}
      </div>
    );
  };

  // -----------------------------
  // Main Render
  // -----------------------------

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return <div className="w-full flex justify-center mt-10">Nessun dato</div>;
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

        <div className="w-full flex mt-4">
          {/* Left: Sidebar */}
          <div className="w-64 mr-4 bg-gray-100 p-3 rounded-md">
            <div className="font-medium text-gray-700 mb-2">{data.name}</div>
            {renderSidebar()}
          </div>

          {/* Right: Content Area */}
          <div className="flex-1 ml-4">{renderContent()}</div>
        </div>

        {/* Footer / News Section */}
        <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 text-sm leading-8 h-8 overflow-hidden rounded-b-md">
          News Section Here...
        </div>
      </div>

      {/* Style links in the dynamic HTML */}
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
