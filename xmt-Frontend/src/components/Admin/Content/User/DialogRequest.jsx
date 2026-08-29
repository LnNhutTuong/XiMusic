import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "react-toastify";

import { useEffect, useState } from "react";

import { updateRequestArtist } from "@/services/admin/user/userService";

import defaultImage from "../../../../assets/static/users/default_image.svg";

import { deleteArtistProfile } from "@/services/admin/artist/artistService";

const DialogRequestArtist = (props) => {
  const {
    show,
    setShow,
    detailUser,
    fetchAllUser,
    isRequest,
    setIsRequest,
    isRejected,
    setIsRejected,
  } = props;

  const [displayName, setDisplayName] = useState("");
  const [avt, setAvt] = useState("");

  const [stageName, setStageName] = useState("");
  const [bio, setBio] = useState("");
  const [verified, setVerified] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");
  const [country, setCountry] = useState("");

  const [statusVerify, setStatusVerify] = useState("");

  useEffect(() => {
    dataUser();
  }, [detailUser]);

  const dataUser = () => {
    if (detailUser) {
      setDisplayName(detailUser.information.displayName);
      setAvt(detailUser.information.avatar);

      setStageName(detailUser.artistProfile.stageName);
      setBio(detailUser.artistProfile.bio);
      setVerified(detailUser.artistProfile.verified);
      setMonthlyListeners(detailUser.artistProfile.monthlyListeners);
      setCountry(detailUser.artistProfile.country);
    }
  };

  const handleCLoseDialog = () => {
    setShow(false);

    setStageName("");
    setBio("");
    setVerified("");
    setMonthlyListeners("");
    setCountry("");

    if (isRequest) {
      setIsRequest(false);
    }
    if (isRejected) {
      setIsRejected(false);
    }
  };

  const handleUpdateRequest = async () => {
    const res = await updateRequestArtist(
      detailUser?.information.id,
      statusVerify,
    );

    if (res?.EC === 0) {
      handleCLoseDialog();
      fetchAllUser();
      toast.success(res.EM);
    } else {
      toast.error(res.EM);
    }
  };

  const handleDeleteArtistProfile = async (userId) => {
    const res = await deleteArtistProfile(userId);

    if (res?.EC === 0) {
      handleCLoseDialog();
      fetchAllUser();
      toast.success(res.EM);
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
          className="sm:max-w-4xl max-h-auto overflow-y-auto p-6"
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">
              {isRejected ? "Request Artist" : "Artist Profile"}
            </DialogTitle>
          </DialogHeader>

          <FieldSet>
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* LEFT */}
                <div className="space-y-4">
                  <div className="h-[414px] w-[414px] rounded-xl overflow-hidden px-1 py-1 flex justify-center items-center bg-black/40">
                    <img
                      className="rounded-xl"
                      src={
                        avt
                          ? `${import.meta.env.VITE_BACKEND_URL}/${avt}`
                          : defaultImage
                      }
                      alt=""
                    />
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  <Field>
                    <Label className="text-sm">Stage name</Label>
                    <Input
                      readOnly
                      className="h-9 text-sm"
                      name="stageName"
                      value={stageName ?? displayName}
                    />
                  </Field>
                  <Field>
                    <Label className="text-sm">Country</Label>
                    <Input
                      readOnly
                      className="h-9 text-sm"
                      name="stageName"
                      value={country ?? "Secret"}
                    />
                  </Field>
                  <Field>
                    <Label className="text-sm">Bio</Label>
                    <Textarea
                      readOnly
                      className="resize-none h-36 text-sm"
                      name="stageName"
                      value={bio ?? "Don't said anything"}
                    />
                  </Field>
                </div>
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-4">
            {!isRejected ? (
              <>
                <Button
                  className="bg-green-600/80 text-white hover:bg-green-500"
                  onClick={() => {
                    setStatusVerify(1);
                    handleUpdateRequest();
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setStatusVerify(2);
                    handleUpdateRequest();
                  }}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteArtistProfile(detailUser?.information.id);
                }}
              >
                Delete Artist Profile
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogRequestArtist;
