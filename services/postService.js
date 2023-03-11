/* eslint-disable no-undef */
const { Post } = require("../db/postModel");
const { WrongParametrError } = require("../helpers/errors");

const getPost = async () => {
  const posts = await Post.find({});
  return posts;
};

const getPostById = async (id, res) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new WrongParametrError(`No post with id ${id}`);
  }
  return post;
};

const addPost = async ({ topic, text }) => {
  const addPost = new Post({ topic, text });
  await addPost.save();
};

const changePostById = async (id, { topic, text }) => {
  await Post.findByIdAndUpdate(id, { $set: { topic, text } });
};

const deletePostById = async (id, res) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new WrongParametrError(`Delete imposibble - No post with id ${id}`);
  }

  await Post.findByIdAndRemove(id);
};

module.exports = {
  getPost,
  getPostById,
  addPost,
  changePostById,
  deletePostById,
};
