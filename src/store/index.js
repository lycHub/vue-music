import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

// 每当mutations修改了state时，就会输出一个修改日志
import createLogger from 'Vuex/dist/logger'

Vue.use(Vuex)

// 开发环境下开启调试，如果状态的改变不是来自mutations，就会报警告
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
