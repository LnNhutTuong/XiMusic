import { createContext, useEffect, useRef, useState } from "react";
import { buildQueue } from "@/utils/songUtils";
import { shuffleArray } from "@/utils/songUtils";
const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  // const [currentSong, setCurrentSong] = useState(null);

  const [queue, setQueue] = useState([]);

  const [playlist, setPlaylist] = useState([]);

  const [playlistInfo, setPlaylistInfo] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);

  const [repeatMode, setRepeatMode] = useState("off");

  const [shuffleMode, setShuffleMode] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  //=============mid toggle==============
  const playSongContext = (song, songs, playlist = null) => {
    if (queue[currentIndex]?.id === song.id) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    //lam cai hang doi
    const result = buildQueue(song, songs, playlist);

    setQueue(result.queue);
    setCurrentIndex(result.currentIndex);

    //nhung bai nhac tiep theo
    setPlaylist(songs);

    //neu la cai list thi se co thong tin cua cai list do
    setPlaylistInfo(playlist);

    //dang phat'
    setIsPlaying(true);
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRepeat = () => {
    let nextModeRepeat;

    if (repeatMode === "off") {
      nextModeRepeat = "all";
    } else if (repeatMode === "all") {
      nextModeRepeat = "one";
    } else {
      nextModeRepeat = "off";
    }

    setRepeatMode(nextModeRepeat);
  };

  const handleShuffle = (currentSong) => {
    if (!shuffleMode) {
      let current = currentSong;
      //lay tat ca tru current
      const remain = queue.filter((song) => song.id !== current.id);

      const shuffled = shuffleArray(remain);

      const newQueue = [current, ...shuffled];

      setQueue(newQueue);
      setCurrentIndex(0);
      setShuffleMode(true);
    } else {
      //lay
      const index = playlist.findIndex((song) => song.id === currentSong.id);
      setQueue(playlist);
      setCurrentIndex(index);
      setShuffleMode(false);
    }
  };

  const handleNextSong = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (currentIndex === queue.length - 1) {
      if (repeatMode === "all") {
        setCurrentIndex(0);
      } else {
        setIsPlaying(false);
        audioRef.current.pause();
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevSong = async () => {
    if (currentIndex < 0) {
      return;
    }

    setCurrentIndex((currentIndex) => currentIndex - 1);
  };

  //=============left toggle==============
  const handleMuteVolume = () => {
    if (volume === 0) {
      setVolume(lastVolume);
    } else {
      setLastVolume(volume);
      setVolume(0);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        setQueue,

        playlist,
        setPlaylist,

        playlistInfo,
        setPlaylistInfo,

        currentIndex,
        setCurrentIndex,

        isPlaying,
        setIsPlaying,

        volume,
        setVolume,

        repeatMode,
        setRepeatMode,

        shuffleMode,
        setShuffleMode,

        currentTime,
        setCurrentTime,

        duration,
        setDuration,

        audioRef,

        playSongContext,

        togglePlayPause,

        handleNextSong,
        handlePrevSong,
        handleRepeat,
        handleShuffle,

        handleMuteVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };
