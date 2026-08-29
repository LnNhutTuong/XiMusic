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
import { useState, useEffect } from "react";
import { formatDate } from "@/utils/timeUtils";

export const DialogNotification = (props) => {
  const { show, setShow, notiData, setNotiData } = props;
  const [shake, setShake] = useState(0);
  const fy = {
    0: "bg-white",
    1: "bg-red-100 rotate-2",
    2: "bg-red-200 -rotate-2",
    3: "bg-red-300 rotate-4",
    4: "bg-red-400 -rotate-4",
    5: "bg-red-500 rotate-6",
    6: "bg-red-600 -rotate-6",
    7: "bg-red-700 rotate-8",
    8: "bg-red-800 -rotate-8",
    9: "bg-red-900 rotate-10",
  };
  const handleCloseDialog = () => {
    setShake(false);
    setNotiData(null);
    setShow(false);
  };

  useEffect(() => {
    if (shake >= 10) {
      handleCloseDialog();
    }
  }, [shake]);

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent
        className={`min-w-md max-h-[85vh] flex flex-col p-6 ${
          fy[Math.min(shake, 9)]
        }`}
        style={{
          transform: `scale(${1 + shake * 0.05})`,
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          setShake((prev) => prev + 1);
        }}
      >
        <DialogHeader>
          <DialogTitle className="!text-xl !pb-2 !border-b !border-black/20 flex justify-between">
            {notiData?.title}
            <span className="text-black/40">
              {formatDate(notiData?.createdAt)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto no-scrollbar my-4 max-h-[60vh] text-[16px] text-black">
          {notiData?.content}
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
