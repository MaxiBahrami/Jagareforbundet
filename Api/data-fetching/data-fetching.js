import axios from 'axios';
import cheerio from 'cheerio';
import { db } from '../db.js';
import util from 'util';
import { urlConfig } from './urlConfig.js';
import  getText  from './get-text.js';
import selectRandomImage from './fetch-image.js';

const queryAsync = util.promisify(db.query).bind(db);

const fetchAndSaveNews = async (urlKey) => {
  try {
    const response = await axios.get(urlConfig[urlKey]);
    const $ = cheerio.load(response.data);

    const news_data = [];

    const news = $('div .newsItem');
    const category = urlKey.replace(/Url$/, ''); // Remove "Url" from the end of the urlKey

    for (const newsItem of news) {
      const heading = $(newsItem).find('h2 a').text();
      const link = $(newsItem).find('h2 a').attr('href');
      const NDate = $(newsItem).find('.info p').text();
      let existingPost = null;

      // Call the getText function to extract intro and text
      const { text,intro } = await getText(link);

      const urlImg = await selectRandomImage();
      const fkuid = 9; // admin id
      
      // Check if a post with the same title and description already exists
      existingPost = await queryAsync("SELECT * FROM posts WHERE `title` = ? AND `desc` = ?", [heading, intro]);

      if (existingPost && existingPost.length > 0) {
        console.log(`Post with title "${heading}" and description "${intro}" already exists. Skipping...`);
      } else {
        // Save the data to the database
        const insertQuery = "INSERT INTO posts (`title`, `desc`, `date`, `text`, `cat`, `img`, `uid`) VALUES (?)";
        const values = [heading, intro, NDate, text, category, urlImg, fkuid];
        await queryAsync(insertQuery, [values]);
        news_data.push({ heading, intro, NDate, text, category, urlImg, fkuid });
      }
    }

    console.log(`Number of news articles fetched: ${news_data.length}`);
    console.log('Sample articles:', news_data.slice(0, 5)); // Displaying the first 5 articles as a sample

  } catch (error) {
    console.error('Error fetching or saving news data:', error.message);
    console.error(error.stack); 
  }
}

export default fetchAndSaveNews;