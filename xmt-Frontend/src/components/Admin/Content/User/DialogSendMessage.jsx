import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import ximentIcon from "../../../../assets/icon/ximent.png";

import { useEffect, useState, useContext } from "react";

const DialogSendMessage = (props) => {
  const { show, setShow, detailUser } = props;

  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [userId, setUserId] = useState("");

  const handleCLoseDialog = () => {
    setShow(false);
    setImage("");
    setPreviewImage("");
    setType("");
    setTitle("");
    setContent("");
    setUserId("");
  };

  useEffect(() => {
    if (detailUser) {
      setUserId(detailUser?.information.id);
    }
  }, [detailUser]);

  const handleUploadImage = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let imageFile = event.target.files[0];
      setPreviewImage(URL.createObjectURL(imageFile));
      setImage(imageFile);
    } else {
      setPreviewImage(``);
    }
  };

  const handleSend = () => {
    console.log(">>chek type: ", type);
    console.log(">>chek title: ", title);
    console.log(">>chek content: ", content);
    console.log(">>chek userId: ", userId);

    console.log(">>chek image: ", image);
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
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">
              Artist Profile
            </DialogTitle>
          </DialogHeader>

          <FieldSet>
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* LEFT */}
                <div className="space-y-4">
                  <div
                    className={`group relative h-98 rounded-xl overflow-hidden p-2 flex justify-center items-center" bg-black/40`}
                  >
                    <img
                      src={previewImage || ximentIcon}
                      alt="icon genre"
                      className="object-cover rounded-xl"
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
                        onChange={handleUploadImage}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  <Field>
                    <Label className="text-sm">Type of message</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full h-9 text-sm">
                        <SelectValue placeholder="Select type of message" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label className="text-sm">Title</Label>
                    <Input
                      className="h-9 text-sm"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <Label className="text-sm">Content</Label>
                    <Textarea
                      className="resize-none h-36 text-sm"
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Field>

                  <div className="flex justify-end ">
                    <Field>
                      <Label className="text-sm">To</Label>
                      <Input
                        readOnly
                        className="h-9 w-9 text-sm"
                        name="userId"
                        value={detailUser?.information?.displayName}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </Button>
            <Button variant="outline" onClick={handleSend}>
              Send message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogSendMessage;
