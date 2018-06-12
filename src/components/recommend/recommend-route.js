const Recommend = () => import('components/recommend/recommend')
const Disc = () => import('components/disc/disc')

export default {
  path: '/recommend',
  name: 'recommend',
  component: Recommend,
  children: [{
    path: ':id',
    name: 'disc',
    component: Disc
  }]
}
