<template>
  <scroll ref="suggest" class="suggest" :dataList="result" :pullup="true" @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  <!--  <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>-->
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {searchList} from 'api/search'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    components: {
      scroll: Scroll
    },
    data() {
      return {
        page: 1,
        hasMore: true,   // 尚未加载完
        result: []
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: { // 是否检索歌手
        type: Boolean,
        default: true
      }
    },
    methods: {
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        searchList({
          w:this.query,
          catZhida:this.showSinger ? 1 : 0,
          p:this.page,
          perpage: perpage,
          n: perpage
        }, 'SearchJsonCallback').then(res => {
          this.result = this._genResult(res)
          this.hasMore = this._checkmore(res)
          // console.log(this.hasMore);
        })
      },
      _checkmore(data) {
        const song = data.song
        return song.list.length && (song.curnum + song.curpage * perpage) <= song.totalnum
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        const ret = []
        // console.log(list);
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) ret.push(createSong(musicData))
        })
        return ret
      },
      getIconCls(item) {
        return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },

      // 上啦加载更多
      searchMore() {
        if (!this.hasMore) return
        console.log(1);
        this.page++
        searchList({
          w:this.query,
          catZhida:this.showSinger ? 1 : 0,
          p:this.page,
          perpage: perpage,
          n: perpage
        }, 'SearchJsonCallback').then(res => {
          this.result = this.result.concat(this._genResult(res))
          this.hasMore = this._checkmore(res)
        })
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: '/search/' + singer.id
          })
          this.setSinger(singer)
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
