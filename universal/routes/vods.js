import BasicLayout from '../component/layout/BasicLayout';
import VodContainer from '../component/pages/vods/VodContainer';
import VodOverview from '../component/pages/vods/VodOverview';
import VodClips from '../component/pages/vods/VodClips';
import VodRelated from '../component/pages/vods/VodRelated';

export default {
  path: '/vods',
  component: BasicLayout,
  indexRoute: {
    component: VodContainer
  },
  childRoutes: [
    {
      path: ':vodId/overview',
      component: VodOverview
    },
    {
      path: ':vodId/clips',
      component: VodClips
    },
    {
      path: ':vodId/related',
      component: VodRelated
    },
    {
      path: 'add',
      component: VodOverview
    }
  ]
};
