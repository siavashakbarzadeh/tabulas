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
      <div className="w-full lg:w-64 bg-white lg:rounded-l-2xl p-4 border-b lg:border-b-0 lg:border-r border-gray-200 flex-shrink-0">
        {/* Search Bar */}
        <form className="w-full mb-4">
          <label className="w-full block relative before:w-px before:h-2/3 before:bg-neutral-300 before:absolute before:left-12 before:top-1/2 before:-translate-y-1/2">
            <input
              type="text"
              placeholder="Cerca canale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-neutral-100 text-sm rounded-xl border-none pl-14 ring-0 focus:ring-0 focus:border-none"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="w-4 h-4 select-none absolute left-4 top-1/2 -translate-y-1/2"
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
                {/* Channel number */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  selectedChannel.id === channel.id ? "bg-white/20 text-white" : "bg-[#97002D]/10 text-[#97002D]"
                }`}>
                  {channel.id}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{channel.name}</div>
                  <div className={`text-xs ${
                    selectedChannel.id === channel.id ? "text-white/70" : "text-gray-500"
                  }`}>
                    {channel.description}
                  </div>
                </div>
                {/* Live badge */}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
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
      <div className="flex-1 bg-white lg:rounded-r-2xl p-4 flex flex-col">
        {/* Video Container - Full width */}
        <div className="w-full flex-1 bg-black rounded-xl overflow-hidden shadow-xl">
          <iframe
            src={`https://www.youtube.com/embed/${selectedChannel.youtubeId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full min-h-[400px] lg:min-h-[500px]"
            allowFullScreen
          ></iframe>
        </div>

        {/* Channel Info */}
        <div className="mt-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#97002D] flex items-center justify-center text-white font-bold text-xl">
            {selectedChannel.id}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{selectedChannel.name}</h1>
            <p className="text-gray-500 text-sm">{selectedChannel.description} - Diretta Senato della Repubblica</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirettaPage;
