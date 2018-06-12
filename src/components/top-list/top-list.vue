<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import MusicList from 'components/music-list/music-list'
  import {getRankDetail} from 'api/rank'
  import {createSong} from 'common/js/song'

  export default {
    name: 'toplist',
    components: {
      'music-list': MusicList
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      } else {
        getRankDetail('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg', {
          g_tk:949776619,
          uin:1120805364,
          format:'jsonp',
          inCharset:'utf-8',
          outCharset:'utf-8',
          notice:0,
          platform:'h5',
          needNewCode:1,
          tpl:3,
          page:'detail',
          type:'top',
          topid:this.toplist.id,
          jsonpCallback: 'RankJsonCallback',
          _:1525261264298
        }, 'RankJsonCallback').then(response => this.songs = this._normalizeSongs(response.songlist))
      }
    },
    computed: {
      title() {
        return this.toplist.topTitle
      },
      bgImage() {
        if (this.songs.length) return this.songs[0].image
      },
      ...mapGetters(['toplist'])
    },
    methods: {
      _normalizeSongs(list) {
        const ret = []
        list.forEach(item => {
          const musicData = item.data
         // console.log(musicData);
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        // console.log(ret);
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
