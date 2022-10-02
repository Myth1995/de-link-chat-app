const router = require("express").Router();
const {
  accessChat: accessDiscussion,
  fetchDiscussions,
  createDiscussionChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
} = require("../controllers/discussionControllers");
const auth = require("../middleware/authMiddleware");

router.route("/").post(auth, accessDiscussion).get(auth, fetchDiscussions);

router.route("/team").post(auth, createDiscussionChat);

router.route("/grouprename").put(auth, renameGroup);

router.route("/groupremove").put(auth, removeFromGroup);

router.route("/groupadd").put(auth, addToGroup);

router.route("/deletegroup").put(auth, deleteGroup);

module.exports = router;
