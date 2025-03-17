import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";
import CommissioniNestedMenu from "./CommissioniNestedMenu";
import CommissioniContent from "./CommissioniContent";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
      // Optionally auto-select the first docNode if you like:
      // if (!activeNode && data.docNodes?.length) {
      //   setActiveNode(data.docNodes[0]);
      // }
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

  const handleSelectNode = (node) => {
    setActiveNode(node);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center mt-10">
        <div>No data available</div>
      </div>
    );
  }

  return (
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
        {/* Left Column: Nested Menu (Inner Sidebar) */}
        <div className="w-64 mr-4 bg-gray-100 p-3 rounded-md">
          <div className="font-semibold text-gray-700 mb-2">
            {data.name || "Commissioni"}
          </div>
          <CommissioniNestedMenu
            docNodes={data.docNodes || []}
            onSelect={handleSelectNode}
            activeNode={activeNode}
          />
        </div>

        {/* Right Column: Content */}
        <div className="flex-1">
          <CommissioniContent node={activeNode} />
        </div>
      </div>

      {/* Footer or "News Section" */}
      <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 text-sm leading-8 h-8 overflow-hidden rounded-b-md">
        News Section Here...
      </div>

      {/* Style links in dynamically inserted HTML */}
      <style>
        {`
          .rich-text-content a {
            color: rgb(151, 0, 45) !important;
            font-weight: bold;
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
}

export default CommissioniPage;
