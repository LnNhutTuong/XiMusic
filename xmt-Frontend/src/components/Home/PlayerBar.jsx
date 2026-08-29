import { FaPlus } from "react-icons/fa";
import { FaRandom, FaVolumeMute, FaVolumeDown } from "react-icons/fa";
import {
  GiFastBackwardButton,
  GiFastForwardButton,
  GiPlayButton,
  GiPauseButton,
} from "react-icons/gi";
import { FaVolumeHigh } from "react-icons/fa6";
import { PiRepeatBold, PiRepeatOnceBold } from "react-icons/pi";

import { useContext, useEffect, useState, useRef } from "react";

import { formatTimeProgress } from "@/utils/songUtils";

import { incrementPlays } from "@/services/public/music/songService";

import { UserContext } from "@/context/userContext";
import { PlayerContext } from "@/context/musicContext";

const PlayerBar = () => {
  //==================================================USER++++++++++++==========================================
  const { user } = useContext(UserContext);

  const [actionPermission, setActionPermission] = useState(false);

  useEffect(() => {
    if (user?.isAuthenticated) {
      setActionPermission(true);
    } else {
      setActionPermission(false);
    }
  }, [user]);

  //==================================================SONG++++++++++++==========================================
  const {
    queue,

    currentIndex,

    isPlaying,
    setIsPlaying,

    volume,
    setVolume,
    lastVolume,
    setLastVolume,

    audioRef,

    currentTime,
    setCurrentTime,

    duration,
    setDuration,

    repeatMode,

    shuffleMode,

    togglePlayPause,

    handleNextSong,
    handlePrevSong,
    handleRepeat,
    handleShuffle,

    handleMuteVolume,
  } = useContext(PlayerContext);

  //====================Play random============

  // const handlePlayRandom = () => {
  //   playRandomSong();
  // };

  //========RUN AUDIO==========
  const currentSong = queue[currentIndex];

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    lastTime.current = 0;
    listened.current = 0;
    counted.current = false;
    setIsPlaying(true);
    audioRef.current.play();
    document.title = `XiMusic | ${currentSong.title}`;
  }, [currentSong]);

  const handleKeyDown = (e) => {
    if (e.code !== "Space") return;

    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable
    ) {
      return;
    }

    e.preventDefault();
    togglePlayPause();
  };

  const lastTime = useRef(0);
  const listened = useRef(0);
  const counted = useRef(false);

  const handleIncrementPlays = async (songId) => {
    let current = audioRef.current.currentTime;

    let diff = current - lastTime.current;

    if (diff > 0 && diff < 2) {
      listened.current += diff;
    }

    lastTime.current = current;

    if (!counted.current && listened.current >= 44) {
      counted.current = true;
      await incrementPlays(songId);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSong]);

  //+++++====VOlume======
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
  }, [volume]);

  const handleVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left;

    //gioi han nam trong cai progress
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);

    setVolume(percent);
  };

  //========Format time lai==========
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  //=================ANh Tua=======
  const handSeek = (e) => {
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left;

    //gioi han nam trong cai progress
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);

    audioRef.current.currentTime = percent * duration;

    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return currentSong ? (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 flex items-center justify-between px-5 text-white z-50 select-none border-t border-white/20">
      <div className="flex items-center w-1/3 min-w-[180px]">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${currentSong.cover}`}
          alt="Cover"
          className="w-14 h-14 rounded object-cover mr-3 bg-gray-800"
        />
        <div className="overflow-hidden">
          <div className="text-sm font-semibold truncate hover:underline cursor-pointer">
            {currentSong.title}
          </div>
          <div className="text-xs text-gray-400 truncate hover:underline hover:text-white cursor-pointer">
            {currentSong.owner.artistName}
          </div>
        </div>
        <div className="text-sm px-2">
          {actionPermission && (
            <button className="p-2 rounded-2xl bg-white/20 text-white/60 hover:text-white">
              <FaPlus />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center w-1/3 max-w-[600px]">
        <div className="flex items-center gap-5 mb-1.5">
          <button
            className={`text-gray-400 transition ${
              actionPermission
                ? "hover:text-white hover:cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => {
              handleShuffle(currentSong);
            }}
            disabled={!actionPermission}
          >
            {shuffleMode ? (
              <FaRandom className="text-white" />
            ) : (
              <FaRandom className="text-gray-400 hover:text-white transition" />
            )}
          </button>
          <button
            className="text-gray-400 hover:text-white text-xl transition hover:cursor-pointer"
            onClick={handlePrevSong}
          >
            <GiFastBackwardButton />
          </button>
          <button
            className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-lg hover:scale-105 transition font-bold"
            onClick={() => {
              togglePlayPause();
            }}
          >
            {isPlaying ? <GiPauseButton /> : <GiPlayButton />}
          </button>
          <button
            className="text-gray-400 hover:text-white text-lg transition hover:cursor-pointer"
            onClick={handleNextSong}
          >
            <GiFastForwardButton />
          </button>
          <button
            className={`text-gray-400 transition ${
              actionPermission
                ? "hover:text-white hover:cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            disabled={!actionPermission}
            onClick={handleRepeat}
          >
            {(() => {
              switch (repeatMode) {
                case "off":
                  return (
                    <PiRepeatBold className="text-gray-400 hover:text-white transition" />
                  );
                case "all":
                  return <PiRepeatBold className="text-white" />;
                case "one":
                  return <PiRepeatOnceBold className="text-white" />;
                default:
                  return <PiRepeatBold />;
              }
            })()}
          </button>
        </div>

        <div className="flex items-center w-full gap-2 text-[11px] text-gray-400">
          <audio
            // key={currentSong?.id}
            ref={audioRef}
            src={
              currentSong
                ? `${import.meta.env.VITE_BACKEND_URL}/${currentSong.audioUrl}`
                : ""
            }
            onEnded={handleNextSong}
            onTimeUpdate={() => {
              setCurrentTime(audioRef.current.currentTime);
              handleIncrementPlays(currentSong.id);
            }}
            onLoadedMetadata={() => {
              setDuration(audioRef.current.duration);
            }}
          />
          <span>{formatTimeProgress(currentTime)}</span>
          <div
            className="flex-grow group relative py-2 cursor-pointer"
            onClick={handSeek}
          >
            <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full hidden group-hover:block"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span>{formatTimeProgress(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end w-1/3 gap-3">
        <button
          className="text-xl text-gray-400 hover:text-white text-base transition hover:cursor-pointer "
          onClick={handleMuteVolume}
        >
          {volume === 0 ? (
            <FaVolumeMute />
          ) : volume < 0.5 ? (
            <FaVolumeDown />
          ) : (
            <FaVolumeHigh />
          )}
        </button>
        {/* <button className="text-xl text-gray-400 hover:text-white text-base transition">
          <FaVolumeMute />
        </button> */}

        {/* Thanh âm lượng */}
        <div
          className="w-24 group relative py-2 cursor-pointer"
          onClick={handleVolume}
        >
          <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white group-hover:bg-[#1db954]"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full hidden group-hover:block"
            style={{ left: `${volume * 100}%` }}
          />
        </div>
        {/* <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        /> */}
      </div>
    </div>
  ) : (
    <>
      <title>XiMusic</title>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 flex flex-col justify-center items-center  px-5 text-white z-50 select-none border-t border-white/20">
        <p>You want a random song?</p>
        <button className="border rounded-2xl px-3 py-1 cursor-pointer text-white/60 hover:text-white hover:cursor-pointer">
          Play it
        </button>
      </div>
    </>
  );
};

export default PlayerBar;
