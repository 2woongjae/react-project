import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import isemail from 'isemail';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.js';
import api from './server/api/index';
import config, { server } from './server/config';

mongoose.Promise = bluebird;
mongoose.connect(config.dbUri, config.dbOptions, error => {
  
  if(error) console.error(error);

});

const isDeveloping = !(process.env.NODE_ENV || '').includes('production');
export const app = express();

app.use(cors())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .use(expressValidator({
     customValidators: {
       isArray: value => Array.isArray(value),
       isEmail: value => isemail.validate(value)
     }
   }))
   .use('/docs', express.static(path.join(__dirname, '..', '/public')))
   .use('/api', api);

if (isDeveloping) {

  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res) => {

    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'dist/index.html')));
    res.end();

  });

} else {

  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, '..', 'dist/index.html'));

  });

}

app.listen(server.port, (error) => {

  if (error) console.error(error);

  console.info(`Listening on port ${server.port}. Open up http://0.0.0.0:${server.port} in your browser.`);

});
