import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import ReactSelect from "react-select";
import questionIcon from "@/assets/static/genre/question_icon.jpg";
import { toSelectOptions, toArtistOptions } from "@/utils/selectOption";

import { getArtistOption } from "@/services/admin/artist/artistService";

import { getAlbumOptionWithIdOrNot } from "@/services/admin/music/album/albumService";

import { getGenreOption } from "@/services/admin/music/genre/genreService";

import {
  songUpdate,
  deleteSong,
} from "@/services/admin/music/song/songService";

const DialogDetailSong = (props) => {
  const { show, setShow, songData, fetchListSong } = props;

  const [isEdit, setIsEdit] = useState(false);

  const [title, setTitle] = useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [newAudioUrl, setNewAudioUrl] = useState(null);

  const [cover, setCover] = useState("");
  const [newCover, setNewCover] = useState(null);
  const [previewCover, setPreviewCover] = useState("");

  const [duration, setDuration] = useState(0);

  const [lyrics, setLyrics] = useState("");

  const [status, setStatus] = useState(0);
  const statusOptions = [
    { value: 0, label: "Draft" },
    { value: 1, label: "Published" },
    { value: 2, label: "Private" },
  ];

  const [ownerId, setOwnerId] = useState("");
  const [featureId, setFeatureId] = useState([]);

  const [genreId, setGenreId] = useState([]);
  const [albumId, setAlbumId] = useState("");

  const [audioFileName, setAudioFileName] = useState("");
  const [audioFileCover, setAudioFileCover] = useState("");

  const [listArtistOption, setListArtistOption] = useState([]);
  const [listGenreOption, setListGenreOption] = useState([]);
  const [listAlbumOptionWithId, setListAlbumOptionWithId] = useState([]);

  const [songDelete, setSongDelete] = useState(null);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    handleSetSongData();
  }, [songData]);

  const handleSetSongData = () => {
    if (!songData) return;

    if (songData) {
      setTitle(songData.title);
      setAudioUrl(songData.audioUrl);
      setCover(songData.cover);

      if (songData.cover) {
        setAudioFileCover(songData.cover);
        setAudioFileName(songData.audioUrl.split("/").pop());
      }

      setDuration(songData.duration);

      setLyrics(songData.lyrics);
      setStatus(songData.status);
      setOwnerId(songData.ownerId);
      setFeatureId(toArtistOptions(songData.features));

      //phai chuyen ve dang nay de hien thị
      setGenreId(toSelectOptions(songData.genres));

      setAlbumId(songData.albumId || "");
    }
  };

  useEffect(() => {
    getListArtistOption();
    getListGenreOption();
  }, []);

  useEffect(() => {
    if (!ownerId) {
      setListAlbumOptionWithId([]);
      return;
    }
    getAlbumOption(ownerId);
  }, [ownerId]);

  const getListArtistOption = async () => {
    let res = await getArtistOption();
    if (res?.EC === 0) {
      setListArtistOption(res.DT.rows);
    }
  };

  const artistOptions = toArtistOptions(listArtistOption);

  const ownerOptions = artistOptions.filter(
    (artist) => !featureId.some((feature) => feature.value === artist.value),
  );
  const featureOptions = artistOptions.filter(
    (artist) => artist.value !== Number(ownerId),
  );

  const getAlbumOption = async (id) => {
    if (!id) {
      setListAlbumOptionWithId([]);
      return;
    }

    const res = await getAlbumOptionWithIdOrNot(id);
    if (res?.EC === 0) {
      setListAlbumOptionWithId(res.DT.rows);
    }
  };

  const getAlbumName = (albumId) => {
    let album = listAlbumOptionWithId.find((item) => item.id === albumId);

    return album?.title;
  };

  const getListGenreOption = async () => {
    let res = await getGenreOption();
    if (res?.EC === 0) {
      setListGenreOption(res.DT.rows);
    }
  };

  const GenreOption = toSelectOptions(listGenreOption);

  const handleCLoseDialog = () => {
    setShow(false);
    setIsEdit(false);
    setTitle("");
    setAudioUrl("");

    setCover("");
    setPreviewCover("");

    setAudioFileName("");
    setDuration("");
    setLyrics("");

    setStatus(0);

    setOwnerId("");
    setFeatureId([]);

    setGenreId([]);
    setAlbumId("");

    setErrors([]);
  };

  const handleUploadLRC = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const text = target.result;

      const lyrics = text
        .split("\n")
        .filter((line) => /^\[\d{2}:\d{2}/.test(line))
        .join("\n");

      setLyrics(lyrics);
    };

    reader.readAsText(file, "utf-8");
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUploadAudio = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewAudioUrl(file);
    setAudioFileName(file.name);

    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      const duration = audio.duration; // giây
      setDuration(Math.round(duration));
      URL.revokeObjectURL(audio.src);
    };
  };

  const handleUploadCover = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let coverFile = event.target.files[0];
      setPreviewCover(URL.createObjectURL(coverFile));
      setAudioFileCover(URL.createObjectURL(coverFile));
      setNewCover(event.target.files[0]);
    } else {
      setPreviewCover(``);
    }
  };

  const validateForm = () => {
    const titleRegex = /^(?=.{1,150}$)[\p{L}\p{N}\p{M}\p{P}\p{S}\s]+$/su;
    // const lrcRegex = /^(?:\[[^\]\r\n]+\].*(?:\r?\n|$)|.*(?:\r?\n|$))*$/u;
    const validations = [
      //Title
      {
        field: "title",
        value: title.trim() !== "",
        message: "Please fill title",
      },
      {
        field: "title",
        value: titleRegex.test(title),
        message: "Title is invalid",
      },

      //Audio
      {
        field: "audioUrl",
        value: !!audioUrl,
        message: "Please add file audio",
      },

      //Cover
      {
        field: "cover",
        value: !!cover,
        message: "Please add cover song",
      },

      //duration
      {
        field: "duration",
        value: duration !== "",
        message: "Can not get duration",
      },

      //owner
      {
        field: "ownerId",
        value: !!ownerId,
        message: "Please select owner song",
      },

      //genre
      {
        field: "genreId",
        value: genreId.length > 0,
        message: "Please select genre ",
      },
    ];
    const newErrors = {};

    for (const { field, value, message } of validations) {
      if (!value) {
        newErrors[field] = message;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEditMode = () => {
    setIsEdit(true);
  };

  const handleCancelEditMode = () => {
    setPreviewCover("");
    setNewCover(null);
    setNewAudioUrl(null);
    handleSetSongData();
    setIsEdit(false);
  };

  const handleDeleteSong = async (songId) => {
    let res = await deleteSong(songId);
    if (res?.EC === 0) {
      toast.success(res.EM);
      await fetchListSong();
      handleCLoseDialog();
    } else {
      toast.error(res.EM);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please re-check song info");
      return;
    }
    let listGenre = genreId.map((item) => item.value);
    let listFeature = featureId.map((item) => item.value);

    let res = await songUpdate(
      songData.id,
      title,
      newAudioUrl || audioUrl,
      newCover || cover,
      duration,
      lyrics,
      status,
      ownerId,
      listFeature,
      listGenre,
      albumId,
    );

    console.log(">>>check res: ", res);

    if (res?.EC === 0) {
      toast.success(res.EM);
      await fetchListSong();
      handleCLoseDialog();
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <>
      <Dialog
        open={show}
        onOpenChange={(open) => {
          if (!open) {
            handleCLoseDialog();
          } else {
            setShow(true);
          }
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="sm:max-w-7xl max-h-[77=8vh] overflow-y-auto p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-3">
              Create new Genre
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* LEFT */}
              <div className="col-span-2 space-y-4 flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                  {/* LEFT */}
                  <div>
                    <span className="px-1 font-bold text-sm flex justify-between py-1">
                      Cover{" "}
                      {errors.cover && (
                        <p className="text-sm text-red-500">♦{errors.cover}♥</p>
                      )}
                    </span>
                    <div
                      className={`group relative h-98 rounded-xl overflow-hidden p-2 flex justify-center items-center ${errors.cover ? "bg-red-600/80 ring-3 ring-red-600/30" : " bg-black/40"}`}
                    >
                      <img
                        src={
                          previewCover
                            ? previewCover
                            : cover
                              ? `${import.meta.env.VITE_BACKEND_URL}/${cover}`
                              : questionIcon
                        }
                        alt="cover song"
                        className="object-cover rounded-xl"
                      />

                      {isEdit && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <label
                            htmlFor="uploadFile"
                            className="cursor-pointer px-6 py-2 rounded-xl bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.8)]"
                          >
                            Choose cover
                          </label>
                          <input
                            type="file"
                            name="cover"
                            accept="image/*"
                            hidden
                            id="uploadFile"
                            onChange={handleUploadCover}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="space-y-4">
                    <Field>
                      <Label className="text-sm flex justify-between">
                        Title{" "}
                        {errors.title && (
                          <p className="text-sm text-red-500">
                            ♦{errors.title}♥
                          </p>
                        )}
                      </Label>
                      <Input
                        readOnly={!isEdit}
                        value={title}
                        aria-invalid={!!errors.title}
                        className="h-9 text-sm"
                        name="title"
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      />
                    </Field>

                    <Field>
                      <Label className="flex justify-between text-sm">
                        Lyrics{" "}
                        {errors.lyrics && (
                          <p className="text-sm text-red-500">
                            ♦{errors.lyrics}♥
                          </p>
                        )}
                        {isEdit && (
                          <label
                            htmlFor="uploadLrc"
                            className="cursor-pointer font-bold text-blue-900 hover:underline"
                          >
                            Upload file .lrc
                          </label>
                        )}
                      </Label>
                      {isEdit && (
                        <input
                          id="uploadLrc"
                          type="file"
                          accept=".lrc"
                          hidden
                          onChange={handleUploadLRC}
                        />
                      )}

                      <Textarea
                        readOnly={!isEdit}
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        aria-invalid={!!errors.lyrics}
                        className="h-76 resize-none text-sm"
                        name="lyrics"
                      />
                    </Field>
                  </div>
                </div>
                <Field>
                  <Label className="text-sm flex justify-between ">
                    Audio{" "}
                    {errors.audioUrl && (
                      <p className="text-sm text-red-500">
                        ♦{errors.audioUrl}♥
                      </p>
                    )}
                  </Label>
                  <div
                    className={`group relative h-[122px] rounded-xl bg-black/40 overflow-hidden ${cn(errors.audioUrl && "border border-red-600 ring-3 ring-red-600/30")}`}
                  >
                    <div className="flex h-full items-center px-4 gap-4">
                      <img
                        src={
                          previewCover
                            ? previewCover
                            : cover
                              ? `${import.meta.env.VITE_BACKEND_URL}/${audioFileCover}`
                              : questionIcon
                        }
                        alt=""
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      {!audioUrl ? (
                        <span className="truncate font-semibold text-white">
                          Don't have anything
                        </span>
                      ) : (
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-semibold text-white">
                            {audioFileName}
                          </span>

                          <span className="text-sm text-white/60">
                            {formatDuration(duration)}
                          </span>
                        </div>
                      )}
                    </div>
                    {isEdit && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <label
                          htmlFor="uploadAudio"
                          className="cursor-pointer rounded-xl bg-white px-6 py-2 font-semibold text-black"
                        >
                          Choose Audio
                        </label>

                        <input
                          id="uploadAudio"
                          type="file"
                          name="audioUrl"
                          accept="audio/*"
                          hidden
                          onChange={handleUploadAudio}
                        />
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <Field>
                  <FieldLabel className="flex justify-between">
                    Owner{" "}
                    {errors.ownerId && (
                      <p className="text-sm text-red-500">♦{errors.ownerId}♥</p>
                    )}
                  </FieldLabel>
                  <Select
                    value={String(ownerId)}
                    items={listArtistOption}
                    onValueChange={(value) => {
                      if (value === "none") {
                        setOwnerId("");
                      } else {
                        setOwnerId(value);
                      }
                      setAlbumId("");
                    }}
                  >
                    <SelectTrigger
                      disabled={!isEdit}
                      aria-invalid={!!errors.ownerId}
                      className="w-full"
                    >
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">--- None ---</SelectItem>
                        {ownerOptions.map((owner) => (
                          <SelectItem
                            key={owner.value}
                            value={String(owner.value)}
                          >
                            {owner.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Album</FieldLabel>
                  <Select
                    value={albumId ? String(albumId) : "none"}
                    items={listAlbumOptionWithId}
                    onValueChange={(value) => {
                      if (value === "none") {
                        setAlbumId("");
                      } else {
                        setAlbumId(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full" disabled={!isEdit}>
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">--- None ---</SelectItem>
                        {listAlbumOptionWithId.map((album) => (
                          <SelectItem key={album.id} value={String(album.id)}>
                            {album.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <RadioGroup
                    defaultValue="comfortable"
                    className="w-fit flex gap-2"
                    value={status}
                    onValueChange={setStatus}
                    disabled={!isEdit}
                  >
                    {statusOptions.map((statusO) => (
                      <div className="flex items-center gap-1 ">
                        <RadioGroupItem
                          value={statusO.value}
                          id={String(statusO.value)}
                        />
                        <Label htmlFor={String(statusO.value)}>
                          {statusO.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Field>

                <Tabs
                  defaultValue="genre"
                  className="w-full border  h-106 rounded-xl"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="genre">Genre</TabsTrigger>
                    <TabsTrigger value="feature">Feature</TabsTrigger>
                  </TabsList>
                  <TabsContent value="genre">
                    <ReactSelect
                      isDisabled={!isEdit}
                      className={
                        errors.genreId &&
                        "border border-red-600 ring-3 ring-red-600/30"
                      }
                      isMulti
                      placeholder={
                        errors.genreId
                          ? `♦${errors.genreId}♥`
                          : `Select genre...`
                      }
                      options={GenreOption}
                      value={genreId}
                      onChange={setGenreId}
                    />
                  </TabsContent>
                  <TabsContent value="feature">
                    <ReactSelect
                      isDisabled={!isEdit}
                      isMulti
                      options={featureOptions}
                      value={featureId}
                      onChange={setFeatureId}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-4">
            {isEdit ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCancelEditMode();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Save Song
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="warning"
                  onClick={() => {
                    handleEditMode();
                  }}
                >
                  Edit Song
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setSongDelete(songData)}
                >
                  Delete Song
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!songDelete}
        onOpenChange={(open) => {
          if (!open) {
            setSongDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song</AlertDialogTitle>

            <AlertDialogDescription>
              {songDelete?.albumId && (
                <>
                  This song is on an Album{" "}
                  <span className="text-black font-bold">
                    " {getAlbumName(songDelete?.albumId)} "
                    <br />
                  </span>
                </>
              )}
              Are you want to delete{" "}
              <span className="text-black font-bold">
                " {songDelete?.title} "?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>

            <AlertDialogAction onClick={() => handleDeleteSong(songDelete.id)}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DialogDetailSong;
