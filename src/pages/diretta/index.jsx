import React, { useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";

// Senato YouTube Live Channels
const CHANNELS = [
  {
    id: 1,
    name: "Senato 1",
    description: "Canale principale",
    youtubeId: "sPbVV3E737E",
  },
  {
    id: 2,
    name: "Senato 2",
    description: "Commissioni",
    youtubeId: "WyQMW1oJpOo",
  },
  {
    id: 3,
    name: "Senato 3",
    description: "Commissioni",
    youtubeId: "PjPRSf2oN4w",
  },
  {
    id: 4,
    name: "Senato 4",
    description: "Commissioni",
    youtubeId: "KQPgwlDN-1E",
  },
  {
    id: 5,
    name: "Senato 5",
    description: "Commissioni",
    youtubeId: "eIyBRC6dHoQ",
  },
  {
    id: 6,
    name: "Senato 6",
    description: "Commissioni",
    youtubeId: "loiN1npW2MM",
  },
  {
    id: 7,
    name: "Senato 7",
    description: "Commissioni",
    youtubeId: "c0hzsRTIbQk",
  },
  {
    id: 8,
    name: "Senato 8",
    description: "Commissioni",
    youtubeId: "vOR7zAjorO8",
  },
];

function DirettaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);

  // Filter channels based on search query
  const filteredChannels = CHANNELS.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar - Channel List */}
      <div className="w-full lg:w-72 bg-white lg:rounded-l-2xl p-4 border-b lg:border-b-0 lg:border-r border-gray-200">
        {/* Search Bar */}
        <form className="w-full mb-4">
          <label className="w-full block relative before:w-px before:h-2/3 before:bg-neutral-300 before:absolute before:left-14 before:top-1/2 before:-translate-y-1/2">
            <input
              type="text"
              placeholder="Cerca canale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-neutral-100 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-5 h-5 select-none absolute left-4 top-1/2 -translate-y-1/2"
            />
          </label>
        </form>

        {/* Channel List */}
        <div className="space-y-2">
          {filteredChannels.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Nessun canale trovato
            </p>
          ) : (
            filteredChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                  selectedChannel.id === channel.id
                    ? "bg-[#97002D] text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {/* Live indicator */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedChannel.id === channel.id ? "bg-white/20" : "bg-[#97002D]/10"
                }`}>
                  <i className={`fa-solid fa-play text-sm ${
                    selectedChannel.id === channel.id ? "text-white" : "text-[#97002D]"
                  }`}></i>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{channel.name}</div>
                  <div className={`text-xs ${
                    selectedChannel.id === channel.id ? "text-white/70" : "text-gray-500"
                  }`}>
                    {channel.description}
                  </div>
                </div>
                {/* Live badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  selectedChannel.id === channel.id 
                    ? "bg-red-500 text-white" 
                    : "bg-red-100 text-red-600"
                }`}>
                  LIVE
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Video Player */}
      <div className="flex-1 bg-white lg:rounded-r-2xl p-4 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Video Container */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full aspect-video relative">
              <iframe
                src={`https://www.youtube.com/embed/${selectedChannel.youtubeId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
              {/* Live badge */}
              <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 absolute left-4 top-4 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>
          </div>

          {/* Channel Info */}
          <div className="mt-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#97002D] flex items-center justify-center">
              <i className="fa-solid fa-play text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedChannel.name}</h1>
              <p className="text-gray-500">{selectedChannel.description} - Diretta Senato della Repubblica</p>
            </div>
          </div>

          {/* Quick Channel Switcher */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">ALTRI CANALI</h3>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.filter(c => c.id !== selectedChannel.id).map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#97002D] hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {channel.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirettaPage;
