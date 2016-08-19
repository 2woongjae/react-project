import AppContainer from '../container/AppContainer';
import home from './home';
import vods from './vods';
import liveTv from './live-tv';
import music, { musicAlbum } from './music';
import photos from './photos';

export default {
  component: AppContainer,
  childRoutes: [
    home,
    vods,
    liveTv,
    music,
    musicAlbum,
    photos
  ]
}
