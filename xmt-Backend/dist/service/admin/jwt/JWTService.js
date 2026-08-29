"use strict";

var _index = _interopRequireDefault(require("../../../models/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getGroupWithRoles = async user => {
  let roles = await _index.default.Group.findOne({
    where: {
      id: user.groupId
    },
    attributes: ["id", "name", "description"],
    include: [{
      model: _index.default.Role,
      as: "roles",
      attributes: ["id", "url", "description"],
      through: {
        attributes: []
      }
    }]
  });
  return roles ? roles : {};
};
module.exports = {
  getGroupWithRoles
};