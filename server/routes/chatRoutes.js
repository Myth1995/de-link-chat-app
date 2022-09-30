const router = require("express").Router();
const {
  accessChat,
  fetchChats,
  createTeamChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
} = require("../controllers/chatControllers");
const auth = require("../middleware/authMiddleware");

router.route("/").post(auth, accessChat).get(auth, fetchChats);

router.route("/team").post(auth, createTeamChat);

router.route("/grouprename").put(auth, renameGroup);

router.route("/groupremove").put(auth, removeFromGroup);

router.route("/groupadd").put(auth, addToGroup);

router.route("/deletegroup").put(auth, deleteGroup);

module.exports = router;
