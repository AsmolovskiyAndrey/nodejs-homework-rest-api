const {
  getPost,
  getPostById,
  addPost,
  changePostById,
  deletePostById,
} = require("../services/postService");

const getPostsController = async (req, res) => {
  const posts = await getPost();
  res.json({ posts });
};

const getPostByIdController = async (req, res) => {
  const id = req.params.id;
  const post = await getPostById(id);
  res.json({ post, status: "success find" });
};

const addPostController = async (req, res) => {
  const { topic, text } = req.body;
  await addPost({ topic, text });
  res.json({ status: "success add" });
};

const changePostController = async (req, res) => {
  const { topic, text } = req.body;
  const id = req.params.id;
  await changePostById(id, { topic, text });

  res.json({ status: "success change" });
};

const deletePostController = async (req, res) => {
  const id = req.params.id;
  await deletePostById(id);
  res.json({ status: "deleted" });
};

module.exports = {
  getPostsController,
  getPostByIdController,
  addPostController,
  changePostController,
  deletePostController,
};
