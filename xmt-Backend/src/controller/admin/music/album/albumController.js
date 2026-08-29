import {
  getAlbumOptionWithIdOrNot,
  getListAlbum,
  getAlbumWithId,
  createNewAlbum,
  updateAlbum,
  deleteAlbum,
} from "../../../../service/admin/music/album/albumService";

const handleAlbumOptionWithIdOrNot = async (req, res) => {
  try {
    let id = req.query.id || null;

    let data = await getAlbumOptionWithIdOrNot(id);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -1,
      DT: "",
    });
  }
};

const handleGetListAlbums = async (req, res) => {
  try {
    const sort = req.query.sort || "";
    const keySearch = req.query.keySearch || null;

    let data = await getListAlbum(sort, keySearch);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleGetAlbumWithId = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      return res.status(400).json({
        EM: "Missing required data...",
        EC: -1,
        DT: req.query,
      });
    }

    let data = await getAlbumWithId(id);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleCreateNewAlbum = async (req, res) => {
  try {
    const { title, cover, ownerId, songId, releaseDate } = req.body;

    if (!title || !ownerId || (releaseDate && !songId)) {
      return res.status(400).json({
        EM: "Missing required parameters controller", //error message
        EC: 0, //error code
        DT: req.body,
      });
    }

    const coverFile = req.file;

    const coverPath = coverFile
      ? `uploads/album/cover/${coverFile.filename}`
      : null;

    let data = await createNewAlbum({
      title,
      cover: coverPath,
      ownerId,
      songId,
      releaseDate,
    });

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
    });
  }
};

const handleUpdateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;

    const { title, cover, ownerId, songId, releaseDate } = req.body;

    let coverFile = null;
    let coverPath = null;

    if (req.file) {
      coverFile = req.file;
    }

    if (coverFile) {
      coverPath = `uploads/album/cover/${coverFile.filename}`;
    }

    if (!title || !ownerId || (releaseDate && !songId)) {
      return res.status(400).json({
        EM: "Missing required parameters controller", //error message
        EC: 0, //error code
        DT: req.body,
      });
    }

    let data = await updateAlbum(albumId, {
      title,
      hasNewCover: !!coverFile,
      cover: coverPath,
      ownerId,
      songId,
      releaseDate,
    });

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleDeleteAlbum = async (req, res) => {
  try {
    let id = req.params.id;

    let data = await deleteAlbum(id);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

export {
  handleAlbumOptionWithIdOrNot,
  handleGetAlbumWithId,
  handleGetListAlbums,
  handleCreateNewAlbum,
  handleUpdateAlbum,
  handleDeleteAlbum,
};
