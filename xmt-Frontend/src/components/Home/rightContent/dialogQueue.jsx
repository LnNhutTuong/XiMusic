import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useContext, useEffect } from "react";

import { formatTimeProgress } from "@/utils/songUtils";

import { PlayerContext } from "@/context/musicContext";

export const DialogQueue = (props) => {
  const { playSongContext } = useContext(PlayerContext);

  const handlePlaySong = (song, songs, playlist = null) => {
    playSongContext(song, songs, { type: "PlayInQue" });
  };

  const { show, setShow, dataQueue } = props;

  useEffect(() => {
    setShow(false);
  }, [dataQueue]);

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          setShow(false);
        } else {
          setShow(true);
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-lg h-122 bg-white/5"
      >
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-[18px] font-bold uppercase tracking-wider text-white p-3s ">
              Queue
            </h2>
          </DialogTitle>
          <DialogDescription className="h-full mt-3 bg-black rounded-xl">
            <div className="mb-4 p-3 rounded-lg bg-neutral-900">
              <div className="flex  flex-col gap-3 ">
                <h1 className="font-bold">Playing</h1>
                <div className="flex gap-3 px-2">
                  <div className="w-10 h-10  rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-bold bg-black flex">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/${dataQueue?.currentSong?.cover}`}
                      alt=""
                    />
                  </div>

                  <div>
                    <p className="font-medium">
                      {dataQueue?.currentSong?.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      {dataQueue?.currentSong?.owner.artistName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  flex-col gap-3 p-2">
              {dataQueue?.queue?.slice(0, 5).length > 0 ? (
                dataQueue.queue?.map((song) => (
                  <div
                    className="flex items-center gap-3 rounded-lg hover:bg-neutral-800 group cursor-pointer transition-colors"
                    onClick={() => {
                      handlePlaySong(song, dataQueue.queue);
                    }}
                  >
                    <div className="w-10 h-10  rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-bold">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${song.cover}`}
                        alt="song cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate ">
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {song.owner.artistName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 pr-2">
                      {formatTimeProgress(song.duration)}
                    </span>
                  </div>
                ))
              ) : (
                <h1 className="flex justify-center items-center text-white font-bold mx-auto">
                  No more Queues
                </h1>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
