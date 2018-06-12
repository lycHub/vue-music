import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// action常用于处理多个mutation操作或异步任务
// 默认会有一个和store实例用于相同方法属性的参数对象context,可以用commit,state等方法和属性
export const selectPlay = function ({state, commit}, {songList, index}) {
  commit(types.SET_SEQUENCE_LIST, songList)

  if (state.mode === playMode.random) {
    const randomlist = shuffle(songList)
    commit(types.SET_PLAYLIST, randomlist)

    // 顺序列表的歌对应到随机列表中的索引
    index = fundIndex(randomlist, songList[index])
  } else {
    commit(types.SET_PLAYLIST, songList)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}


export const randomPlay = function ({commit}, {songList}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, songList)

  const randomlist = shuffle(songList)
  commit(types.SET_PLAYLIST, randomlist)

  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}


function fundIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}
