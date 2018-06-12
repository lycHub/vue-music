<template>
  <div class="singer" ref="singer">
    <list-view :dataList="singers" v-on:select="gotoDetail" ref="listview"></list-view>
    <router-view></router-view>
  </div>

</template>

<script>
  import {getSingers} from 'api/singerService'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  export default{
    name: 'singer',
    mixins: [playListMixin],
    components: {
      'list-view': ListView
    },
    data() {
      return {
        singers: []
      }
    },
    created() {
      getSingers('https://c.y.qq.com/v8/fcg-bin/v8.fcg', {
        channel:'singer',
        page:'list',
        key:'all_all_all',
        pagesize:100,
        pagenum:1,
        g_tk:5381,
        loginUin:0,
        hostUin:0,
        format:'jsonp',
        inCharset:'utf8',
        outCharset:'utf-8',
        notice:0,
        platform:'yqq',
        jsonpCallback:'GetSingerListCallback',
        needNewCode:0
      }, 'GetSingerListCallback').then(res => {
        this.singers = this._normalizeSinger(res)
      })
    },

    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.listview.refresh()
      },

        // 提取页面需要的数据并格式化
      _normalizeSinger(list) {
        const map = {
          hot: {
            title: '热门',
            items: []
          }
        }

        list.forEach((item, index) => {
          if (index < 10) map.hot.items.push(new Singer(item.Fsinger_mid, item.Fother_name))

          // 拿到字母
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer(item.Fsinger_mid, item.Fother_name))
        })

        // 字母排序，置顶热门
        const hot = []
        const ret = []

        for (const key in map) {
          const val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === '热门') {
            hot.push(val)
          }
        }

        ret.sort(function (a, b) {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        return hot.concat(ret)
      },
      gotoDetail(singer) {
        this.$router.push({path: '/singer/' + singer.mid})

        // 此处相当于调用：this.$store.commit('SET_SINGER')，通过mutation改变state中的singer属性
        this.setSinger(singer)
      },

      // 挂载mutations中的方法
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
