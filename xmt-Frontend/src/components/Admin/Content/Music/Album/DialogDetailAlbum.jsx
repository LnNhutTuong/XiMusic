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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ReactSelect from "react-select";

import { toSongSelect } from "@/utils/selectOption";

import { getArtistOption } from "@/services/admin/artist/artistService";

import { getSongOptionWithIdOrNot } from "@/services/admin/music/song/songService";

import {
  albumUpdate,
  deleteAlbum,
} from "@/services/admin/music/album/albumService";

import questionIcon from "@/assets/static/genre/question_icon.jpg";

const DialogDetailAlbum = (props) => {
  const { show, setShow, albumData, fetchAllAlbum } = props;

  const [title, setTitle] = useState("");

  const [cover, setCover] = useState("");
  const [previewCover, setPreviewCover] = useState("");
  const [newCover, setNewCover] = useState("");

  const [ownerId, setOwnerId] = useState("");
  const [listArtistOption, setListArtistOption] = useState([]);

  const [songId, setSongId] = useState([]);
  const [listSongOptionWithOwnerId, setListSongOptionWithOwnerId] = useState(
    [],
  );

  const [releaseDate, setReleaseDate] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [alertDelete, setAlertDelete] = useState(false);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    handleGetAlbumData();
    getListArtistOption();
  }, [albumData]);

  const handleGetAlbumData = () => {
    if (albumData) {
      setTitle(albumData.title);
      setCover(albumData.cover);
      setOwnerId(albumData.ownerId);

      if (albumData.songs) {
        setSongId(toSongSelect(albumData.songs));
      }

      setReleaseDate(albumData.releaseDate);
    }
  };

  const handleCLoseDialog = () => {
    setShow(false);
    setIsEdit(false);

    setTitle("");
    setCover("");
    setOwnerId("");
    setListArtistOption([]);
    setReleaseDate("");
  };

  useEffect(() => {
    if (ownerId) {
      handleGetListSongOptionWithOwnerId(ownerId);
    } else {
      setListSongOptionWithOwnerId([]);
    }
  }, [ownerId]);

  const getListArtistOption = async () => {
    let res = await getArtistOption();
    if (res?.EC === 0) {
      setListArtistOption(res.DT.rows);
    }
  };

  const handleGetListSongOptionWithOwnerId = async (ownerId) => {
    let res = await getSongOptionWithIdOrNot(ownerId);
    if (res?.EC === 0) {
      setListSongOptionWithOwnerId(res.DT.rows);
    }
  };

  const handleUploadCover = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      setPreviewCover(URL.createObjectURL(event.target.files[0]));
      setNewCover(event.target.files[0]);
    } else {
      setPreviewCover(``);
    }
  };

  const validateForm = () => {
    const titleRegex = /^(?=.{1,150}$)[\p{L}\p{N}\p{M}\p{P}\p{S}\s]+$/su;
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

      //Cover
      {
        field: "cover",
        value: !!cover,
        message: "Please add cover song",
      },

      //owner
      {
        field: "ownerId",
        value: !!ownerId,
        message: "Please select owner album",
      },

      //owner
      {
        field: "songId",
        value: !(releaseDate && songId.length === 0),
        message: "Please select song",
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
    handleGetAlbumData();
    setPreviewCover("");
    setIsEdit(false);
  };

  const handleDeleteAlbum = () => {
    if (songId.length > 0) {
      setAlertDelete(true);
      return;
    }

    handleConfirmDelete(albumData.id);
  };

  const handleConfirmDelete = async (albumId) => {
    const res = await deleteAlbum(albumId);

    if (res?.EC === 0) {
      toast.success(res.EM);
      await fetchAllAlbum();
      setAlertDelete(false);
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

    let listSongId = [];
    if (songId) {
      listSongId = songId.map((item) => item.value);
    }

    let res = await albumUpdate(
      albumData.id,
      title,
      newCover || cover,
      ownerId,
      releaseDate,
      listSongId,
    );

    console.log(">>check res: ", res);

    if (res?.EC === 0) {
      toast.success(res.EM);
      await fetchAllAlbum();
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
          className="sm:max-w-4xl max-h-[65vh] overflow-y-auto p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Detail Album
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="space-y-4">
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
                    alt="icon genre"
                    className="object-cover rounded-xl p-2"
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
                      <p className="text-sm text-red-500">♦{errors.title}♥</p>
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
                  <FieldLabel className="flex justify-between">
                    Owner{" "}
                    {errors.ownerId && (
                      <p className="text-sm text-red-500">♦{errors.ownerId}♥</p>
                    )}
                  </FieldLabel>
                  <Select
                    disabled={!isEdit}
                    value={String(ownerId)}
                    items={listArtistOption}
                    onValueChange={setOwnerId}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.ownerId}
                      className="w-full"
                    >
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">--- None ---</SelectItem>
                        {listArtistOption.map((owner) => (
                          <SelectItem key={owner.id} value={String(owner.id)}>
                            {owner.artistName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="flex justify-between">
                    Song{" "}
                    {errors.songId && (
                      <p className="text-sm text-red-500">♦{errors.songId}♥</p>
                    )}
                  </FieldLabel>
                  <ReactSelect
                    isDisabled={!isEdit}
                    className={
                      errors.songId &&
                      "border border-red-600 ring-3 ring-red-600/30"
                    }
                    isMulti
                    options={toSongSelect(listSongOptionWithOwnerId)}
                    value={songId}
                    onChange={setSongId}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex justify-between">
                    Release date
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" disabled={!isEdit}>
                        {releaseDate
                          ? format(releaseDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-max p-0">
                      <Calendar
                        mode="single"
                        selected={releaseDate}
                        onSelect={setReleaseDate}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
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
                  Edit Album
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAlbum()}
                >
                  Delete Album
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>

        <AlertDialog
          open={alertDelete}
          onOpenChange={(open) => {
            if (!open) {
              setAlertDelete(false);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Can't delete this album</AlertDialogTitle>

              <AlertDialogDescription>
                Can not delete this album because it's have some song, if you
                delete please choose the action.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setAlertDelete(false);
                }}
              >
                Toi khong dong tinh
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleConfirmDelete(albumData.id);
                }}
              >
                Toi dong tinh
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </>
  );
};

export default DialogDetailAlbum;
