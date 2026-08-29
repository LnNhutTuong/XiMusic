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
import { handleCreateNewUser } from "../../../../services/admin/user/userService";
import { getAllGroup } from "../../../../services/admin/group/groupService";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DialogCreateUser = (props) => {
  const { show, setShow, fetchAllUser } = props;

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [listGroups, setListGroups] = useState([]);

  // artist
  const [statusVerify, setStatusVerify] = useState("");
  const [listStatusVerify, setListStatusVerify] = useState([
    { value: 0, label: "Pending" },
    { value: 1, label: "Approved" },
    { value: 2, label: "Rejected" },
  ]);

  const [isValidInput, setIsValidInput] = useState({
    isValidEmail: true,
    isValidDisplayName: true,
    isValidGroupId: true,
    isValidStatusVerify: true,
  });

  const isValid = () => {
    const validation = {
      isValidEmail: true,
      isValidDisplayName: true,
      isValidGroupId: true,
      isValidStatusVerify: true,
    };

    let check = true;
    let error = "";

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const displayNameRegex =
      /^(?=.{3,24}$)(?=.*[\p{L}\p{N}])[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*(?: [\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*)*$/u;

    if (!email && !displayName && !groupId && !statusVerify) {
      validation.isValidEmail = false;
      validation.isValidDisplayName = false;
      validation.isValidGroupId = false;
      validation.isValidStatusVerify = false;
      error = "Please fill in all the fields";
      check = false;
    } else if (!email || !email.match(emailRegex)) {
      validation.isValidEmail = false;
      error = "Email is not valid";
      check = false;
    } else if (!displayName || !displayName.match(displayNameRegex)) {
      validation.isValidDisplayName = false;
      error = "displayName is not valid";
      check = false;
    } else if (!groupId) {
      validation.isValidGroupId = false;
      error = "Please select Group";
      check = false;
    }

    if (groupId === 2) {
      if (statusVerify === null || statusVerify === "") {
        validation.isValidStatusVerify = false;
        error = "Please select Status Verify";
        check = false;
      }
    }

    setIsValidInput(validation);

    if (!check && error) {
      toast.error(error);
      return false;
    }
    return check;
  };

  useEffect(() => {
    getListGroups();
  }, []);

  const getListGroups = async () => {
    let res = await getAllGroup();
    if (res?.EC === 0) {
      setListGroups(res.DT);
    }
  };

  const handleCLoseDialog = () => {
    setEmail("");
    setDisplayName("");
    setGroupId("");
    setStatusVerify("");

    setIsValidInput({
      isValidEmail: true,
      isValidDisplayName: true,
      isValidGroupId: true,
      isValidStatusVerify: true,
    });

    setShow(false);
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      return;
    }

    let check = isValid();
    let defaultPassword = "123456";
    const finalEmail = email.trim().toLowerCase();

    if (check) {
      let res = await handleCreateNewUser(
        finalEmail,
        defaultPassword,
        displayName,
        groupId,
        statusVerify,
      );

      if (res?.EC === 0) {
        toast.success(res.EM);
        await fetchAllUser();
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
              Create new User
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="space-y-4">
                <Field>
                  <Label className="text-sm">Email</Label>
                  <Input
                    aria-invalid={!isValidInput.isValidEmail}
                    className="h-9 text-sm"
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  {!isValidInput.isValidEmail && (
                    <FieldError>Your email is invalid</FieldError>
                  )}
                </Field>

                <Field>
                  <Label className="text-sm">displayName</Label>
                  <Input
                    aria-invalid={!isValidInput.isValidDisplayName}
                    className="h-9 text-sm"
                    name="displayName"
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                  />
                  {!isValidInput.isValidDisplayName && (
                    <FieldError>Your displayName is invalid</FieldError>
                  )}
                </Field>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <Field>
                  <FieldLabel>Group</FieldLabel>
                  <Select
                    items={listGroups}
                    onValueChange={(value) => {
                      setGroupId(value);
                    }}
                  >
                    <SelectTrigger
                      aria-invalid={!isValidInput.isValidGroupId}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {listGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {!isValidInput.isValidGroupId && (
                    <FieldError>Please select a Group</FieldError>
                  )}
                </Field>

                {groupId === 2 ? (
                  <Field>
                    <FieldLabel>Verify</FieldLabel>
                    <Select
                      items={listStatusVerify}
                      onValueChange={(value) => {
                        setStatusVerify(value);
                      }}
                      value={statusVerify}
                    >
                      <SelectTrigger
                        aria-invalid={!isValidInput.isValidStatusVerify}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select status verify" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {listStatusVerify.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                ) : null}
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

export default DialogCreateUser;
