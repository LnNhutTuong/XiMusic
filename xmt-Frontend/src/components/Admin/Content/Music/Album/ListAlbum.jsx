import { useState, useEffect } from "react";
import { Triangle } from "react-loader-spinner";
import questionIcon from "@/assets/static/genre/question_icon.jpg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  getListAlbum,
  getAlbumWithId,
} from "../../../../../services/admin/music/album/albumService";

import DialogCreateNewAlbum from "./DialogCreateNewAlbum";

import DialogDetailAlbum from "./DialogDetailAlbum";

import { toast } from "react-toastify";

const ManagerSong = (props) => {
  const [listAlbum, setListAlbum] = useState([]);

  const [isRefresh, setIsRefresh] = useState(false);

  const [showDialogCreate, setShowDialogCreate] = useState(false);

  const [albumData, setAlbumData] = useState("");
  const [showDialogDetail, setShowDialogDetail] = useState(false);

  const [keySearch, setKeySearch] = useState("");

  const [sort, setSort] = useState("newest"); //mac dinh luc nao cung phai show moi

  const sortOptions = [
    {
      value: "newest",
      label: "Newest",
    },
    {
      value: "oldest",
      label: "Oldest",
    },
    {
      value: "title_asc",
      label: "Title A-Z",
    },
    {
      value: "title_desc",
      label: "Title Z-A",
    },
    {
      value: "song_asc",
      label: "Song ASC",
    },
    {
      value: "song_desc",
      label: "Song DESC",
    },
    { value: "releaseDate_desc", label: "Release date DESC" },
    { value: "releaseDate_asc", label: "Release date ASC" },
  ];
  useEffect(() => {
    handleGetListAlbum();
  }, [sort, keySearch]);

  const handleGetListAlbum = async () => {
    let res = await getListAlbum(sort, keySearch);
    if (res?.EC === 0) {
      setListAlbum(res.DT.albums);
    } else {
      setListAlbum([]);

      toast.error(res.EM);
    }
  };

  const handleRefresh = () => {
    setIsRefresh(true);
    setKeySearch("");
    setSort("newest");
    setTimeout(() => {
      setIsRefresh(false);
    }, 3000);
  };

  const handleGetAlbumWithId = async (albumId) => {
    let res = await getAlbumWithId(albumId);
    if (res?.EC === 0) {
      setAlbumData(res.DT);
      setShowDialogDetail(true);
    } else {
      toast.error("Something went wrong when get SONG ID");
    }
  };

  return (
    <>
      <>
        <div className="list-genre-container mx-10 my-5">
          <h1 className="text-xl font-bold">List Album</h1>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDialogCreate(true)}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50"
              >
                Add new album
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-lime-800 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-lime-700 active:bg-lime-900 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            <div className="flex items-end gap-4">
              {/* Sort */}
              <Field className="flex-1">
                <FieldLabel>Sort by</FieldLabel>
                <Select value={sort} item={sortOptions} onValueChange={setSort}>
                  <SelectTrigger className="h-10 w-[180px]">
                    <SelectValue placeholder="--- None ---" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">--- None ---</SelectItem>
                      {sortOptions.map((sort) => (
                        <SelectItem key={sort.value} value={sort.value}>
                          {sort.label}
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
                    placeholder="Title album or artist..."
                    className="h-10 w-full rounded-lg border border-border bg-background pl-4 pr-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    onChange={(e) => setKeySearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto bg-neutral-1primary-soft shadow-xs rounded-base h-[522px] border border-white/10 rounded-xl mt-3 scrollbar-none">
            {!isRefresh ? (
              listAlbum.length > 0 ? (
                <div className="grid grid-cols-6 gap-70 mx-auto items-center px-10 mt-10">
                  {listAlbum.map((album) => {
                    return (
                      <div
                        className={`${
                          album.releaseDate !== null &&
                          new Date(album.releaseDate) <= new Date()
                            ? "border-green-700 hover:shadow-green-500/22 hover:shadow-xl"
                            : "border-red-700 hover:shadow-red-500/22 hover:shadow-xl"
                        } w-64 aspect-square overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-sm transition duration-300 
                        hover:-translate-y-1  hover:bg-white/10 hover:shadow-xl group`}
                      >
                        {/* Thumbnail */}
                        <div
                          className="relative w-45 h-45 mx-auto mt-3 cursor-pointer "
                          onClick={() => handleGetAlbumWithId(album.id)}
                        >
                          <div className="absolute inset-0 translate-x-7 rounded-full bg-zinc-900 z-0 flex items-center justify-center transition-transform group-hover:animate-[spin_6s_linear_infinite]">
                            <svg viewBox="0 0 300 300" className="w-72 h-72">
                              <defs>
                                <path
                                  id="text-circle"
                                  d="M150,150
                                  m-120,0
                                  a120,120 0 1,1 240,0
                                  a120,120 0 1,1 -240,0
                                "
                                />
                              </defs>

                              <text className="tracking-[4px] uppercase fill-white">
                                <textPath href="#text-circle" startOffset="0%">
                                  {`${album.songCount} SONG • `.repeat(8)}
                                </textPath>
                              </text>
                            </svg>
                          </div>

                          <div className="absolute inset-0 rounded-sm overflow-hidden z-10 bg-red-900">
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL}/${album.cover}`}
                              alt="album cover"
                              className="w-full h-full object-cover "
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold text-white">
                                {album.title}
                              </h3>

                              <p className="truncate text-sm text-white/60">
                                {album.artistName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

      <DialogCreateNewAlbum
        show={showDialogCreate}
        setShow={setShowDialogCreate}
        fetchAllAlbum={handleGetListAlbum}
      />
      <DialogDetailAlbum
        show={showDialogDetail}
        setShow={setShowDialogDetail}
        albumData={albumData}
        fetchAllAlbum={handleGetListAlbum}
      />
    </>
  );
};

export default ManagerSong;
