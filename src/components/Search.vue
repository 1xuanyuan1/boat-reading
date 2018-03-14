<template>
  <div class="wrapper">
    <div class="search-box">
      <input class="search" v-model="query" ref="search"></input>
      <div class="search-btn" @click="search">
        <text class="search-btn-text">搜索</text>
      </div>
    </div>
    <scroller class="scroller">
      <div class="search-result">
        <a class="result-row" v-for="(item, index) in data" :key="index" :href="`book.html?id=${item._id}`">
          <image :src="getImageUrl(item.cover)" class="image"></image>
          <div class="content">
            <text class="title">{{item.title}}</text>
            <text class="subtitle">{{item.lastChapter}}</text>
          </div>
        </a>
      </div>
    </scroller>
  </div>
</template>

<script>
import api from '../service'
export default {
  data () {
    return {
      query: '',
      data: {}
    }
  },
  methods: {
    search () {
      let params = {
        query: this.query
      }
      api.get('book/fuzzy-search', params).then((data) => {
        this.data = data.books
      })
    }
  }
}
</script>

<style scoped>
.wrapper{
  flex: 1;
}
.scroller{
  flex: 1;
}

.result-row{
  flex-direction: row;
  height: 150px;
  padding: 20px;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
}
.search-box{
  flex-direction: row;
  height: 200px;
  justify-content: center;
  align-items: center;
}
.search{
  font-size: 40px;
  width: 500px;
  height: 80px;
  margin-left: 20px;
  margin-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  color: #666666;
  border-width: 2px;
  border-style: solid;
  border-color: #15b6e4;
}
.search-btn{
  font-size: 30px;
  background-color: #15b6e4;
  height: 80px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  justify-content: center;
}
.search-btn-text{
  color: white;
}
.image{
  width: 80px;
  height: 120px;
  margin-right: 20px;
}
.title{
  font-size: 30px;
}
.subtitle{
  font-size: 25px;
}
</style>
