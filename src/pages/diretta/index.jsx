import React, { useState } from "react";
import SearchIcon from "../../assets/svg/search.svg";

// Senato YouTube Live Channels
const CHANNELS = [
  { id: 1, name: "Senato 1", description: "Canale principale", youtubeId: "sPbVV3E737E" },
  { id: 2, name: "Senato 2", description: "Commissioni", youtubeId: "WyQMW1oJpOo" },
  { id: 3, name: "Senato 3", description: "Commissioni", youtubeId: "PjPRSf2oN4w" },
  { id: 4, name: "Senato 4", description: "Commissioni", youtubeId: "KQPgwlDN-1E" },
  { id: 5, name: "Senato 5", description: "Commissioni", youtubeId: "eIyBRC6dHoQ" },
  { id: 6, name: "Senato 6", description: "Commissioni", youtubeId: "loiN1npW2MM" },
  { id: 7, name: "Senato 7", description: "Commissioni", youtubeId: "c0hzsRTIbQk" },
  { id: 8, name: "Senato 8", description: "Commissioni", youtubeId: "vOR7zAjorO8" },
];

function DirettaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);

  const filteredChannels = CHANNELS.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      {/* Left Sidebar - Channel List */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 p-3 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Cerca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-gray-100 text-sm rounded-lg border-none pl-9 pr-3 focus:ring-1 focus:ring-[#97002D]"
          />
          <img src={SearchIcon} alt="" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        </div>

        {/* Channel List */}
        <div className="space-y-1">
          {filteredChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`w-full p-2 rounded-lg flex items-center gap-2 transition-all text-left ${
                selectedChannel.id === channel.id
                  ? "bg-[#97002D] text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                selectedChannel.id === channel.id ? "bg-white/20" : "bg-[#97002D]/10 text-[#97002D]"
              }`}>
                {channel.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{channel.name}</div>
                <div className={`text-xs truncate ${selectedChannel.id === channel.id ? "text-white/70" : "text-gray-400"}`}>
                  {channel.description}
                </div>
              </div>
              <span className={`text-[9px] px-1 rounded font-bold ${
                selectedChannel.id === channel.id ? "bg-red-500" : "bg-red-100 text-red-600"
              }`}>
                LIVE
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Video Player - Takes ALL remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video - fills available space */}
        <div className="flex-1 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${selectedChannel.youtubeId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>

        {/* Channel Info Bar */}
        <div className="h-16 flex items-center gap-3 px-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <div className="w-10 h-10 rounded-lg bg-[#97002D] flex items-center justify-center text-white font-bold">
            {selectedChannel.id}
          </div>
          <div>
            <div className="font-bold text-gray-900">{selectedChannel.name}</div>
            <div className="text-xs text-gray-500">{selectedChannel.description} - Senato della Repubblica</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirettaPage;
