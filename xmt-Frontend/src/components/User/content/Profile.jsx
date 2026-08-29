import { Button } from "@/components/ui/button";
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
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";

import defaultAvatar from "../../../assets/static/users/default_image.svg";

import { DialogBecameAnArtist } from "./DialogBecameAnArtist";

import { getProfile, updateProfile } from "@/services/users/profileService";

import { getArtistProfile } from "@/services/users/artistService";

import { useNavigate } from "react-router-dom";

export const Profile = (props) => {
  const { user, fetchUser, UpdateUserAccount } = useContext(UserContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);

  const [artistProfileData, setArtistProfileData] = useState(null);

  const [newDisplayName, setNewDisplayName] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  const [errors, setErrors] = useState([]);

  const [showDialogBecameAnArtist, setShowDialogBecameAnArtist] =
    useState(false);

  useEffect(() => {
    handleGetProfileData(user.account.email);
  }, []);

  const handleGetProfileData = async (email) => {
    let res = await getProfile(email);
    if (res?.EC === 0) {
      setProfileData(res?.DT);
    }
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);

    if (!isEdit) {
      setNewDisplayName(profileData?.displayName);
    }
  };

  const handleUploadAvatar = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
      setIsChangeAvatar(true);
    }
  };

  const validateForm = () => {
    const displayNameRegex =
      /^(?=.{3,24}$)(?=.*[\p{L}\p{N}])[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*(?: [\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*)*$/u;

    const validations = [
      //Title
      {
        field: "newDisplayName",
        value: newDisplayName.trim() !== "",
        message: "Please fill Display Name",
      },

      {
        field: "newDisplayName",
        value: displayNameRegex.test(newDisplayName),
        message: "Display Name is invalid",
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

  const handleChangeDisplayName = async () => {
    if (!validateForm()) {
      toast.error("Please re-check your information");
      return;
    }

    let res = await updateProfile(profileData?.id, newDisplayName, null);

    if (res?.EC === 0) {
      toast.success(res?.EM);
      UpdateUserAccount({ displayName: newDisplayName });
      handleGetProfileData(user.account.email);
      setIsEdit(false);
    } else {
      toast.error(res?.EM);
    }
  };

  const handleSaveChangeAvatar = async () => {
    if (!previewAvatar) {
      toast.error("Please select an avatar");
      return;
    }

    let res = await updateProfile(profileData?.id, null, avatarFile);
    console.log("??check res: ", res);
    if (res?.EC === 0) {
      toast.success(res?.EM);
      handleGetProfileData(user.account.email);
      UpdateUserAccount({ avatar: res.DT.avatar });
      setIsChangeAvatar(false);
    } else {
      toast.error(res?.EM);
    }
  };

  const handleGetArtistProfile = async (userId) => {
    if (!userId) {
      return toast.error("User ID is required");
    }

    let res = await getArtistProfile(userId);
    if (res?.EC === 0) {
      setArtistProfileData(res.DT);
    } else {
      setArtistProfileData(null);
      toast.error(res?.EM);
    }
  };

  const handleArtistProfile = async () => {
    switch (+profileData?.artistProfile?.verified) {
      case 0:
        (await handleGetArtistProfile(profileData.id),
          setShowDialogBecameAnArtist(true));
        break;
      case 2:
        setShowDialogBecameAnArtist(true);
        break;
      case 1:
        navigate("/artist-profile");
        break;
      default:
        setShowDialogBecameAnArtist(true);
        break;
    }
  };

  return (
    <>
      <div className="w-full h-full mt-20">
        <FieldSet>
          <FieldGroup className="space-y-4 px-30">
            <div className="grid grid-cols-2 gap-4">
              {/* LEFT */}
              <div className="space-y-4 flex justify-center flex-col">
                <div className="h-120 w-120 rounded-xl overflow-hidden p-1 bg-black/40">
                  <img
                    className="rounded-xl bg-white/60 w-full h-full object-cover"
                    src={
                      previewAvatar
                        ? previewAvatar
                        : profileData?.avatar
                          ? `${import.meta.env.VITE_BACKEND_URL}/${profileData?.avatar}`
                          : defaultAvatar
                    }
                    alt="Avatar"
                  />
                </div>

                <div className="flex justify-center">
                  {/* Thẻ input ẩn */}
                  <input
                    type="file"
                    id="avatar-input"
                    hidden
                    accept="image/*"
                    onChange={handleUploadAvatar}
                  />

                  {/* Nút bấm */}
                  {isChangeAvatar ? (
                    <button
                      className="hover:cursor-pointer px-10 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition duration-300 hover:-translate-y-1"
                      onClick={handleSaveChangeAvatar}
                    >
                      Save Image
                    </button>
                  ) : (
                    <label
                      htmlFor="avatar-input"
                      className="hover:cursor-pointer px-10 py-1 rounded-full bg-gray-500/60 hover:bg-gray-500/70 text-white transition duration-300 hover:-translate-y-1"
                    >
                      Update Image
                    </label>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <Field>
                  <Label className="text-sm">Email</Label>
                  <Input
                    readOnly={true}
                    className="h-9 text-sm"
                    name="email"
                    value={profileData?.email}
                  />
                </Field>

                <Field>
                  <div className="flex justify-between">
                    <Label className="text-sm">Display name</Label>
                    <p
                      className="hover:cursor-pointer text-sm transition duration-300  hover:-translate-y-1 bg-gray-500/60 hover:bg-gray-500/70 rounded-xl px-1"
                      onClick={() => {
                        isEdit ? handleChangeDisplayName() : handleEdit();
                      }}
                    >
                      {isEdit ? "Save" : "change"}
                    </p>
                  </div>

                  <Input
                    readOnly={!isEdit}
                    aria-invalid={!!errors.newDisplayName}
                    className={`h-9 text-sm ${isEdit && `border-blue-400`}`}
                    value={isEdit ? newDisplayName : profileData?.displayName}
                    name="displayName"
                    maxLength={24}
                    onChange={(e) => {
                      setNewDisplayName(e.target.value);
                    }}
                  />
                  {!!errors.newDisplayName && (
                    <FieldError>Your displayName is invalid</FieldError>
                  )}
                </Field>

                <h1
                  className={`text-center w-max mx-auto px-2 py-1 mt-3 text-xl rounded-xl transition duration-300  hover:-translate-y-1
                        ${
                          !profileData?.artistProfile
                            ? "bg-gray-500/60 hover:bg-gray-500/70 "
                            : profileData?.artistProfile?.verified === 0
                              ? "bg-yellow-500/60 hover:bg-yellow-500/70"
                              : profileData?.artistProfile?.verified === 1
                                ? "bg-green-500/60 hover:bg-green-500/70"
                                : "bg-red-500/60 hover:bg-red-500/70"
                        }`}
                >
                  {profileData?.artistProfile?.verified === undefined ||
                  profileData?.artistProfile?.verified === null ? (
                    <button
                      className="text-sm hover:cursor-pointer"
                      onClick={handleArtistProfile}
                    >
                      You want to became an Artist
                    </button>
                  ) : profileData?.artistProfile?.verified === 0 ? (
                    <div className="flex flex-col items-center">
                      Your request is processing...
                      <button
                        className="text-sm underline hover:cursor-pointer"
                        onClick={handleArtistProfile}
                      >
                        View request
                      </button>
                    </div>
                  ) : profileData?.artistProfile?.verified === 1 ? (
                    "You are an Artist"
                  ) : (
                    <div className="flex flex-col items-center">
                      Your request is rejected
                      <button
                        className="text-sm underline hover:cursor-pointer"
                        onClick={handleArtistProfile}
                      >
                        send request again
                      </button>
                    </div>
                  )}
                </h1>
              </div>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>
      <DialogBecameAnArtist
        show={showDialogBecameAnArtist}
        setShow={setShowDialogBecameAnArtist}
        profileData={profileData}
        artistProfileData={artistProfileData}
        setArtistProfileData={setArtistProfileData}
        handleGetProfileData={handleGetProfileData}
      />
    </>
  );
};
