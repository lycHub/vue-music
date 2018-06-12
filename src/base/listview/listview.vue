<template>
  <scroll class="listview"
  :listenScroll="true"
  :dataList="dataList"
  :probeType="3"
  @scroll="onScroll"
  ref='listview'>
    <ul>
      <li v-for="group in dataList" :key="group.title" class="list-group" ref='listGroup'>
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.mid"  @click="gotoDetail(item)" class="list-group-item">
            <img v-lazy="item.pic" :alt="item.name" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!--右侧字母-->

    <div class="list-shortcut" @touchstart='onShortCutTouchStart' @touchmove.stop.prevent='onShortCutTouchMove'>
      <ul>
        <li class="item" v-for="(item, index) in shortCutList" :data-index='index' :class="{current: currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'

  // 右侧字母导航每个字母的height
  const HEIGHT = 18;


  export default {
    name: 'listview',
    created(){
      // 保存touchStart的位置，用于共享于touchmove,求出滑动的距离
      // 也可以在data中声明这个变量，但是这个变量并不需要监听变化，所以不必在data或props中声明
      this.touch = {};

      // 每一组歌手(按字母分组)的offsetHeight数组
      this.listHeight = null;
    },
    data(){
      return {
        // 保存实时滚动的位置
        scrollY: null,

        // 当前滚动到的索引，用于高亮
        currentIndex: 0,

        // 每一个title的上线 - scrollY
        diff: -1
      }
    },
    props: {
      dataList: {
        type: Array,
        default: []
      }
    },
    components: {
      scroll: Scroll
    },
    computed: {
      // 右侧字母集合
      shortCutList() {
        return this.dataList.map(group => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return '';
        }
        return this.dataList[this.currentIndex] ? this.dataList[this.currentIndex].title : '';
      },
      refresh() {
        this.refs.listview.refresh()
      }
    },

    watch: {
      // 当dataList变化时重新计算高度
      dataList(){
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      scrollY(newY){
        const listHeight = this.listHeight;

        if (newY > 0) {
          this.currentIndex = 0;
          return
        }

        // 只要scrollY的高度在某一group之间，就高亮那个字母

        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          const upperHeight = listHeight[i];    // 上线
          const lowerHeight = listHeight[i + 1]; // 下限

          if (-newY >= upperHeight && -newY < lowerHeight) {
            this.currentIndex = i;
            this.diff = lowerHeight + newY;
            return;
          }
        }

        // 当滚动底部，且-newY > 最后一个group的上限
        // 因为listHeight比group多一个，所以减2
        this.currentIndex = listHeight.length - 2;
      },
      diff(newVal) {
        const fixedTop = (newVal > 0 && newVal <= 30) ? newVal - 30 : 0;
        if (this.fixedTop === fixedTop) return;
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translated3d(0, ${fixedTop}, 0)`;
      }
    },

    methods: {
      onShortCutTouchStart(evt){
        // 获取字母索引
       const anchorIndex = Number.parseInt(evt.target.dataset.index);

       // 按下的位置
       this.touch.y1 = evt.touches[0].pageY;

       // 按下的字母索引
       this.touch.anchorIndex = anchorIndex;

        this._scrollTo(anchorIndex)
      },
      onShortCutTouchMove(evt){
        // 滑动的位置
        this.touch.y2 = evt.touches[0].pageY;

        // 滑动的距离
        const dixY =  this.touch.y2 -  this.touch.y1;

        // 经过了几个字母
        const delta = Math.floor(dixY / HEIGHT);

        // 移动到了第几个字母
        const anchorIndex = this.touch.anchorIndex + delta;

        console.log(anchorIndex);

        this._scrollTo(anchorIndex)
      },

      // scroll组件发射的滚动事件
      onScroll(pos){
        this.scrollY = pos.y;
        // console.log(this.scrollY);
      },

      // 计算并保存每一段(group)offsetHeight
      _calculateHeight(){
        let height = 0;
        this.listHeight = [height];
        const listGroup = this.$refs.listGroup;

        for(let i = 0; i < listGroup.length; i++) {
          height += listGroup[i].offsetHeight;
          this.listHeight.push(height);
        }
      },

      _scrollTo(index) {
        if (!index && index !== 0) return;

        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }

        this.scrollY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },

      // 进入详情页
      gotoDetail(index) {
        this.$emit('select', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
