import { useContext, useEffect, useState } from "react";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Triangle } from "react-loader-spinner";

import { getNotificationsForAdmin } from "@/services/notification/notificationService";

const ListNotification = () => {
  const [ListNotification, setListNotification] = useState("");
  const [totalPage, setTotalPage] = useState([]);

  const handleGetNotificationForAdmin = async () => {
    let res = await getNotificationsForAdmin();

    if (res?.EC === 0) {
      setListNotification(res?.DT);
    } else {
      toast.error(res?.EM);
    }
  };

  useEffect(() => {
    handleGetNotificationForAdmin();
  }, []);

  // Refresh
  const [isRefresh, setIsRefresh] = useState(false);

  const handleRefresh = () => {
    setIsRefresh(true);
    handleGetNotificationForAdmin();

    setTimeout(() => {
      setIsRefresh(false);
    }, 3000);
  };

  return (
    <>
      {!isRefresh ? (
        <>
          <div className="list-user-container mx-10 my-5">
            <h1 className="text-xl font-bold">List Notifications</h1>
            <div className="flex flex-wrap items-end justify-between gap-6">
              {/* Left Actions */}
              <div className="flex items-center gap-3">
                <button
                  //   onClick={() => setDialogCreate(true)}
                  className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Create new notification
                </button>

                <button
                  onClick={handleRefresh}
                  className="rounded-lg bg-lime-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lime-600"
                >
                  Refresh
                </button>
              </div>

              {/* 
            
            */}

              {/* Right Filters */}
              <div className="flex items-end gap-4">
                <Field className="flex-1">
                  <FieldLabel>Group by</FieldLabel>
                  <Select
                  // value={group}
                  // item={groupOption}
                  // onValueChange={setGroup}
                  >
                    <SelectTrigger className="h-10 w-[180px]">
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">--- None ---</SelectItem>
                        {/* {groupOption.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))} */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="flex-1">
                  <FieldLabel>Sort by</FieldLabel>
                  <Select
                  // value={sort}
                  // item={sortOptions}
                  // onValueChange={setSort}
                  >
                    <SelectTrigger className="h-10 w-[180px]">
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">--- None ---</SelectItem>
                        {/* {sortOptions.map((sort) => (
                          <SelectItem key={sort.value} value={sort.value}>
                            {sort.label}
                          </SelectItem>
                        ))} */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="w-[320px]">
                  <FieldLabel>Search</FieldLabel>

                  <div className="relative">
                    <input
                      //   value={keySearch}
                      type="search"
                      placeholder="Nguoi trong tim..."
                      className="h-10 w-full rounded-lg border border-border bg-background pl-4 pr-20 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      //   onChange={(e) => {
                      //     setKeySearch(e.target.value);
                      //   }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base  h-[522px]">
              <table className="w-full text-sm text-left rtl:text-right text-body">
                <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 font-medium text-center"
                    >
                      Target
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Updated
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ListNotification ? (
                    ListNotification.map((noti) => (
                      <tr className="bg-neutral-primary border-b border-default">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                        >
                          {noti.id}
                        </th>
                        <td
                          className="px-6 py-4"
                          //   onClick={() => {
                          //     (setDialogDetailUser(true),
                          //       handleGetDataUser(user.id));
                          //   }}
                        >
                          <span className="rounded-xl relative hover:bottom-1 hover:cursor-pointer hover:underline">
                            {noti.title}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4"
                          //   onClick={() => {
                          //     (setDialogDetailUser(true),
                          //       handleGetDataUser(user.id));
                          //   }}
                        >
                          <span className="rounded-xl relative hover:bottom-1 hover:cursor-pointer hover:underline">
                            {noti.type}
                          </span>
                        </td>

                        <td
                          class={`flex justify-center items-center font-bold`}
                        >
                          <div
                            className={
                              `w-fit px-2 py-1 rounded-xl `
                              //   ${
                              //     noti.tagerType === "PUBLIC"
                              //       ? "bg-white"
                              //       : user.tagerType === "SYSTEM"
                              //         ? "bg-blue-600 relative hover:bg-blue-800 hover:cursor-pointer transition duration-300 hover:bottom-1"
                              //         : user.groupId === 3 &&
                              //             user.artistProfile !== null
                              //           ? "bg-yellow-500 relative hover:bg-yellow-700 hover:cursor-pointer transition duration-300 hover:bottom-1"
                              //           : user.group?.name === "Artist"
                              //             ? "bg-blue-700 relative hover:bottom-1 hover:bg-blue-900 hover:cursor-pointer transition duration-200 hover:bottom-1"
                              //             : "bg-white text-black"
                              //   }`
                              // onClick={
                              //   user.groupId === 2
                              //     ? async () => {
                              //         const data = await handleGetDataUser(
                              //           user.id,
                              //         );

                              //         if (data) {
                              //           setIsArtist(true);
                              //           setDialogArtistProfile(true);
                              //         }
                              //       }
                              //     : user.groupId === 3 &&
                              //         user?.artistProfile?.verified === 2
                              //       ? async () => {
                              //           const data = await handleGetDataUser(
                              //             user.id,
                              //           );

                              //           if (data) {
                              //             setIsRejected(true);
                              //             setDialogRequest(true);
                              //           }
                              //         }
                              //       : user.groupId === 3 &&
                              //           user.artistProfile !== null
                              //         ? async () => {
                              //             const data = await handleGetDataUser(
                              //               user.id,
                              //             );

                              //             if (data) {
                              //               setIsRequest(true);
                              //               setDialogRequest(true);
                              //             }
                              //           }
                              //         : undefined
                            }
                          >
                            {/* {user.groupId === 3 &&
                            user.artistProfile?.verified === 2
                              ? "Rejected"
                              : user.groupId === 3 &&
                                  user.artistProfile !== null
                                ? "Requested"
                                : user.group
                                  ? user.group.name.toUpperCase()
                                  : "No group"} */}
                            {noti.targetType}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {new Date(noti.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(noti.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 flex gap-2 ">
                          <Button
                            variant="warning"
                            // onClick={() => {
                            //   (setDialogDetailUser(true),
                            //     handleGetDataUser(user.id));
                            // }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            // onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </Button>
                          <Button
                          // onClick={() => {
                          //   handleSendMessage(user.id);
                          // }}
                          >
                            Send message
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>not found any user</>
                  )}
                </tbody>
              </table>
            </div>

            <div className="footer mt-5 text-center">
              <nav aria-label="Page navigation">
                <ul class="inline-flex -space-x-px">
                  <li>
                    <button
                      class="px-3 py-2 ml-0 leading-tight text-black bg-white border border-black rounded-l-lg hover:bg-gray-100 hover:text-black"
                      onClick={() => handlePageChange("prev")}
                    >
                      Previous
                    </button>
                  </li>
                  {totalPage.map((page) => (
                    <li key={page}>
                      <button
                        className={
                          page === +currentPage
                            ? "px-3 py-2 leading-tight text-white bg-black border border-black font-bold"
                            : "px-3 py-2 leading-tight text-black bg-white border border-black hover:bg-gray-100 hover:text-black"
                        }
                        onClick={() => {
                          handleChoosePageNumber(page);
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  <li>
                    <button
                      class="px-3 py-2 ml-0 leading-tight text-black bg-white border border-black rounded-r-lg hover:bg-gray-100 hover:text-black"
                      onClick={() => handlePageChange("next")}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full border">
          <Triangle
            visible={true}
            height="220"
            width="220"
            color="#ffffff"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <span className="text-xl font-bold">Waiting -_-</span>
        </div>
      )}
    </>
  );
};

export default ListNotification;
