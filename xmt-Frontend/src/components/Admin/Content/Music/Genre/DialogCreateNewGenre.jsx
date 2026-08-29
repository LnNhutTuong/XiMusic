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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { createNewGenre } from "../../../../../services/admin/music/genre/genreService";
import questionIcon from "@/assets/static/genre/question_icon.jpg";

const DialogCreateNewGenre = (props) => {
  const { show, setShow, fetchAllGenre } = props;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [icon, setIcon] = useState(null);
  const [previewIcon, setPreviewIcon] = useState("");

  const [isValidInput, setIsValidInput] = useState({
    isValidName: true,
    isValidDescription: true,
  });

  const handleCLoseDialog = () => {
    setShow(false);

    setName("");
    setDescription("");

    setIcon("");
    setPreviewIcon("");

    setIsValidInput({
      isValidName: true,
      isValidDescription: true,
    });
  };

  const isValid = () => {
    const validation = {
      isValidName: true,
      isValidDescription: true,
    };

    let check = true;
    let error = "";

    const nameRegex = /^[\p{L}\p{N}]+(?:[- ][\p{L}\p{N}]+)*$/u;
    const descriptionRegex =
      /^[\p{L}\p{N}](?:[\p{L}\p{N}\s.,!?:;()'"-]*[\p{L}\p{N}])?$/u;

    if (!name && !description) {
      validation.isValidName = false;
      validation.isValidDescription = false;
      error = "Please fill in all the fields";
      check = false;
    } else if (!name || !name.match(nameRegex)) {
      validation.isValidName = false;
      error = "Name is not valid";
      check = false;
    } else if (!description || !description.match(descriptionRegex)) {
      validation.isValidDescription = false;
      error = "Description is not valid";
      check = false;
    }

    setIsValidInput(validation);

    if (!check && error) {
      toast.error(error);
      return false;
    }
    return check;
  };

  const handleUploadIcon = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      setPreviewIcon(URL.createObjectURL(event.target.files[0]));
      setIcon(event.target.files[0]);
    } else {
      setPreviewIcon(``);
    }
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      return;
    } else {
      let res = await createNewGenre(name, description, icon);
      console.log(">>>check res: ", res);

      if (res?.EC === 0) {
        toast.success(res.EM);
        await fetchAllGenre();
        handleCLoseDialog();
      } else {
        toast.error(res.EM);
      }
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
              Create new Genre
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="space-y-4">
                <div className="group relative h-[414px] w-[414px] rounded-xl overflow-hidden p-2 flex justify-center items-center bg-black/40">
                  <img
                    src={previewIcon || questionIcon}
                    alt="icon genre"
                    className="object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <label
                      htmlFor="uploadFile"
                      className="cursor-pointer px-6 py-2 rounded-xl bg-white text-black font-semibold transition-all duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.8)]"
                    >
                      Choose Icon
                    </label>
                    <input
                      type="file"
                      name="icon"
                      hidden
                      id="uploadFile"
                      onChange={(e) => {
                        handleUploadIcon(e);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <Field>
                  <Label className="text-sm">Name</Label>
                  <Input
                    aria-invalid={!isValidInput.isValidName}
                    className="h-9 text-sm"
                    name="email"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  {!isValidInput.isValidName && (
                    <FieldError>Your name is invalid</FieldError>
                  )}
                </Field>
                <Field>
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    aria-invalid={!isValidInput.isValidDescription}
                    className="h-76 resize-none text-sm"
                    name="description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  {!isValidInput.isValidDescription && (
                    <FieldError>Your description is invalid</FieldError>
                  )}
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

            <Button onClick={() => handleSubmit()}>Create user</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogCreateNewGenre;
