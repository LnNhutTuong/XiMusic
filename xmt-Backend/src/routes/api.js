import express from "express";

//========AUTH=========
import {
  handleRegister,
  handleLogin,
  handleLogout,
} from "../controller/admin/auth/authController";

//========MIDDLEWARE=========
import { checkJWT, checkPermission } from "../middleware/JWTAction";

import createUploadMiddleware from "../middleware/uploadMiddleware";

//================NOTIFICATION------------------
import {
  handleGetNotification,
  handleGetNotificationById,
  handelGetNotificationForAdmin,
  handleCreateNotification,
} from "../controller/notification/notificationController";

//========ADMIN=========
import { handleGetAllTotal } from "../controller/admin/dashboardController";

import { getAllGroup } from "../controller/admin/group/groupController";

import {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
  handleDelete,
  getUserAccount,
} from "../controller/admin/user/userController";

import {
  handleDeleteArtistProfile,
  handleGetAllArtistOption,
  handleUpdateRequest,
} from "../controller/admin/artist/artistController";

import {
  handleAlbumOptionWithIdOrNot,
  handleGetAlbumWithId,
  handleGetListAlbums,
  handleCreateNewAlbum,
  handleUpdateAlbum,
  handleDeleteAlbum,
} from "../controller/admin/music/album/albumController";

import {
  handleGetAllGenre,
  handleGetGenreOption,
  handleCreateNewGenre,
  handleGetGenreWithId,
  handleUpdateGenre,
  handleDeleteGenre,
} from "../controller/admin/music/genre/genreController";

import {
  handleGetAllSongs,
  handleGetSongOptionWithIdOrNot,
  handleCreateNewSong,
  handleGetSongWithId,
  handleUpdateSong,
  handleDeleteSong,
} from "../controller/admin/music/song/songController";

//========public=========
import {
  handleGetAllSongsPublic,
  handleIncrementPlays,
} from "../controller/public/music/songController";

//========user=========
import {
  handleGetProfile,
  handleUpdateProfile,
  handleRequestArtistProfile,
  handleCancelRequestArtistProfile,
  handleEditRequestArtistProfile,
} from "../controller/user/profile/profileController";

import { handleGetArtistProfile } from "../controller/user/artist/artistController";

const router = express.Router(); // router cha

/**
 * @param {*} app: express app
 */

const initApiRoutes = (app) => {
  const publicRouter = express.Router(); // router con
  const adminRouter = express.Router(); // router con
  const userRouter = express.Router(); // router con

  //PUBLIC ROUTE
  //============AUTH==========
  //Account
  publicRouter.get("/account", checkJWT, getUserAccount);
  //Register
  publicRouter.post("/register", handleRegister);
  //Login
  publicRouter.post("/login", handleLogin);
  //Logout
  publicRouter.post("/logout", handleLogout);

  //============PUBLIC==========
  //artist

  //Song
  publicRouter.get("/song", handleGetAllSongsPublic);
  publicRouter.post("/song/:id/play", handleIncrementPlays);

  //notification
  publicRouter.get("/notification", handleGetNotification);
  publicRouter.get("/notification/:id", handleGetNotificationById);
  router.use(publicRouter);

  //OUTLINE

  //PRIVATE ROUTE
  //============ADMIN==========
  //middleware
  adminRouter.use(checkJWT);
  adminRouter.use(checkPermission);

  //Notifications
  adminRouter.get("/notification", handelGetNotificationForAdmin);
  adminRouter.post("/notification/create", handleCreateNotification);

  //Dashboard
  adminRouter.get("/dashboard", handleGetAllTotal);

  //User
  adminRouter.get("/user", getAllUser);
  adminRouter.post("/user/create", handleCreateNewUser);
  adminRouter.get("/user/:id", getUserWithId);
  adminRouter.put("/user/update/:id", handleUpdateUser);
  adminRouter.delete("/user/delete/:id", handleDelete);

  //Group
  adminRouter.get("/group", getAllGroup);

  //Artist
  adminRouter.get("/artist/option", handleGetAllArtistOption);
  adminRouter.delete("/artist-profile/delete/:id", handleDeleteArtistProfile);
  adminRouter.put("/artist-profile/update-request/:id", handleUpdateRequest);

  //Album
  const uploadAlbum = createUploadMiddleware("album");
  adminRouter.get("/album", handleGetListAlbums);
  adminRouter.get("/album/option", handleAlbumOptionWithIdOrNot);
  adminRouter.get("/album/:id", handleGetAlbumWithId);
  adminRouter.post(
    "/album/create",
    uploadAlbum.single("cover"),
    handleCreateNewAlbum,
  );
  adminRouter.put(
    "/album/update/:id",
    uploadAlbum.single("cover"),
    handleUpdateAlbum,
  );
  adminRouter.delete("/album/delete/:id", handleDeleteAlbum);

  //Genre
  const uploadGenre = createUploadMiddleware("genre");
  adminRouter.get("/genre", handleGetAllGenre);
  adminRouter.get("/genre/option", handleGetGenreOption);
  adminRouter.post(
    "/genre/create",
    uploadGenre.single("icon"),
    handleCreateNewGenre,
  );
  adminRouter.get("/genre/:id", handleGetGenreWithId);
  adminRouter.put(
    "/genre/update/:id",
    uploadGenre.single("icon"),
    handleUpdateGenre,
  );
  adminRouter.delete("/genre/delete/:id", handleDeleteGenre);

  //Song
  const uploadSong = createUploadMiddleware("song");
  adminRouter.get("/song", handleGetAllSongs);
  adminRouter.get("/song/option", handleGetSongOptionWithIdOrNot);
  adminRouter.get("/song/:id", handleGetSongWithId);
  adminRouter.post(
    "/song/create",
    uploadSong.fields([
      { name: "cover", maxCount: 1 },
      { name: "audioUrl", maxCount: 1 },
    ]),
    handleCreateNewSong,
  );
  adminRouter.put(
    "/song/update/:id",
    uploadSong.fields([
      { name: "cover", maxCount: 1 },
      { name: "audioUrl", maxCount: 1 },
    ]),
    handleUpdateSong,
  );
  adminRouter.delete("/song/delete/:id", handleDeleteSong);

  router.use("/admin", adminRouter);

  //============USER===================
  //middleware
  userRouter.use(checkJWT);
  userRouter.use(checkPermission);

  const uploadUser = createUploadMiddleware("user");

  userRouter.get("/profile", handleGetProfile);
  userRouter.put(
    "/profile/update/:id",
    uploadUser.single("avatar"),
    handleUpdateProfile,
  );

  userRouter.post("/artist-profile/request", handleRequestArtistProfile);
  userRouter.put(
    "/artist-profile/edit-request",
    handleEditRequestArtistProfile,
  );
  userRouter.delete(
    "/artist-profile/cancel-request",
    handleCancelRequestArtistProfile,
  );

  //Artist
  userRouter.get("/artist-profile/:id", handleGetArtistProfile);

  router.use("/user", userRouter);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
