<template>
  <div class="wrapper">
    <div class="no-data" v-if="data.length < 1">
      <text>您还没有添加任何书到书架</text>
    </div>
    <list class="list scroller" @loadmore="loadmore" loadmoreoffset="10" v-else>
      <refresh class="refresh" @refresh="onrefresh" :display="isRefreshing ? 'show' : 'hide'">
        <text class="indicator">刷新书架 ...</text>
      </refresh>
      <cell class="cell" v-for="(item, index) in data" :key="index" :ref="'item'+index">
        <div class="row" @click="toContent(item)">
          <image :src="getImageUrl(item.cover)" class="image" />
          <div class="content">
            <div class="content-top">
              <text class="title">{{item.title}}</text>
              <text class="update" v-if="item.isUpdated">更新</text>
            </div>
            <text class="subtitle">{{getUpdateTime(item.updated)}} {{item.lastChapter}}</text>
          </div>
        </div>
      </cell>
    </list>
  </div>
</template>
<script>
import book from '../mixins/book'
import api from '../service'
const navigator = weex.requireModule('navigator')
export default {
  mixins: [book],
  name: 'bookcase',
  computed: {
    data () {
      return Object.values(this.bookcase).slice(0, this.page * this.pageSize)
    }
  },
  data () {
    return {
      page: 1,
      pageSize: 20,
      isLoading: true,
      isRefreshing: false
    }
  },
  created () {
    this.initBookcase()
  },
  methods: {
    loadmore () {
      setTimeout(() => {
        this.page++
      }, 800)
    },
    toContent (item) {
      navigator.push({
        url: `content.html?id=${item._id}&page=${this.pages[item._id]? this.pages[item._id].current : '0'}`
      })
      this.bookcase[item._id].isUpdated = false
      this.setBookcase(this.bookcase)
    },
    onrefresh () {
      this.initBookcase()
      this.isRefreshing = true
      console.error(this.bookcase)
      api.get(`book?view=updated&id=${Object.keys(this.bookcase).join(',')}`).then(res => {
        for (let item of res) {
          // 若章节数 大于目前书架里 书籍的章节数 则更新书架里的信息
          if (item.chaptersCount > this.bookcase[item._id].chaptersCount) {
            this.bookcase[item._id] = {
              ...this.bookcase[item._id],
              ...item,
              isUpdated: true  // 是否有更新
            }
          }
        }
        this.setBookcase(this.bookcase)
        this.isRefreshing = false
        console.error(res)
      })
    }
  }
}
</script>
<style scoped>
.wrapper, .scroller, .no-data{
  flex: 1;
}
.no-data{
  display: flex;
  justify-content: center;
  align-items: center;
}
.refresh {
  width: 750px;
  height: 100px;
  align-items: center;
  justify-content: center;
}
.indicator {
  color: #888888;
  font-size: 30px;
  text-align: center;
}
.row{
  flex-direction: row;
  height: 150px;
  padding: 20px;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
}
.image{
  width: 80px;
  height: 120px;
  margin-right: 20px;
}
.content-top {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title{
  font-size: 30px;
  margin-right: 20px;
  color: #333333;
}
.update {
  background-color: red;
  color: white;
  padding: 5px 10px;
  font-size: 24px;
}
.subtitle{
  font-size: 24px;
  color: #666666;
}
.content{
  height: 120px;
  align-items: stretch;
  justify-content: space-around;
}
</style>


