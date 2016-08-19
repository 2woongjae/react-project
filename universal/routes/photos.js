import BasicLayout from '../component/layout/BasicLayout';
import PhotoContainer from '../component/pages/photos/PhotoContainer';
import PhotoOverview from '../component/pages/photos/PhotoOverview';
import PhotoAlbum from '../component/pages/photos/PhotoAlbum';
import Photos from '../component/pages/photos/Photos';

export default {
  path: '/photo-album',
  component: BasicLayout,
  indexRoute: {
    component: PhotoContainer
  },
  childRoutes: [
    {
      path: ':albumId/overview',
      component: PhotoOverview
    },
    {
      path: ':albumId/photo',
      component: Photos
    },
    {
      path: 'add',
      component: PhotoOverview
    }
  ]
};
