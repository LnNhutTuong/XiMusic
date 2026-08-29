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

import { useEffect } from "react";

import { formatTimeProgress } from "@/utils/songUtils";

export const DialogCredits = (props) => {
  const { show, setShow, dataCredits } = props;

  useEffect(() => {
    setShow(false);
  }, [dataCredits]);

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          setShow(false);
        } else {
          setShow(true);
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-sm h-122 bg-white/5"
      >
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-[18px] font-bold uppercase tracking-wider text-white p-3s ">
              Credits
            </h2>
          </DialogTitle>
          <DialogDescription className="h-full mt-3 bg-black rounded-xl">
            <div className="space-y-1 text-sm bg-neutral-800/30 h-full p-3 rounded-xl overflow-hidden overflow-y-scroll scrollbar-none">
              <div className="flex flex-col justify-center text-lg">
                <span className="text-gray-300 ">Main Artist</span>
                <span className="font-medium text-white text-center ">
                  {dataCredits.owner}
                </span>
              </div>
              {dataCredits?.features?.length > 0 && (
                <div className="flex flex-col justify-center text-lg">
                  <span className="text-gray-300">Features</span>
                  <span className="font-medium text-gray-200 text-center">
                    {dataCredits.features
                      .map((feature) => feature.artistName)
                      .join(" | ")}
                  </span>
                </div>
              )}

              <div className="flex flex-col justify-center text-lg">
                <span className="text-gray-300">Release Date</span>
                <span className="font-medium text-gray-200 text-center">
                  {new Date(dataCredits.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
