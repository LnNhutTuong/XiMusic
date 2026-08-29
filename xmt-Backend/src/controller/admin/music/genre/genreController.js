import {
  getAllGenre,
  getGenreOption,
  createNewGenre,
  getGenreWithId,
  updateGenre,
  deleteGenre,
} from "../../../../service/admin/music/genre/genreService";

const handleGetAllGenre = async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    const sort = req.query.sort || null;
    const keySearch = req.query.keySearch || "";

    if (!page || !limit) {
      return {
        EM: "Missing required parameters", //error message
        EC: 0, //error code
      };
    }

    let data = await getAllGenre(page, limit, sort, keySearch);

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

const handleGetGenreOption = async (req, res) => {
  try {
    let data = await getGenreOption();
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

const handleCreateNewGenre = async (req, res) => {
  try {
    const { name, description } = req.body;
    const iconFile = req.file;
    const iconPath = iconFile
      ? `uploads/genre/icon/${iconFile.filename}`
      : null;

    if (!name || !description) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.body, //data
      });
    }

    let data = await createNewGenre({ name, description, icon: iconPath });
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

const handleGetGenreWithId = async (req, res) => {
  try {
    const genreId = req.params.id;

    if (!genreId) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.body, //data
      });
    }

    let data = await getGenreWithId(genreId);

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

const handleUpdateGenre = async (req, res) => {
  try {
    const genreId = req.params.id;

    const { name, description } = req.body;
    const iconFile = req.file;
    let iconPath = null;

    if (iconFile) {
      iconPath = `uploads/genre/icon/${iconFile.filename}`;
    }

    if (!name || !description) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.body, //data
      });
    }

    let data = await updateGenre(genreId, {
      name,
      description,
      icon: iconPath,
      hasNewIcon: !!iconFile,
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

const handleDeleteGenre = async (req, res) => {
  const genreId = req.params.id;

  let data = await deleteGenre(genreId);

  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

export {
  handleGetAllGenre,
  handleGetGenreOption,
  handleCreateNewGenre,
  handleGetGenreWithId,
  handleUpdateGenre,
  handleDeleteGenre,
};
