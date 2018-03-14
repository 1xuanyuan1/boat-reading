<template>
  <scroller class="scroller">
    <div class="container">
      <div class="row shortIntro">
        <image :src="getImageUrl(book.cover)" class="image"></image>
        <div class="content">
          <text class="title">{{book.title}}</text>
          <text class="subtitle">{{book.author}}</text>
          <text class="subtitle">{{book.lastChapter}}</text>
        </div>
      </div>
      <div class="row toolbox">
        <a :href="`content.html?id=${currentBook}&page=${currentPage}`" class="btn"><text class="btn-text">开始阅读</text></a>
        <text class="btn" @click="addBookcase(book)" v-if="isExists === -1">放入书架</text>
        <text class="btn" @click="removeBookcase(book._id)" v-else>移除书架</text>
      </div>
      <div>
        <text class="intro">{{book.longIntro}}</text>
      </div>
    </div>
  </scroller>
</template>

<script>
import api from '../../service'
import book from './../../mixins/book'
import source from './../../mixins/source'
export default {
  name: 'book',
  mixins: [book, source],
  computed: {
    currentPage () {
      if (this.pages[this.currentBook]) {
        console.error(this.pages[this.currentBook].current)
        return this.pages[this.currentBook].current
      }
      return 0
    }
  },
  data () {
    return {
      book: {}
    }
  },
  created () {
    const id = this.getParam('id')
    this.currentBook = id
    api.get(`book/${id}`).then((data) => {
      this.book = data
      this.setTitle(data.title)
    })
    // 初始化书架
    this.initBookcase(id)
  },
  methods: {

  }
}
</script>

<style scoped>
.container {
  margin-top: 40px;
}
.row {
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
}
.shortIntro {
  padding-left: 60px;
}
.toolbox {
  margin-top: 40px;
  height:  100px;
}
.content {
  height: 240px;
  flex: 1;
  justify-content: space-around;
}
.image{
  width: 160px;
  height: 240px;
  margin-right: 40px;
}
.title {
  font-size: 40px;
}
.subtitle {
  font-size: 30px;
}
.intro {
  padding: 80px;
  font-size: 30px;
}
.btn{
  flex: 1;
  font-size: 30px;
  text-align: center;
}
.btn-text {
  font-size: 30px;
  text-align: center;
}
</style>
