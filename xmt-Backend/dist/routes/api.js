"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _authController = require("../controller/admin/auth/authController");
var _JWTAction = require("../middleware/JWTAction");
var _uploadMiddleware = _interopRequireDefault(require("../middleware/uploadMiddleware"));
var _notificationController = require("../controller/notification/notificationController");
var _dashboardController = require("../controller/admin/dashboardController");
var _groupController = require("../controller/admin/group/groupController");
var _userController = require("../controller/admin/user/userController");
var _artistController = require("../controller/admin/artist/artistController");
var _albumController = require("../controller/admin/music/album/albumController");
var _genreController = require("../controller/admin/music/genre/genreController");
var _songController = require("../controller/admin/music/song/songController");
var _songController2 = require("../controller/public/music/songController");
var _profileController = require("../controller/user/profile/profileController");
var _artistController2 = require("../controller/user/artist/artistController");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//========AUTH=========

//========MIDDLEWARE=========

//================NOTIFICATION------------------

//========ADMIN=========

//========public=========

//========user=========

const router = _express.default.Router(); // router cha

/**
 * @param {*} app: express app
 */

const initApiRoutes = app => {
  const publicRouter = _express.default.Router(); // router con
  const adminRouter = _express.default.Router(); // router con
  const userRouter = _express.default.Router(); // router con

  //PUBLIC ROUTE
  //============AUTH==========
  //Account
  publicRouter.get("/account", _JWTAction.checkJWT, _userController.getUserAccount);
  //Register
  publicRouter.post("/register", _authController.handleRegister);
  //Login
  publicRouter.post("/login", _authController.handleLogin);
  //Logout
  publicRouter.post("/logout", _authController.handleLogout);

  //============PUBLIC==========
  //artist

  //Song
  publicRouter.get("/song", _songController2.handleGetAllSongsPublic);
  publicRouter.post("/song/:id/play", _songController2.handleIncrementPlays);

  //notification
  publicRouter.get("/notification", _notificationController.handleGetNotification);
  publicRouter.get("/notification/:id", _notificationController.handleGetNotificationById);
  router.use(publicRouter);

  //OUTLINE

  //PRIVATE ROUTE
  //============ADMIN==========
  //middleware
  adminRouter.use(_JWTAction.checkJWT);
  adminRouter.use(_JWTAction.checkPermission);

  //Notifications
  adminRouter.get("/notification", _notificationController.handelGetNotificationForAdmin);
  adminRouter.post("/notification/create", _notificationController.handleCreateNotification);

  //Dashboard
  adminRouter.get("/dashboard", _dashboardController.handleGetAllTotal);

  //User
  adminRouter.get("/user", _userController.getAllUser);
  adminRouter.post("/user/create", _userController.handleCreateNewUser);
  adminRouter.get("/user/:id", _userController.getUserWithId);
  adminRouter.put("/user/update/:id", _userController.handleUpdateUser);
  adminRouter.delete("/user/delete/:id", _userController.handleDelete);

  //Group
  adminRouter.get("/group", _groupController.getAllGroup);

  //Artist
  adminRouter.get("/artist/option", _artistController.handleGetAllArtistOption);
  adminRouter.delete("/artist-profile/delete/:id", _artistController.handleDeleteArtistProfile);
  adminRouter.put("/artist-profile/update-request/:id", _artistController.handleUpdateRequest);

  //Album
  const uploadAlbum = (0, _uploadMiddleware.default)("album");
  adminRouter.get("/album", _albumController.handleGetListAlbums);
  adminRouter.get("/album/option", _albumController.handleAlbumOptionWithIdOrNot);
  adminRouter.get("/album/:id", _albumController.handleGetAlbumWithId);
  adminRouter.post("/album/create", uploadAlbum.single("cover"), _albumController.handleCreateNewAlbum);
  adminRouter.put("/album/update/:id", uploadAlbum.single("cover"), _albumController.handleUpdateAlbum);
  adminRouter.delete("/album/delete/:id", _albumController.handleDeleteAlbum);

  //Genre
  const uploadGenre = (0, _uploadMiddleware.default)("genre");
  adminRouter.get("/genre", _genreController.handleGetAllGenre);
  adminRouter.get("/genre/option", _genreController.handleGetGenreOption);
  adminRouter.post("/genre/create", uploadGenre.single("icon"), _genreController.handleCreateNewGenre);
  adminRouter.get("/genre/:id", _genreController.handleGetGenreWithId);
  adminRouter.put("/genre/update/:id", uploadGenre.single("icon"), _genreController.handleUpdateGenre);
  adminRouter.delete("/genre/delete/:id", _genreController.handleDeleteGenre);

  //Song
  const uploadSong = (0, _uploadMiddleware.default)("song");
  adminRouter.get("/song", _songController.handleGetAllSongs);
  adminRouter.get("/song/option", _songController.handleGetSongOptionWithIdOrNot);
  adminRouter.get("/song/:id", _songController.handleGetSongWithId);
  adminRouter.post("/song/create", uploadSong.fields([{
    name: "cover",
    maxCount: 1
  }, {
    name: "audioUrl",
    maxCount: 1
  }]), _songController.handleCreateNewSong);
  adminRouter.put("/song/update/:id", uploadSong.fields([{
    name: "cover",
    maxCount: 1
  }, {
    name: "audioUrl",
    maxCount: 1
  }]), _songController.handleUpdateSong);
  adminRouter.delete("/song/delete/:id", _songController.handleDeleteSong);
  router.use("/admin", adminRouter);

  //============USER===================
  //middleware
  userRouter.use(_JWTAction.checkJWT);
  userRouter.use(_JWTAction.checkPermission);
  const uploadUser = (0, _uploadMiddleware.default)("user");
  userRouter.get("/profile", _profileController.handleGetProfile);
  userRouter.put("/profile/update/:id", uploadUser.single("avatar"), _profileController.handleUpdateProfile);
  userRouter.post("/artist-profile/request", _profileController.handleRequestArtistProfile);
  userRouter.put("/artist-profile/edit-request", _profileController.handleEditRequestArtistProfile);
  userRouter.delete("/artist-profile/cancel-request", _profileController.handleCancelRequestArtistProfile);

  //Artist
  userRouter.get("/artist-profile/:id", _artistController2.handleGetArtistProfile);
  router.use("/user", userRouter);
  return app.use("/api/v1", router);
};
var _default = exports.default = initApiRoutes;