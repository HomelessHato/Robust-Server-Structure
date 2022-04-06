const uses = require("../data/uses-data");

//List all the uses 
function list(req, res) {
  const { urlId } = req.params;
  const byResult = urlId ? use => use.urlId === Number(urlId) : () => true;
  res.json({ data: uses.filter(byResult) })
}

//Check if matched use exists
function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    res.locals.use = foundUse;
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${useId}`
  });
}

//Get the matched use 
function read(req, res, next) {
  res.json({ data: res.locals.use });
}

function destory(req, res, next) {
  const { useId } = req.params;
  const indexToDeleteFrom = uses.findIndex((use) => use.id === Number(useId));
  uses.splice(indexToDeleteFrom, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [useExists, read],
  delete: [useExists, destory],
  useExists,
}