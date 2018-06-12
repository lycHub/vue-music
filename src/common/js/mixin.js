import {mapGetters} from 'vuex'

// 组件中相同的方法数据会覆盖掉mixin中的
export const playListMixin = {
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  computed: {
    ...mapGetters(['playList'])
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('组件中必须实现handlePlaylist方法')
    }
  }
}
