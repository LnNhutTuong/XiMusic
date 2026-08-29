import { Swiper, SwiperSlide } from "swiper/react";
import { PlayerContext } from "@/context/musicContext";
import { useContext, useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { getAllSongsPublic } from "@/services/public/music/songService";

import { UserContext } from "@/context/userContext";

const HomeContent = (props) => {
  const { user } = useContext(UserContext);

  const [listSong, setListSong] = useState("");
  const [listSongHistories, setListSongHistories] = useState("");

  const test =

  const [job, setJob] = useState("");

  useEffect(() => {
    handleGetAllSongs();
  }, []);

  const handleGetAllSongs = async () => {
    let res = await getAllSongsPublic(1, 6);
    if (res?.EC === 0) {
      setListSong(res?.DT.rows);
    }
  };

  const { playSongContext } = useContext(PlayerContext);

  const handlePlaySong = (song, songs, playlist = null) => {
    playSongContext(song, songs, { type: "HOME" });
  };

  return (
    <div className="flex-1 h-[calc(100%-30px)] bg-white/10 rounded-xl overflow-y-auto space-y-4 scrollbar-none mb-3">
      {job && (
        <div className="h-56 rounded-xl overflow-hidden">
          <Swiper
            slidesPerView={1}
            autoplay={{ delay: 1000 }}
            loop={true}
            className="h-full"
          >
            <SwiperSlide>
              <div className="h-full flex items-center justify-center bg-red-500 ">
                Banner 1
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="h-full flex items-center justify-center bg-blue-500">
                Banner 2
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}

      <div className="rounded-xl  h-50 ">
        <div className="p-3 flex gap-1 text-sm">
          <Tabs
            defaultValue="all"
            className="w-full border rounded-xl border border-none "
          >
            <TabsList className="w-max flex gap-1 bg-transparent border border-none">
              <TabsTrigger
                className="border border-white rounded-xl px-3 text-white cursor-pointer"
                value="all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="border border-white rounded-xl px-3 text-white cursor-pointer"
                value="song"
              >
                Music
              </TabsTrigger>
              <TabsTrigger
                className="border border-white rounded-xl px-3 text-white cursor-pointer"
                value="podcast"
              >
                PodCast
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-3 gap-3 px-2">
                {listSong.length > 0 &&
                  listSong.map((song) => (
                    <div
                      className="flex items-center gap-3 p-2 border border-white/5 shrink-0 rounded-lg hover:bg-white/10 hover:cursor-pointer"
                      onClick={() => {
                        handlePlaySong(song, listSong);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${song.cover}`}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{song.title}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="song">
              <div className="grid grid-cols-3 gap-3 px-2">
                {listSong.length > 0 &&
                  listSong.map((song) => (
                    <div
                      className="flex items-center gap-3 p-2 border border-white/5 shrink-0 rounded-lg hover:bg-white/10 hover:cursor-pointer"
                      onClick={() => {
                        handlePlaySong(song, listSong);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${song.cover}`}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{song.title}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="podcast">
              <h1 className="flex justify-center item-center font-bold text-xl text-blue-400/90">
                chưa ai nói chuyện để làm podcast
              </h1>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="h-84  flex rounded-xl overflow-hidden">
        <div className=" flex-1 flex flex-col border-r border-dashed ">
          <h1 className="font-bold text-xl px-10 py-3 ">New Podcast</h1>
          <div className="flex-1 flex  gap-3 p-4 hover:bg-white/10 ">
            <div className="w-50 h-full bg-blue-900 rounded-md overflow-hidden">
              <img
                src="https://picsum.photos/60"
                className=" w-full h-full object-cover "
              />
            </div>

            <div className="w-73">
              <h1 className="text-xl font-medium">
                Nhân hơi sơ, ăn khô miệng.
              </h1>
              <h1 className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium ipsum quod atque sit obcaecati, voluptates illo
                fugiat beatae labore facere eveniet consequuntur excepturi hic
                dolorem voluptatem ullam qui tempore itaque!
              </h1>
              <div className="flex justify-end mt-6">
                <button className="border border-white rounded-xl px-3 ">
                  play it...
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex-1/22">
          <h1 className="font-bold text-xl px-10 py-3 text-white">New Album</h1>
          <div className="flex">
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user?.isAuthenticated && (
        <div className="h-84  flex flex-col rounded-xl overflow-hidden">
          <h1 className="font-bold text-xl px-10 py-3 ">Recents</h1>
          <div className="flex justify-center gap-2">
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
            <div className="px-3">
              <div className="flex flex-col gap-3 p-2 hover:bg-white/10 w-56 rounded-xl cursor-pointer transition-all duration-200">
                <div className="w-full aspect-square bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src="https://picsum.photos/300"
                    className="w-full h-full object-cover"
                    alt="Album cover"
                  />
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
                    Nhân hơi sơ, ăn khô miệng.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeContent;
