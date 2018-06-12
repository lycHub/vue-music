import Vue from 'vue'
import Router from 'vue-router'
import recommendRoute from 'components/recommend/recommend-route'

// import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

// 懒加载
// const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singer-detail/singer-detail')
// const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')


export default new Router({
  routes: [
    {path: '/', redirect: { name: 'recommend' }},
    recommendRoute,
    // {
    //   path: '/recommend',
    //   name: 'recommend',
    //   component: Recommend,
    //   children: [{
    //     path: ':id',
    //     name: 'disc',
    //     component: Disc
    //   }]
    // },

    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [{
        path: ':id',
        name: 'singer-detail',
        component: SingerDetail
      }]
    },

    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'toplist',
          component: TopList
        }
      ]
    },

    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [{
        path: ':id',
        name: 'singer-detail',
        component: SingerDetail
      }]
    }
  ]
})
