import { Triangle } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DialogCreateNewGenre from "./DialogCreateNewGenre";
import DialogGenreDetail from "./DialogGenreDetail";
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
  fetchAllGenre,
  getGenreWithId,
} from "../../../../../services/admin/music/genre/genreService";
import questionIcon from "@/assets/static/genre/question_icon.jpg";
import { toast } from "react-toastify";

const ManagerGenre = (props) => {
  const [listGenre, setListGenre] = useState([]);
  const [totalPage, setTotalPage] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page"), 10) || 1;
  const currentLimit = 12;

  // Refresh
  const [isRefresh, setIsRefresh] = useState(false);

  //Dialog Create Genre
  const [dataGenre, setDataGenre] = useState("");
  const [showDialogCreate, setShowDialogCreate] = useState(false);

  //Dialog Genre Detail
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
      value: "name_asc",
      label: "Name A-Z",
    },
    {
      value: "name_desc",
      label: "Name Z-A",
    },
    {
      value: "song_asc",
      label: "Song ASC",
    },
    {
      value: "song_desc",
      label: "Song DESC",
    },
  ];

  const handleRefresh = () => {
    setSort("newest");
    setKeySearch("");
    setIsRefresh(true);
    setTimeout(() => {
      setIsRefresh(false);
    }, 3000);
    getListGenre();
  };

  useEffect(() => {
    getListGenre();
  }, [currentPage, currentLimit, sort, keySearch]);

  const getListGenre = async () => {
    let res = await fetchAllGenre(currentPage, currentLimit, sort, keySearch);

    if (res?.EC === 0) {
      setListGenre(res.DT.genres);

      let totalGenre = +res.DT.count;

      let pageCount = Math.ceil(totalGenre / currentLimit);

      const pageArray = [];
      for (let i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }

      setTotalPage(pageArray);
    } else {
      setListGenre([]);
      setTotalPage([]);
      toast.error(res.EM);
    }
  };

  const handleGetGenreWithId = async (genreId) => {
    let res = await getGenreWithId(genreId);

    if (res?.EC === 0) {
      setDataGenre(res.DT);
    }
  };

  return (
    <>
      <>
        <div className="list-genre-container mx-10 my-5">
          <h1 className="text-xl font-bold">List Genres</h1>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDialogCreate(true)}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50"
              >
                Add new genre
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
                    placeholder="Name genre..."
                    className="h-10 w-full rounded-lg border border-border bg-background pl-4 pr-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    onChange={(e) => setKeySearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto bg-neutral-1primary-soft shadow-xs rounded-base  h-[522px] border border-white/10 rounded-xl mt-3 scrollbar-none">
            {!isRefresh ? (
              listGenre.length > 0 ? (
                <div className="grid grid-cols-8 gap-4 mx-auto items-center px-24 mt-10">
                  {listGenre.map((genre) => (
                    <div
                      className="col-span-2 flex h-30 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm 
                    duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl transition border border-white"
                    >
                      <img
                        src={
                          genre.icon
                            ? `${import.meta.env.VITE_BACKEND_URL}/${genre.icon}`
                            : questionIcon
                        }
                        alt=""
                        className="h-full w-30 object-cover"
                      />
                      <span className="border mx-3 my-3" />
                      <div className="flex flex-1 flex-col pe-2 py-3 ">
                        <div className="flex justify-between border-b">
                          <h3 className="text-lg font-bold ">
                            {genre.name.toUpperCase()}
                          </h3>
                          <button
                            className="px-2 rounded-xl mb-2 text-white/60 hover:text-white hover:cursor-pointer"
                            onClick={async () => {
                              setShowDialogDetail(true);
                              await handleGetGenreWithId(genre.id);
                            }}
                          >
                            View
                          </button>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-white/80 overflow-hidden">
                          {genre.description}
                        </p>
                        <p className="mt-auto pt-3 text-xs text-white/60">
                          Song count:{" "}
                          <span className="text-white font-bold">
                            {genre.songCount}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="flex justify-center items-center font-bold text-red-600 h-full text-3xl">
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

      <DialogCreateNewGenre
        show={showDialogCreate}
        setShow={setShowDialogCreate}
        fetchAllGenre={getListGenre}
      />
      <DialogGenreDetail
        show={showDialogDetail}
        setShow={setShowDialogDetail}
        dataGenre={dataGenre}
        fetchAllGenre={getListGenre}
      />
    </>
  );
};

export default ManagerGenre;
