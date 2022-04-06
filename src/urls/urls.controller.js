const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

// List all urls 
function list(req, res) {
  res.json({ data: urls })
}

//Check if there is valid url inputed from the request body
function bodyHashrefProperty(req, res, next) {
  const { data: { href } = {} } = req.body;
  if (href) return next();
  next({
    status: 400,
    message: "A 'href' property is required."
  })
}

//Get the max id from the urls data 
let maxUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

//Create a new url object with id and href and push into the urls data 
function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    href,
    id: ++maxUsesId,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

//Checks if there is a matched url if not return 404
function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  
  if (foundUrl) {
    res.locals.url = foundUrl
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`
  })
}

//Get the matched url from urls data 
let maxUsesId = uses.reduce((currMaxId, use) => Math.max(currMaxId, use.id), 0);

const read = (req, res) => {
  const url = res.locals.url;
  const newUse = {
    id: ++maxUsesId,
    urlId: url.id,
    time: Date.now(),
  }
  uses.push(newUse);
  res.json({ data: url });
}

const update = (req, res) => {
  const url = res.locals.url;
  const { data: { href } = {} } = req.body;
  url.href = href;
  res.json({ data: url });
}

module.exports = {
  list,
  urlExists,
  create: [bodyHashrefProperty, create],
  read: [urlExists, read],
  update: [urlExists, bodyHashrefProperty, update],
}
