<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <div class="dot" v-for="(item, index) in dots" :class="{active: currentIndex === index}"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default{
    name: 'slider',
    data() {
      return {
        dots: null,
        currentIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    created() {

    },
    mounted() {
      setTimeout(() => {
        this._getSliderWidth()
        this.dots = new Array(this.sliderChildren.length)
        this._initSlider()

        if (this.autoplay) {
          let pageIndex = this.currentPageIndex + 1
          if (this.loop) pageIndex += 1
          this.timer = setTimeout(() => {
            this.slider.goToPage(pageIndex, 0, 400)
          }, this.interval)
        }
      }, 20)
    },

    methods: {
        // 初始化slider
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) pageIndex -= 1
          this.currentPageIndex = pageIndex

          if (this.autoplay) {
            clearTimeout(this.timer);
            let pageIndex = this.currentPageIndex + 1
            if (this.loop) pageIndex += 1
            this.timer = setTimeout(() => {
              this.slider.goToPage(pageIndex, 0, 400)
            }, this.interval)
          }
        })
      },

      // 计算slider宽度
      _getSliderWidth() {
        // 获取item  dom数组(因为是循环)

        this.sliderChildren = this.$refs.sliderGroup.children
        // console.log(this.sliderChildren);

        // 父容器的宽度
        const sliderWidth = this.$refs.slider.clientWidth

        // group宽度(相当于以前轮播的ul)
        let groupWidth = 0

        for (let a = 0; a < this.sliderChildren.length; a++) {
          const child = this.sliderChildren[a]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          groupWidth += sliderWidth
        }

        if (this.loop) {
          groupWidth += 2 * sliderWidth
        }

        this.$refs.sliderGroup.style.width = groupWidth + 'px'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
