<template>
  <div class="wrapper">
    <div class="no-data" v-if="data.length < 1">
      <text>没有数据</text>
    </div>
    <list class="list scroller" @loadmore="loadmore" loadmoreoffset="10" v-else>
      <refresh class="refresh" @refresh="getData" :display="isRefreshing ? 'show' : 'hide'">
        <text class="indicator">正在获取最新推荐 ...</text>
      </refresh>
      <cell class="cell" v-for="(item, index) in data" :key="`item-${index}`" :ref="`item-${index}`">
        <a class="row" :href="`book.html?id=${item._id}`">
          <image :src="getImageUrl(item.cover)" :ref="'image'+index" class="image" />
          <text class="title" :ref="`text-${index}`">{{item.title}}</text>
        </a>
      </cell>
    </list>
  </div>
</template>
<script>
import api from '../service'
export default {
  name: 'recommend',
  computed: {
    data () {
      return this.recommend.slice(0, this.page * this.pageSize)
    }
  },
  data () {
    return {
      page: 1,
      pageSize: 20,
      isRefreshing: false,
      recommend: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.isRefreshing = true
      api.get('ranking/54d42d92321052167dfb75e3', {}).then((res) => {
        this.page = 1
        this.isRefreshing = false
        this.recommend = res.ranking.books
      })
    },
    loadmore () {
      setTimeout(() => {
        this.page++
      }, 800)
    }
  }
}
</script>
<style scoped>
.wrapper{
  flex: 1;
}
.refresh {
  width: 750px;
  align-items: center;
}
.no-data{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scroller {
  flex: 1;
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
.title {
  font-size: 30px;
  color: #666666;
}
</style>

