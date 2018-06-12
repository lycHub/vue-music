<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getCdInfo} from 'api/recommendService'
  import {createSong} from 'common/js/song'

  export default {
    name: 'disc',
    components: {
      MusicList
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      const ret = []
      getCdInfo.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      console.log(ret)
      this.songs = ret
    },
    computed: {
      title() {
        return this.disc.songListDesc
      },
      bgImage() {
        return this.disc.picUrl
      },
      ...mapGetters(['disc'])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
