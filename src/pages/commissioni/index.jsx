import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function CommissioniPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(false);
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

  return (
    <>
      <div className="w-full bg-white rounded-lg relative px-4 pt-4 pb-10">
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
          {loading || data === null ? (
            <div className="w-full flex justify-center">
              <Loading />
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full font-medium">{data.name}</div>
              <div className="w-full space-y-2 mt-2">
                {data.docNodes
                  .filter((i) => i.docNodes && i.docNodes.length)
                  .map((item, key) => (
                    <div key={key} className="w-full">
                      <div className="w-full">{item.name}</div>
                      {item.docNodes
                        .filter((i) => i.docNodes && i.docNodes.length)
                        .map((subItem, subKey) => (
                          <div key={subKey} className="w-full p-2">
                            {/* Change bg-primary-950 to rgb(151, 0, 45) */}
                            <div
                              className="text-sm text-white px-2 rounded-md"
                              style={{ backgroundColor: "rgb(151, 0, 45)", padding: "6px" }}
                            >
                              {subItem.name}
                            </div>
                            {subItem.docNodes
                              .filter((i) => i.docContentStreamContent)
                              .map((subSubItem, subSubKey) => (
                                <div key={subSubKey} className="w-full mt-2">
                                  {/* Display Tag in Custom Color if it Exists */}
                                  {subSubItem.tag && (
                                    <div
                                      className="text-sm text-white px-3 rounded-md inline-block"
                                      style={{
                                        backgroundColor: "rgb(151, 0, 45)",
                                        padding: "4px",
                                      }}
                                    >
                                      {subSubItem.tag}
                                    </div>
                                  )}

                                  <div className="text-sm text-zinc-900 bg-gray-200 inline-block leading-6 px-3 rounded-md">
                                    {subSubItem.name}
                                  </div>

                                  {/* Wrap dynamic HTML inside a div with a custom class */}
                                  <div
                                    className="w-full px-2 rich-text-content"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        subSubItem.docContentStreamContent,
                                    }}
                                  ></div>

                                  {/* Display Button in Custom Color if it Exists */}
                                  {subSubItem.button && (
                                    <button
                                      className="w-full mt-2 p-2 text-white rounded-md"
                                      style={{ backgroundColor: "rgb(151, 0, 45)" }}
                                    >
                                      {subSubItem.button.text || "Click Me"}
                                    </button>
                                  )}
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 text-sm leading-8 h-8 overflow-hidden rounded-b-md">
          News Section Here...
        </div>
      </div>

      {/* Style the links inside dynamically inserted content */}
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
