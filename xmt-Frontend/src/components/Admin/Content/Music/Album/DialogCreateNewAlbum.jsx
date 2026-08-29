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

import { getSongOptionWithIdOrNot } from "@/services/admin/music/song/songService";

import { getArtistOption } from "@/services/admin/artist/artistService";

import { createNewAlbum } from "@/services/admin/music/album/albumService";

import questionIcon from "@/assets/static/genre/question_icon.jpg";

const DialogCreateNewAlbum = (props) => {
  const { show, setShow, fetchAllAlbum } = props;

  const [title, setTitle] = useState("");

  const [cover, setCover] = useState("");
  const [previewCover, setPreviewCover] = useState("");

  const [ownerId, setOwnerId] = useState("");
  const [listArtistOption, setListArtistOption] = useState([]);

  const [songChoose, setSongChoose] = useState([]);
  const [listSongOptionWithOwnerId, setListSongOptionWithOwnerId] = useState(
    [],
  );

  const [releaseDate, setReleaseDate] = useState("");

  const [errors, setErrors] = useState([]);

  const handleCLoseDialog = () => {
    setShow(false);

    setTitle("");

    setCover("");
    setPreviewCover("");

    setOwnerId("");

    setReleaseDate("");

    setSongChoose([]);
    setErrors([]);
  };

  useEffect(() => {
    if (ownerId) {
      handleGetListSongOptionWithOwnerId(ownerId);
    } else {
      setListSongOptionWithOwnerId([]);
    }
  }, [ownerId]);

  useEffect(() => {
    getListArtistOption();
  }, []);

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
      setCover(event.target.files[0]);
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
        field: "songChoose",
        value: !(releaseDate && songChoose.length === 0),
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please re-check song info");
      return;
    }

    let listSongChoose = [];
    if (songChoose) {
      listSongChoose = songChoose.map((item) => item.value);
    }

    let res = await createNewAlbum(
      title,
      cover,
      ownerId,
      releaseDate,
      listSongChoose,
    );

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
              Create new Album
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
                    src={previewCover || questionIcon}
                    alt="icon genre"
                    className="object-cover rounded-xl p-2"
                  />

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
                    value={ownerId || "none"}
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
                    {errors.songChoose && (
                      <p className="text-sm text-red-500">
                        ♦{errors.songChoose}♥
                      </p>
                    )}
                  </FieldLabel>
                  <ReactSelect
                    className={
                      errors.songChoose &&
                      "border border-red-600 ring-3 ring-red-600/30"
                    }
                    isMulti
                    options={toSongSelect(listSongOptionWithOwnerId)}
                    value={songChoose}
                    onChange={setSongChoose}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex justify-between">
                    Release date
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
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

          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                handleCLoseDialog();
              }}
              variant="outline"
            >
              Cancel
            </Button>

            <Button onClick={() => handleSubmit()}>Create Album</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogCreateNewAlbum;
