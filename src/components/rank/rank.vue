<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :dataList="topList" ref="topList">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songList">
            <li class="song" v-for="(song, index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRank} from 'api/rank'
  import scroll from 'base/scroll/scroll'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default{
    name: 'rank',
    components: {
      scroll
    },
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      getRank('https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg', {
        g_tk:1395941932,
        uin:1120805364,
        format:'jsonp',
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        _:1525178220801
      }, 'MusicJsonCallback').then(res => this.topList = res)
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.topList.refresh()
      },
      selectItem(item) {
        this.setTopList(item)
        this.$router.push({path: `/rank/${item.id}`})
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
