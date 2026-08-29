import { useState, useEffect } from "react";
import { Triangle } from "react-loader-spinner";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import questionIcon from "@/assets/static/genre/question_icon.jpg";

import {
  getAllSongs,
  getSongWithId,
} from "../../../../../services/admin/music/song/songService";

import DialogCreateNewSong from "./DialogCreateNewSong";
import DialogDetailSong from "./DialogDetailSong";

import { toSelectOptions, toArtistOptions } from "@/utils/selectOption";
import { getGenreOption } from "@/services/admin/music/genre/genreService";

const ManagerSong = (props) => {
  const [listSong, setListSong] = useState("");
  const [totalPage, setTotalPage] = useState([]);
  const [isRefresh, setIsRefresh] = useState("");

  const [showDialogCreate, setShowDialogCreate] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page"), 10) || 1;
  const currentLimit = 7;

  const [songData, setSongData] = useState("");
  const [showDialogDetail, setShowDialogDetail] = useState(false);

  const [dataGenreOption, setDataGenreOption] = useState([]);
  const [genreId, setGenreId] = useState("");

  const [keySearch, setKeySearch] = useState("");

  useEffect(() => {
    handelGetDataGenreOption();
  }, []);

  useEffect(() => {
    getListSongs();
  }, [currentPage, currentLimit, genreId, keySearch]);

  const getListSongs = async () => {
    let res = await getAllSongs(currentPage, currentLimit, genreId, keySearch);

    if (res?.EC === 0) {
      setListSong(res.DT.rows);

      let totalSongs = +res.DT.count;

      let pageCount = Math.ceil(totalSongs / currentLimit);

      const pageArray = [];
      for (let i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }

      setTotalPage(pageArray);
    } else {
      setListSong([]);
      setTotalPage([]);
      toast.error(res.EM);
    }
  };

  const handleRefresh = () => {
    setGenreId("");
    setKeySearch("");
    setIsRefresh(true);
    setTimeout(() => {
      setIsRefresh(false);
    }, 3000);
  };

  const handleGetSongWithId = async (songId) => {
    let res = await getSongWithId(songId);
    if (res?.EC === 0) {
      setSongData(res.DT);
      setShowDialogDetail(true);
    } else {
      toast.error(res.EM);
    }
  };

  const handelGetDataGenreOption = async () => {
    let res = await getGenreOption();
    if (res?.EC === 0) {
      setDataGenreOption(res.DT.rows);
    }
  };

  return (
    <>
      <>
        <div className="list-genre-container mx-10 my-5">
          <h1 className="text-xl font-bold">List Song</h1>
          <div className="flex flex-wrap items-end justify-between gap-6">
            {/* Left Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDialogCreate(true)}
                className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Add new song
              </button>

              <button
                onClick={handleRefresh}
                className="rounded-lg bg-lime-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lime-600"
              >
                Refresh
              </button>
            </div>

            {/* Right Filters */}
            <div className="flex items-end gap-4">
              {/* Genre */}
              <Field className="flex-1">
                <FieldLabel>Genre</FieldLabel>

                <Select
                  value={genreId}
                  item={dataGenreOption}
                  onValueChange={setGenreId}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="--- None ---" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">--- None ---</SelectItem>
                      {dataGenreOption.map((genre) => (
                        <SelectItem key={genre.id} value={String(genre.id)}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Search */}
              <div className="w-[320px]">
                <FieldLabel>Search</FieldLabel>

                <div className="relative">
                  <input
                    value={keySearch}
                    type="search"
                    placeholder="Nguoi trong tim..."
                    className="h-10 w-full rounded-lg border border-border bg-background pl-4 pr-20 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    onChange={(e) => {
                      setKeySearch(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto bg-neutral-1primary-soft shadow-xs rounded-base  h-[522px] border border-white/10 rounded-xl mt-3 scrollbar-none">
            {!isRefresh ? (
              listSong.length > 0 ? (
                <div className="grid grid-cols-6 gap-4 mx-auto items-center px-24 mt-10">
                  {listSong.map((song) => (
                    <div className="w-50 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl">
                      {/* Thumbnail */}
                      <div
                        className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mt-3 cursor-pointer"
                        onClick={() => handleGetSongWithId(song.id)}
                      >
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/${song.cover}`}
                          alt="Song thumbnail"
                          className="w-full h-full object-cover transition-transform duration-300 hover:-rotate-360"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-white">
                              {song.title}
                            </h3>

                            <p className="mt-1 truncate text-sm text-white/60">
                              {song.artistId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="flex justify-center items-center font-bold text-white/80 backdrop-blur-xl h-full text-3xl">
                    Not found anything here bb ♥...
                  </p>
                </>
              )
            ) : (
              <div className="flex flex-col justify-center items-center h-full rounded-xl border border-lime-600">
                <Triangle
                  visible={true}
                  height="220"
                  width="220"
                  color="#ffffff"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
                <span className="text-xl font-bold">Waiting -_-</span>
              </div>
            )}
          </div>

          <div className=" mt-5 flex justify-end items-center">
            <div className="border border-white/20 rounded-2xl w-fit px-5 py-3 text-center">
              <span className="font-bold ">Date & Time</span> <br />
              26/08/2005 | 11:00 PM
            </div>
          </div>
        </div>
      </>
      <DialogCreateNewSong
        show={showDialogCreate}
        setShow={setShowDialogCreate}
        fetchListSong={getListSongs}
      />
      <DialogDetailSong
        show={showDialogDetail}
        setShow={setShowDialogDetail}
        songData={songData}
        fetchListSong={getListSongs}
      />
    </>
  );
};

export default ManagerSong;
