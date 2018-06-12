<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default{
    name: 'scroll',
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      dataList: {
        type: Array,
        default: null
      },
      listenScroll: { // 是否监听滚动事件
        type: Boolean,
        default: false
      },
      pullup: {       // 是否上拉加载
        type: Boolean,
        default: false
      }
    },

    mounted() {
      setTimeout(() => this._initScroll(), 20)
    },

    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) return

        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        const that = this
        if (this.listenScroll) {
          this.scroll.on('scroll', pos => that.$emit('scroll', pos))
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= this.scroll.maxScrollX + 50) {
              this.$emit('scrollToEnd')
            }
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },

    watch: {
      dataList() {
        // console.log(this.dataList)
        setTimeout(() => this.refresh(), 20)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
