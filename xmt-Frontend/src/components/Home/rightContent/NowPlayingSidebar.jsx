import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import noneAvatar from "../../../assets/static/users/default_image.svg";
import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { UserContext } from "@/context/userContext";
import { PlayerContext } from "@/context/musicContext";
import { parseLrc } from "@/utils/songUtils";
import { formatTimeProgress } from "@/utils/songUtils";

import { DialogCredits } from "./dialogCredits";
import { DialogQueue } from "./dialogQueue";

const NowPlayingSidebar = (props) => {
  const [showDialogCredits, setShowDialogCredits] = useState(false);
  const [dataCredits, setDataCredits] = useState({});

  const [showDialogQueue, setShowDialogQueue] = useState(false);
  const [dataQueue, setDataQueue] = useState({});
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
  const { queue, currentIndex, currentTime, playSongContext } =
    useContext(PlayerContext);

  const currentSong = queue[currentIndex];

  const lyrics = useMemo(() => {
    return parseLrc(currentSong?.lyrics);
  }, [currentSong]);

  //tra ve index
  const activeIndex = lyrics?.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];

    if (
      currentTime >= line.time &&
      (!nextLine || currentTime < nextLine.time)
    ) {
      return true;
    }
  });

  const lyricsRef = useRef([]);
  const lyricsContainerRef = useRef(null);

  useLayoutEffect(() => {
    const container = lyricsContainerRef.current;
    const activeLine = lyricsRef.current[activeIndex];

    if (!container || !activeLine) return;

    const lineTop = activeLine.offsetTop - container.offsetTop;

    const targetScrollTop =
      lineTop - container.clientHeight / 2 + activeLine.clientHeight / 2;

    container.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  }, [activeIndex]);

  useEffect(() => {
    const container = lyricsContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: "auto",
    });

    setDataCredits({
      owner: currentSong.owner.artistName,
      features: currentSong.features,
      createdAt: currentSong.createdAt,
    });
  }, [currentSong?.id]);

  useEffect(() => {
    setDataQueue({
      queue: queue.slice(currentIndex + 1),
      currentSong,
      nextSong,
    });
  }, [queue, currentIndex]);

  const nextIndex = (currentIndex + 1) % queue.length;
  const nextSong = queue[nextIndex];

  const handlePlaySong = (song, songs, playlist = null) => {
    playSongContext(song, songs, { type: "PlayInQue" });
  };

  return currentSong ? (
    <div className="flex flex-col gap-4 w-80 h-[calc(100%-30px)] bg-white/10 overflow-y-auto scrollbar-none rounded-xl">
      <div className="w-full backdrop-blur-md p-4 flex flex-col rounded-xl  gap-4 border border-white/20 ">
        {/* Header & Album Art */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-white/60">Now playing</div>
          <div className="aspect-square w-full bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/${currentSong.cover}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <div>
              <h3 className="font-bold text-white text-lg truncate">
                {currentSong.title}
              </h3>
              <p className="text-sm text-neutral-400 truncate">
                {currentSong.owner.artistName}
              </p>
            </div>
            {/* <span className="border border-white h-full" /> */}
            {actionPermission && (
              <div className="flex gap-2">
                <RxCross2
                  size={28}
                  className="hover:cursor-pointer hover:scale-122 transition"
                />
                <FaRegHeart
                  size={26}
                  className="hover:cursor-pointer hover:scale-122 transition"
                />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white/10 rounded-xl h-56 overflow-hidden w-full flex flex-col">
          <div className="border-b border-white/10 mx-5">
            <h1 className="font-bold text-white/70 pt-3 pb-1">Lyrics</h1>
          </div>
          <div
            className="flex-1 w-full overflow-y-auto scrollbar-none px-3 py-1 text-lg "
            ref={lyricsContainerRef}
          >
            {lyrics?.length > 0 ? (
              lyrics?.map((line, index) => (
                <p
                  key={index}
                  className={
                    index === activeIndex
                      ? "text-white font-bold bg-white/10 px-2 rounded-xl scale-105"
                      : "text-gray-500 m-0"
                  }
                  ref={(target) => {
                    lyricsRef.current[index] = target;
                  }}
                >
                  {line.text}
                </p>
              ))
            ) : (
              <p className="text-gray-500 m-0">This song doesn't has</p>
            )}
          </div>
        </div>
      </div>

      {/* about the artist */}
      <div className="w-full bg-neutral-800/50 rounded-xl overflow-hidden hover:bg-neutral-800 transition-colors flex-shrink-0">
        <div className="relative aspect-square w-full shadow-lg group">
          <img
            src={
              !currentSong.owner.avatar ? noneAvatar : currentSong.owner.avatar
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent" />

          <span className="absolute top-3 left-3 font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[15px] uppercase tracking-wider">
            About the artist
          </span>

          <div className="px-4 py-2">
            <h3 className="font-bold text-xl hover:underline cursor-pointer drop-shadow-md">
              {currentSong.owner.artistName}
            </h3>
            <p className="text-xs text-neutral-300 mt-0.5 drop-shadow">
              {currentSong.owner.monthlyListeners} Monthly Listeners
            </p>
            <p className="text-xs text-neutral-200 line-clamp-2 mt-1.5 leading-relaxed drop-shadow">
              {currentSong.owner.bio === null
                ? "No  bio yet"
                : currentSong.owner.bio}
            </p>
          </div>
        </div>
      </div>

      {/* credits */}
      <div className="px-3">
        <div className="flex justify-between">
          <h2 className="text-[18px] font-bold uppercase tracking-wider">
            Credits
          </h2>
          <button
            className="text-xs font-semibold bg-white/10 p-1 mb-1 rounded-lg cursor-pointer text-white/60 hover:text-white hover:underline"
            onClick={() => {
              setShowDialogCredits(true);
            }}
          >
            Open Credits
          </button>
        </div>

        <div className="space-y-1 text-sm bg-neutral-800/30 p-3 rounded-xl h-20 overflow-hidden overflow-y-scroll scrollbar-none">
          <div className="flex justify-between item-center">
            <span className="text-gray-400">Main Artist</span>
            <span className="font-medium">{currentSong.owner.artistName}</span>
          </div>
          {currentSong.features.length > 0 && (
            <div className="flex flex-col">
              {currentSong.features.map((feature) => (
                <div className="flex justify-between">
                  <span className="text-gray-400">Features</span>
                  <span className="font-medium text-gray-200">
                    {feature.artistName}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-400">Features</span>
                <span className="font-medium text-gray-200">zxc</span>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-400">Release Date</span>
            <span className="font-medium text-gray-200">
              {new Date(currentSong.createdAt).toLocaleDateString("vi-VN")}{" "}
            </span>
          </div>
        </div>
      </div>

      {/* queue */}
      <div className="px-3">
        <div className="flex justify-between items-center ">
          <h2 className="text-[18px] font-bold  tracking-wider">
            Next in queue
          </h2>
          <button
            className="text-xs font-semibold bg-white/10 p-1 rounded-lg cursor-pointer text-white/60 hover:text-white hover:underline"
            onClick={() => {
              setShowDialogQueue(true);
            }}
          >
            Open Queue
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-3 p-2">
            {nextSong && (
              <div
                className="flex items-center gap-3 rounded-lg hover:bg-neutral-800 group cursor-pointer transition-colors"
                onClick={() => {
                  handlePlaySong(nextSong, queue);
                }}
              >
                <div className="w-10 h-10  rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-bold">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${nextSong.cover}`}
                    alt="song cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate ">
                    {nextSong.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {nextSong.owner.artistName}
                  </p>
                </div>
                <span className="text-xs text-gray-500 pr-2">
                  {formatTimeProgress(nextSong.duration)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <DialogCredits
        show={showDialogCredits}
        setShow={setShowDialogCredits}
        dataCredits={dataCredits}
      />

      <DialogQueue
        show={showDialogQueue}
        setShow={setShowDialogQueue}
        dataQueue={dataQueue}
      />
    </div>
  ) : (
    <></>
  );
};

export default NowPlayingSidebar;
