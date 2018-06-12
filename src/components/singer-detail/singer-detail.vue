<template>
  <transition name="slide">
    <music-list :title="singer.name" :songs="songs" :bg-image="singer.pic"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSinger} from 'api/singerService'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    name: 'singer-detail',
    components: {
      'music-list': MusicList
    },
    created() {
      // state.singer带来的歌手数据
      // console.log(this.singer)
    },
    data() {
      return {
        songs: []
      }
    },

    methods: {
      setData (res) {
        this.songs = res
        // console.log(this.songs)
      }
    },

    // 获取state.singer数据并挂载到计算属性中
    computed: mapGetters(['singer']),


    beforeRouteEnter  (to, from, next) {
      if (!to.params.id) {
        alert('歌手不存在');
        next({path: '/singer'})
      } else {
        getSinger('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', {
          g_tk:1970757697,
          loginUin:1120805364,
          hostUin:0,
          format:'jsonp',
          inCharset:'utf8',
          outCharset:'utf-8',
          notice:0,
          platform:'yqq',
          needNewCode:0,
          singermid: to.params.id,
          order:'listen',
          begin:0,
          num:30,
          jsonpCallback:'MusicJsonCallbacksinger_track',
          songstatus:1
        }, 'MusicJsonCallbacksinger_track').then(res => {
         // console.log(res);
          next(vm => {
            const data = []
            res.forEach(item => {
              const {musicData} = item
              if (musicData.songid && musicData.albummid) data.push(createSong(musicData))
            })

            vm.setData(data)
          })
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }
</style>
