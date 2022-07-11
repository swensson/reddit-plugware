import express from 'express';

export default class EntryPoint {
  public app: express.Application;

  constructor () {
    this.app = express();
    this.app.use(express.json());

    // Disable CORS
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
      res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    setTimeout(() => {
      this.app.use((err, req, res, next) => {
        if (!!err.statusCode) {
          res.status(err.statusCode).json(err.body || null);
        } else {
          res.status(500).json(err.toString());
        }
      });

      this.app.listen(8090);
    }, 0);
  }
};
