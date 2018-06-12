<template>
  <div class="progress-bar" ref="progressBar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // handle宽度
  const progressBtnWidth = 16

  export default {
    name: 'progress',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        touch: {}
      }
    },

    create() {
      // 保存移动滑块时的数据
      // this.$set(this.touch, 'initiated', {})
      // this.touch = {initiated: false}
    },

    methods: {
      onClick(evt) {
        this.touch.initiated = true
        // this._offset(evt.offsetX)
        const offsetWidth = evt.pageX - this.$refs.progressBar.offsetLeft
        this._offset(offsetWidth)

        // 发射当前进度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
        this.touch.initiated = false
      },
      progressTouchStart(evt) {
        this.touch.initiated = true   // 表示触发了touchstart事件
        this.touch.startX = evt.touches[0].pageX    // 按下的位置
        this.touch.left = this.$refs.progress.clientWidth    // 进度条当前距离(px)
      },
      progressTouchMove(evt) {
        // 如果没有经过touchstart事件，就返回
        if (!this.touch.initiated) return

        // 滑动的距离
        const deltaX = evt.touches[0].pageX - this.touch.startX

        // 偏移距离并且不超过进度条的总宽度
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false

        // 发射当前进度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },

      // 处理偏移
      _offset(offsetWidth) {
        this.$refs.progress.style.width = offsetWidth + 'px'
        this.$refs.progressBtn.style.transform = `translateX(${offsetWidth}px)`
      }
    },

    watch: {
      percent(newVal) {
        if (newVal >= 0 && !this.touch.initiated) { // 防止和TouchMove的冲突
          // 进度条总宽度
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth

          // 偏移距离(px)  比例 * 宽度
          const offsetWidth = newVal * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
