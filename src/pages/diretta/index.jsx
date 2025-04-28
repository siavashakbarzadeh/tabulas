import React from "react";
import SearchIcon from "../../assets/svg/search.svg";
import PlayIcon from "../../icons/Play";

function DirettaPage() {
    return (
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
            <div className="flex flex-col min-h-screen w-full">
                {/* Main white container */}
                <div className="flex-1 bg-white rounded-2xl relative p-4">
                    {/* Full-width Search Bar */}
                    <form className="w-full mb-4">
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

                    {/* Centered container for the live video */}
                    <div className="flex w-full">
                        <div className="p-4 flex-1 flex justify-center items-start">
                            {/* Increased width on mobile devices */}
                            <div className="gap-4 w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg">
                                <div className="w-full block">
                                    <div className="w-full aspect-video relative">
                                        <iframe
                                            src="https://www.youtube.com/embed/sPbVV3E737E"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            className="w-full h-full object-contain"
                                        ></iframe>
                                        <span className="bg-primary-900 text-white leading-6 px-2 absolute left-2 top-2">
                                            Live
                                        </span>
                                    </div>
                                    <div className="w-full flex items-center space-x-2 p-3 bg-zinc-200 rounded-bl-2xl rounded-br-2xl">
                                        <PlayIcon className="w-6 h-6" />
                                        <span className="text-primary-900 font-medium text-lg">
                                            In diretta
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DirettaPage;
