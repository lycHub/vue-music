import {playMode} from 'common/js/config'

const state = {
  singer: {},
  disc: {},             // 歌单
  topList: {},          // 排行榜
  playing: false,       // 播放器的播放状态
  fullScreen: false,    // 播放器是否展开
  playList: [],         // 播放列表
  sequenceList: [],     // 不同播放模式的歌曲列表
  mode: playMode.sequence,     // 播放模式
  currentIndex: -1      // 当前播放歌曲的索引
}

export default state
