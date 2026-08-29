import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  requestArtist,
  cancelRequestArtist,
  editRequestArtist,
} from "@/services/users/profileService";

export const DialogBecameAnArtist = (props) => {
  const {
    show,
    setShow,
    profileData,
    artistProfileData,
    setArtistProfileData,
    handleGetProfileData,
  } = props;

  const [stageName, setStageName] = useState("");
  const [checked, setChecked] = useState(false);
  const [bio, setBio] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});

  const isViewOnly = !!artistProfileData && !isEdit;

  const handleCloseDialog = () => {
    setShow(false);
    setStageName("");
    setChecked(false);
    setBio("");
    setErrors({});
    setIsEdit(false);
  };

  useEffect(() => {
    if (artistProfileData) {
      setStageName(artistProfileData.stageName || profileData?.displayName);
      setChecked(!artistProfileData.stageName);
      setBio(artistProfileData.bio || "");
    }
  }, [artistProfileData]);

  const validateForm = () => {
    const stageNameRegex =
      /^(?=.{1,150}$)(?!admin$)[\p{L}\p{N}\p{M}\p{P}\p{S}\s]+$/isu;

    const newErrors = {};
    if (!stageName || stageName.trim() === "") {
      newErrors.stageName = "Please fill Stage Name";
    } else if (!stageNameRegex.test(stageName)) {
      newErrors.stageName = "Stage Name is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please re-check your information");
      return;
    }

    const finalStageName =
      stageName === profileData.displayName ? null : stageName;

    let res = await requestArtist(profileData.id, finalStageName, bio);

    if (res?.EC === 0) {
      toast.success(res.EM);
      handleGetProfileData(profileData.email);
      handleCloseDialog();
    } else {
      toast.error(res.EM);
    }
  };

  const handleCancelArtist = async () => {
    let res = await cancelRequestArtist(profileData.id);
    if (res?.EC === 0) {
      toast.success(res.EM);
      handleGetProfileData(profileData.email);
      setArtistProfileData(null);
      handleCloseDialog();
    } else {
      toast.error(res.EM);
    }
  };

  const handleEditArtist = async () => {
    if (!validateForm()) {
      toast.error("Please re-check your information");
      return;
    }

    const finalStageName =
      stageName === profileData.displayName ? null : stageName;

    let res = await editRequestArtist(profileData.id, finalStageName, bio);

    if (res?.EC === 0) {
      toast.success(res.EM);
      handleGetProfileData(profileData.email);
      handleCloseDialog();
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            {artistProfileData ? "Your Artist Request" : "Become an Artist"}
          </DialogTitle>
          <DialogDescription className="space-y-4">
            {/* STAGE NAME */}
            <Field>
              <div>
                <Label className="text-sm">My stage name</Label>
                <div className="flex gap-1 items-center my-1">
                  <Checkbox
                    checked={checked}
                    disabled={isViewOnly}
                    aria-invalid={!!errors.stageName}
                    onCheckedChange={(value) => {
                      setChecked(value);
                      setStageName(value ? profileData.displayName : "");
                    }}
                  />
                  <span>Check if you want to use your display name</span>
                </div>
              </div>

              <Input
                className="h-9 text-sm text-black"
                name="stageName"
                aria-invalid={!!errors.stageName}
                value={stageName}
                readOnly={isViewOnly}
                onChange={(e) => {
                  setStageName(e.target.value);
                  setChecked(false);
                }}
              />
              {errors.stageName && (
                <p className="text-sm text-red-500">♦ {errors.stageName}</p>
              )}
            </Field>

            {/* BIO */}
            <Field>
              <Label className="text-sm">My bio</Label>
              <Input
                className="h-9 text-sm text-black"
                name="bio"
                value={bio}
                readOnly={isViewOnly} // 🔒 Khóa khi view-only
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </Field>

            {/* NOTICE */}
            <div className="mt-3 bg-red-600/40 rounded-xl p-2 text-red-600">
              <h1 className="font-bold">*Notice*</h1>
              <p>Your request will be responded to within 24 hours.</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          {!artistProfileData ? (
            <>
              <Button onClick={handleCloseDialog} variant="outline">
                Close
              </Button>
              <Button onClick={handleSubmit}>Send my request</Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancelArtist} variant="warning">
                Cancel request
              </Button>
              {isEdit ? (
                <Button onClick={handleEditArtist}>Save Changes</Button>
              ) : (
                <Button onClick={() => setIsEdit(true)}>Edit request</Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
