export const checkArtist = (req, res, next) => {
  let groupId = req.user.groupWithRoles?.id;

  console.log(">>>check groupId: ", req.user.groupWithRoles?.id);

  if (groupId !== 2 || groupId !== 1) {
    return res.status(403).json({
      EC: -1,
      EM: `You are not Artist`,
    });
  }

  next();
};
