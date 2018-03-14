<template>
  <div class="footer">
    <a class="menu" v-for="(menu, key) in menus" :href="`/${key}.html`" :key="key" :ref="key">
      <text class="menu-label active-text" v-if="activeMenu === key">{{menu}}</text>
      <text class="menu-label" v-else>{{menu}}</text>
    </a>
  </div>
</template>
<script>
export default {
  name: 'footbar',
  props: {
    activeMenu: {
      type: String,
      default: 'index'
    }
  },
  data: () => ({
    menus: {
      index: '书架',
      recommend: '推荐',
      search: '搜索'
    }
  }),
  created () {
    this.setTitle(this.menus[this.activeMenu])
  }
}
</script>
<style scoped>
.footer {
  position: fixed;
  bottom: 0px;
  background: white;
  width: 750px;
  height: 80px;
  z-index: 10px;
  display: flex;
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #ccc;
  border-top-style: solid;
}
.menu {
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: white;
}
.menu-label{
  font-size: 30px;
}
.active-text{
  color: #15b6e4;
}
</style>


