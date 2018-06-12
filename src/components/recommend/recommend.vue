<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :dataList="songList">
      <div>
        <div class="slider-wrapper" v-if="data_slider.length">
          <slider>
            <div v-for="item in data_slider">
              <a :href="item.linkUrl">
                <img @load="loadImg" :src="item.picUrl" :alt="item.id">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="song in songList" @click="selectItem(song)">
              <div class="icon">
                <img width="60" height="60" v-lazy="song.picUrl" :alt="song.id">
              </div>
              <div class="text">
                <h2 class="name">{{song.songListAuthor}}</h2>
                <p class="desc">{{song.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {recommendata} from 'api/data-model'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mame: 'recommend',
    mixins: [playListMixin],
    components: {
      slider: Slider,
      scroll: Scroll
    },
    data() {
      return {
        data_slider: null,
        distList: null,
        test: 1
      }
    },
    subscriptions () {
      // 使用 Rx 操作符声明式地映射至另一个属性
      return {
        aPlusOne: this.$watchAsObservable('test').map(a => test + 2)
      }
    },
    created() {
      this._getRecommend()
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },

      _getRecommend () {
        this.data_slider = recommendata.data.slider
        this.songList = recommendata.data.songList
       // console.log(this.songList);
      },

      loadImg() {
        if (!this.checked) {
          this.$refs.scroll.refresh()
          this.checked = true
        }
      },
      selectItem(item) {
        this.$router.push({path: `/recommend/${item.id}`})
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
