import * as express from 'express';
const router = express.Router();

router.get('/:name', (req, res, next) => {
  // Handles a missing template file gracefully.
  // Throws a 404 instead of a 500. Does not crash the server.
  res.render('templates/' + req.params.name, {}, (err, html) => {
    if (err) res.status(404).end();
    else res.send(html);
  });
});

export = router;
