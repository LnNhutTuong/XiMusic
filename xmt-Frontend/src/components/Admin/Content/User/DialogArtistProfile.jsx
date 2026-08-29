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

import { useEffect, useState } from "react";

const DialogArtistProfile = (props) => {
  const { show, setShow, setIsArtist, detailUser } = props;

  const [displayName, setDisplayName] = useState("");
  const [avt, setAvt] = useState("");

  const [stageName, setStageName] = useState("");
  const [bio, setBio] = useState("");
  const [verified, setVerified] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    dataUser();
  }, [detailUser]);

  const dataUser = () => {
    if (detailUser) {
      setDisplayName(detailUser.information.displayName);
      setAvt(detailUser.information.avt ?? "");
      if (detailUser.artistProfile) {
        setStageName(detailUser.artistProfile?.stageName);
        setBio(detailUser.artistProfile.bio);
        setVerified(detailUser.artistProfile.verified);
        setMonthlyListeners(detailUser.artistProfile.monthlyListeners);
        setCountry(detailUser.artistProfile.country);
      }
    }
  };

  const handleCLoseDialog = () => {
    setShow(false);

    setStageName("");
    setBio("");
    setVerified("");
    setMonthlyListeners("");
    setCountry("");

    if (setIsArtist) {
      setIsArtist(false);
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
                  <div className="h-[414px] w-[414px] rounded-xl overflow-hidden px-1 py-1 flex justify-center items-center bg-black/40">
                    <img
                      className="rounded-xl"
                      src={avt || "/image/default_image.svg"}
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
                  <div className="flex gap-4">
                    <Field>
                      <Label className="text-sm">Verified</Label>
                      <Input
                        readOnly
                        className="h-9 text-sm"
                        name="stageName"
                        value={
                          verified === 0
                            ? "PENDING"
                            : verified === 1
                              ? "APPROVED"
                              : "REJECTED"
                        }
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm">Monthly listener</Label>
                      <Input
                        readOnly
                        className="h-9 text-sm"
                        name="stageName"
                        value={monthlyListeners}
                      />
                    </Field>
                  </div>
                  <Field>
                    <Label className="text-sm">Bio</Label>
                    <Textarea
                      readOnly
                      className="resize-none h-36 text-sm"
                      name="stageName"
                      value={bio ?? "Don't said anything"}
                      s
                    />
                  </Field>
                </div>
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-4">
            <Button variant="outline">Send message</Button>
            <Button
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogArtistProfile;
