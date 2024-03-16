import { db } from "../db.js";
import jwt from "jsonwebtoken";
// import util from "util";

// const queryAsync = util.promisify(db.query).bind(db);

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
    
  });
};

export const getPost = (req, res) => {
  const q =
    "Select p.id, `username`, `title`,`text`, `desc`, p.img, u.img AS userImage, `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = async (req, res) => {
  try {
    const q = "INSERT INTO posts(`title`, `desc`, `text`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
      req.body.date,
      req.userInfo.id, // Access user information from req.userInfo
    ];

    await db.query(q, [values]);

    return res.status(201).json("Inlägget har uppdaterats");
  } catch (error) {
    console.error("Error adding post:", error);
    return res.status(500).json(error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userInfo = req.userInfo; // Access user information from req.userInfo

    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
    const result = await db.query(q, [postId, userInfo.id]);

    if (result.affectedRows === 0) {
      return res.status(403).json("Du kan ta bort endast ditt inlägg!");
    }

    return res.json("Inlägg har raderats!");
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json(error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userInfo = req.userInfo; // Access user information from req.userInfo

    const q = "UPDATE posts SET `title`=?, `desc`=?,`text`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
    ];

    console.log("Update Post Values:", values);

    const result = await db.query(q, [...values, postId, userInfo.id]);

    if (result.affectedRows === 0) {
      return res.status(403).json("Du kan uppdatera endast ditt inlägg!");
    }

    return res.json("Inlägget har uppdaterats");
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json(error.message);
  }
};
