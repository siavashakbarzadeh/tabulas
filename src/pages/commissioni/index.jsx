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
      <div className="w-full bg-white rounded-tl-none lg:rounded-tl-2xl rounded-tr-none lg:rounded-tr-2xl rounded-bl-2xl rounded-br-2xl relative px-4 pt-4 pb-13">
        <form className="w-full">
          <label className="w-full block relative before:w-px before:h-2/3 before:bg-neutral-300 before:absolute before:left-14 before:top-1/2 before:-translate-y-1/2">
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-6 h-6 select-none absolute left-4 top-1/2 -translate-y-1/2"
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
              <div className="w-full space-y-3 mt-2">
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
                              className="text-sm text-white leading-7 px-2"
                              style={{ backgroundColor: "rgb(151, 0, 45)" }}
                            >
                              {subItem.name}
                            </div>
                            {subItem.docNodes
                              .filter((i) => i.docContentStreamContent)
                              .map((subSubItem, subSubKey) => (
                                <div
                                  key={subSubKey}
                                  className="w-full space-y-2 mt-2"
                                >
                                  {/* Display Tag in Custom Color if it Exists */}
                                  {subSubItem.tag && (
                                    <div
                                      className="text-sm text-white px-3 rounded-full inline-block"
                                      style={{
                                        backgroundColor: "rgb(151, 0, 45)",
                                        padding: "5px",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      {subSubItem.tag}
                                    </div>
                                  )}

                                  <div className="text-sm text-zinc-900 bg-gray-200 inline-block leading-6 px-3 rounded-full">
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
        <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 line-clamp-1 leading-9 h-9 overflow-hidden rounded-bl-2xl rounded-br-2xl">
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
