import {
  getAllSongs,
  getSongOptionWithIdOrNot,
  createNewSong,
  getSongWithId,
  updateSong,
  deleteSong,
} from "../../../../service/admin/music/song/songService";

const handleGetAllSongs = async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    const genreId = req.query.genreId || null;
    const keySearch = req.query.keySearch || "";

    if (!page || !limit) {
      return {
        EM: "Missing required parameters", //error message
        EC: 0, //error code
      };
    }

    let data = await getAllSongs(page, limit, genreId, keySearch);

    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleGetSongOptionWithIdOrNot = async (req, res) => {
  try {
    const id = req.query.id || null;

    const data = await getSongOptionWithIdOrNot(id);

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

const handleCreateNewSong = async (req, res) => {
  try {
    const {
      title,
      duration,
      lyrics,
      status,
      genreId,
      ownerId,
      albumId,
      featureId,
    } = req.body;

    const coverFile = req.files?.cover?.[0];
    const audioFile = req.files?.audioUrl?.[0];

    const coverPath = coverFile
      ? `uploads/song/cover/${coverFile.filename}`
      : null;

    const audioPath = audioFile
      ? `uploads/song/audioUrl/${audioFile.filename}`
      : null;

    if (!title || !status || !duration || !ownerId || genreId.length < 0) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.body, //data
      });
    }

    if (!coverFile || !audioFile) {
      return await res.status(400).json({
        EM: "Missing required file data", //error message
        EC: -1, //error code
        DT: req.files, //data
      });
    }

    let data = await createNewSong({
      title,
      duration,
      lyrics,
      status,
      genreId,
      ownerId,
      albumId,
      cover: coverPath,
      audioUrl: audioPath,
      featureId,
    });
    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleGetSongWithId = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return await res.status(400).json({
        EM: "Missing required parameter", //error message
        EC: -1, //error code
        DT: "", //data
      });
    }

    let data = await getSongWithId(id);

    return await res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller... abc" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleUpdateSong = async (req, res) => {
  console.log(">>>đã tới được đây");
  try {
    const songId = req.params.id;

    const {
      title,
      duration,
      lyrics,
      status,
      genreId,
      ownerId,
      albumId,
      featureId,
    } = req.body;

    let coverFile = null;
    let audioFile = null;

    if (req.files) {
      coverFile = req.files?.cover?.[0];
      audioFile = req.files?.audioUrl?.[0];
    }

    let coverPath = null;
    let audioUrlPath = null;

    if (coverFile) {
      coverPath = `uploads/song/cover/${coverFile.filename}`;
    }

    if (audioFile) {
      audioUrlPath = `uploads/song/audioUrl/${audioFile.filename}`;
    }

    if (!title || !status || !duration || !ownerId || genreId.length < 0) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.body, //data
      });
    }

    let data = await updateSong(songId, {
      title,
      duration,
      lyrics,
      status,
      genreId,
      ownerId,
      albumId,
      cover: coverPath,
      hasNewCover: !!coverFile,
      audioUrl: audioUrlPath,
      hasNewAudioUrl: !!audioFile,
      featureId,
    });

    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleDeleteSong = async (req, res) => {
  const songId = req.params.id;

  let data = await deleteSong(songId);

  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

export {
  handleGetAllSongs,
  handleGetSongOptionWithIdOrNot,
  handleCreateNewSong,
  handleGetSongWithId,
  handleUpdateSong,
  handleDeleteSong,
};
