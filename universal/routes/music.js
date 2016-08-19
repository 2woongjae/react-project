import BasicLayout from '../component/layout/BasicLayout';
import MusicContainer from '../component/pages/music/MusicContainer';
import MusicOverview from '../component/pages/music/MusicOverview';
import MusicAlbum from '../component/pages/music/MusicAlbum';

export default {
  path: '/music',
  component: BasicLayout,
  indexRoute: {
    component: MusicContainer
  },
  childRoutes: [
    {
      path: ':musicId/overview',
      component: MusicOverview
    },
    {
      path: 'add',
      component: MusicOverview
    }
  ]
};

export const musicAlbum = {
  path: '/music-album/:album',
  component: BasicLayout,
  indexRoute: {
    component: MusicAlbum
  }
};
