<template>
  <div id="app">
    <my-header></my-header>
    <tabs></tabs>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default{
    components: {
      'myHeader': Header,
      'tabs': Tab,
      'player': Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
