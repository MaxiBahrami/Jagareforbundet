import { db } from "../db.js";
import jwt from "jsonwebtoken";
import util from "util";

const queryAsync = util.promisify(db.query).bind(db);

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
  const token = req.cookies.access_token ;
  if(!token) return res.status(401).json("Ej autentiserad!");

  jwt.verify(token,"jwtkey", (err, userInfo)=>{
    if(err) return res.status(403).json("Token är ogiltig!");

    const q = "INSERT INTO posts(`title`, `desc`, `text`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err,data)=>{
      if(err) return res.status(500).send(err);
      return res.json("Inlägget har uppdaterats")
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Ej autentiserad!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token är ogiltig!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(
      q,
      [postId, userInfo.id],
      (err,
      (data) => {
        if (err)
          return res.status(403).json("Du kan ta bort endast ditt inlägg!");

        return res.json("Inlägg har raderats!");
      })
    );
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token ;
  if(!token) return res.status(401).json("Ej autentiserad!");

  jwt.verify(token,"jwtkey", (err, userInfo)=>{
    if(err) return res.status(403).json("Token är ogiltig!");

    const postId = req.params.id;
    const q = "UPDATE posts SET `title`=?, `desc`=?,`text`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?"

    const values = [
      req.body.title,
      req.body.desc,
      req.body.text,
      req.body.img,
      req.body.cat,
    ]
    console.log("Update Post Values:", values);
    db.query(q, [...values,postId,userInfo.id], (err,data)=>{
      if(err) return res.status(500).send(err);
      return res.json("Inlägget har uppdaterats")
      
    })
  })
};
