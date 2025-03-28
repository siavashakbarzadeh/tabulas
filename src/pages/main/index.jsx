import React, { useEffect, useState, useRef } from "react";
import axios from "../../configs/axiosConfig.js";
import SearchIcon from "../../assets/svg/search.svg";
import PlayIcon from "../../icons/Play";
import NotificationIcon from "../../icons/Notification";
import { Link } from "react-router-dom";

function MainPage() {
  const playerRef = useRef(null);       // Will store the YT Player object
  const iframeRef = useRef(null);       // Ref to the <iframe> element
  const [isMuted, setIsMuted] = useState(true); // Tracks current mute state

  // Example function to toggle audio
  const handleToggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  useEffect(() => {
    // Dynamically load the YouTube IFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // The YouTube API will call window.onYouTubeIframeAPIReady when ready.
    // We'll define that callback so we can create the player.
    window.onYouTubeIframeAPIReady = () => {
      if (iframeRef.current) {
        // Create the player
        playerRef.current = new window.YT.Player(iframeRef.current, {
          // The iframe's 'id' must match what's in <iframe id="yt-iframe-embed" />
          // Then, "playerVars" config ensures:
          // - autoplay: starts playing automatically
          // - controls: 0 => hides native YT controls
          // - disablekb: disables keyboard events (can't pause with space)
          // - mute: start muted
          // - modestbranding, rel, showinfo => reduce branding
          // - fs => hide fullscreen button
          videoId: "sPbVV3E737E", // or parse from the URL
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            mute: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
          },
          events: {
            onReady: (event) => {
              // Ensure we start muted and playing
              event.target.mute();
              event.target.playVideo();
            },
          },
        });
      }
    };

    // Register push notifications
    async function registerPushNotifications() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered:", registration);

          if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            return;
          }
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            console.log("Notification permission denied");
            return;
          }

          // Check existing subscription; optionally unsubscribe to force new subscription
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            console.log("exists", existingSubscription);
          }

          function urlBase64ToUint8Array(base64String) {
            const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding)
              .replace(/-/g, "+")
              .replace(/_/g, "/");
            const rawData = window.atob(base64);
            return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
          }

          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              "BDHaWPVr-4KGYKxoavcU_w2TUq5XqCDQHQQdJj4nhBBp2dqTExCrr8f2vUCr5Enp-dGkCD4Omohgk8qRjHtszBs"
            ),
          };

          const subscription = await registration.pushManager.subscribe(subscribeOptions);
          console.log("User is subscribed:", subscription);

          // Send subscription to your backend
          await axios.post("/save-subscription", subscription);
        } catch (error) {
          console.error("Error during service worker registration or subscription", error);
        }
      } else {
        console.log("Push messaging is not supported in this browser.");
      }
    }

    registerPushNotifications();
  }, []);

  return (
    <>
      <div className="w-full bg-white rounded-tl-none lg:rounded-tl-2xl rounded-tr-none lg:rounded-tr-2xl rounded-bl-2xl rounded-br-2xl relative px-4 pt-4 pb-13">
        <div className="w-full flex-1 flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          <div className="w-full md:w-4/6">
            <form>
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
            <div className="w-full flex mt-8">
              <div className="py-3 px-6 bg-primary-900 text-white rounded-2xl leading-6">
                <div>Martedì 27 febbraio 2024</div>
                <div>alle ore 16,30</div>
                <div>163A Seduta Pubblica</div>
              </div>
            </div>
            <div className="w-full mt-8 space-y-4">
              <div className="w-full bg-neutral-200 rounded-2xl p-6 text-zinc-800 space-y-4 leading-7">
                <p>
                  <strong>I. Ratifiche di accordi internazionali (elenco allegato)</strong>
                </p>
                <p>
                  <strong>II. Discussione del disegno di legge:</strong>
                </p>
                <p>
                  Interventi a sostegno della competitività dei capitali ...
                  <span className="inline-block rounded-lg leading-7 text-white bg-primary-900 px-2 mx-1">
                    674-B
                  </span>
                </p>
              </div>
              {/* ... Other content ... */}
            </div>
          </div>

          <div className="w-full md:w-2/6">
            <Link className="w-full block">
              <div className="w-full aspect-video relative">
                <iframe
                  id="yt-iframe-embed"
                  src="https://www.youtube.com/embed/sPbVV3E737E?enablejsapi=1"
                  ref={iframeRef}
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
                <span className="text-primary-900 font-medium text-lg">In diretta</span>
                {/* Our custom Mute/Unmute button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleToggleMute}
                    className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-900"
                  >
                    {isMuted ? `<i class="fa-duotone fa-solid fa-volume-xmark"></i>` : `<i class="fa-duotone fa-solid fa-volume"></i>`}
                  </button>
                </div>
              </div>
            </Link>



            <div className="w-full mt-8 bg-zinc-200 p-4 rounded-2xl">
              <div className="flex items-center space-x-2">
                <NotificationIcon className="w-6 h-6" />
                <span className="text-primary-900 font-medium text-lg">Altre notizie</span>
              </div>
              <div className="w-full mt-4 text-zinc-800 space-y-2">
                <p>eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.</p>
                {/* ... Other notifications ... */}
              </div>
              <Link className="w-full h-12 flex items-center justify-center bg-zinc-800 text-white rounded-xl mt-4 transition-colors hover:bg-zinc-900">
                NOTIFICA
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 text-white bg-zinc-800 px-2 line-clamp-1 leading-9 h-9 overflow-hidden rounded-bl-2xl rounded-br-2xl">
          16.25 Scuola: Gilda, ministeri trovino soluzione per stipendi precari
          (z ANSA Politica) ~ ... ~ 16.30 Al via il Consiglio dei ministri (z ANSA Polit
        </div>
      </div>
    </>
  );
}

export default MainPage;
