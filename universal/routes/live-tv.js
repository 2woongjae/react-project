import BasicLayout from '../component/layout/BasicLayout';
import LiveTvContainer from '../component/pages/live-tv/LiveTvContainer';
import LiveTvOverview from '../component/pages/live-tv/LiveTvOverview';
import LiveTvClips from '../component/pages/live-tv/LiveTvClips';
import LiveTvRelated from '../component/pages/live-tv/LiveTvRelated';

export default {
  path: '/live-tv',
  component: BasicLayout,
  indexRoute: {
    component: LiveTvContainer
  },
  childRoutes: [
    {
      path: ':liveTvId/overview',
      component: LiveTvOverview
    },
    {
      path: ':liveTvId/clips',
      component: LiveTvClips
    },
    {
      path: ':liveTvId/related',
      component: LiveTvRelated
    },
    {
      path: 'add',
      component: LiveTvOverview
    }
  ]
};
