<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" ref="bgImage" :style="{'background-image': 'url(' + bgImage + ')'}">
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper">
        <div class="play" v-show="songs.length" ref="playBtn" @click="random">
          <i class="icon-play"></i><span class="text">随机播放</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data-list="songs" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import { mapActions } from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  export default {
    name: 'musicList',
    mixins: [playListMixin],
    components: {
      'scroll': Scroll,
      'song-list': SongList
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.offsetHeight
      this.minTranslateY = -this.imageHeight + 40
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    props: {
      bgImage: {
        type: String,
        default: '',
        required: true
      },
      songs: {
        type: Array,
        default: [],
        required: true
      },
      title: {
        type: String,
        default: '',
        required: true
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },

      // 点击某歌曲播放
      selectItem(song, index) {
        this.selectPlay({
          songList: this.songs,
          index
        })
      },

      random() {
        this.randomPlay({songList: this.songs})
      },

      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        // console.log(newY);
        let zIndex = 0
        let scale = null
        let blur = null
        const translateY = Math.max(this.minTranslateY, newY)
        this.$refs.layer.style.transform = `translate(0, ${translateY}px)`

        // 缩放比例
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) { // 下拉
          scale = 1 + percent
          zIndex = 1
        } else {
          blur = Math.min(20 * percent, 20)
        }

        if (newY < this.minTranslateY) {  // 滚动超过了限制
          zIndex = 1
          this.$refs.playBtn.style.display = 'none'
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = '40px'
        } else {
          this.$refs.playBtn.style.display = 'block'
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style.transform = `scale(${scale})`

        // filter模糊效果
        this.$refs.bgImage.childNodes[0].style['backdrop-filter'] = `blur(${blur}px)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      // z-index 1
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
