import { db } from "../db.js";

const selectRandomImage = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT `imgurl` FROM huntimage";

    db.query(q, (err, data) => {
      if (err) return reject(err);

      if (data.length === 0) {
        return reject("No images found");
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      const randomImage = data[randomIndex].imgurl;

      resolve(randomImage);
    });
  });
};

export default selectRandomImage;