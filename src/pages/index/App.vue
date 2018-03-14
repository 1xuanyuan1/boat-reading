<template>
  <wxc-tab-bar :tab-titles="tabTitles"
               :tab-styles="tabStyles"
               title-type="icon"
               :tab-page-height="tabPageHeight"
               @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <!-- 第一个页面内容-->
    <div class="item-container" :style="contentStyle">
      <bookcase></bookcase>
    </div>

    <!-- 第二个页面内容-->
    <div class="item-container" :style="contentStyle">
      <recommend></recommend>
    </div>
    
    <!-- 第三个页面内容-->
    <div class="item-container" :style="contentStyle">
      <search></search>
    </div>
  </wxc-tab-bar>
</template>
<script>
  import { WxcTabBar, Utils } from 'weex-ui';
  import api from '../../service'
  import Config from './config'
  import Bookcase from 'c/Bookcase.vue'
  import Recommend from 'c/Recommend.vue'
  import Search from 'c/Search.vue'
  export default {
    components: { WxcTabBar, Bookcase, Recommend, Search },
    data: () => ({
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      titles: ['书架', '推荐', '搜索']
    }),
    computed: {
      data () {
        return this.recommend.slice(0, this.page * this.pageSize)
      }
    },
    created () {
      const tabPageHeight = Utils.env.getPageHeight();
      // 如果页面没有导航栏，可以用下面这个计算高度的方法
      // const tabPageHeight = env.deviceHeight / env.deviceWidth * 750;
      const { tabStyles } = this;
      console.log(tabPageHeight)
      this.contentStyle = { height: (tabPageHeight - tabStyles.height) + 'px' };
      this.setTitle(this.titles[0])
    },
    methods: {
      wxcTabBarCurrentTabSelected (e) {
        const index = e.page;
        this.setTitle(this.titles[index])
        // console.log(index);
      }
    },
  };
</script>
<style scoped>
.no-data{
  flex: 1;
  justify-content: center;
  align-items: center;
}
.item-container {
  width: 750px;
  background-color: #f2f3f4;
  overflow: scroll;
}
.wrapper {
padding-bottom: 80px;
}
.scroller {
  width: 750px;
}
.row {
  flex-direction: row;
  height: 150px;
  padding: 20px;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #DDDDDD;
}
.image{
  width: 80px;
  height: 120px;
  margin-right: 20px;
}
.text {
  font-size: 45px;
  color: #666666;
}
.group {
  flex-direction: row;
  justify-content: center;
  margin-top: 60px;
}
.button {
  width: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 40px;
  margin-left: 30px;
  margin-right: 30px;
  text-align: center;
  color: #41B883;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(162, 217, 192);
  background-color: rgba(162, 217, 192, 0.2);
}
</style>