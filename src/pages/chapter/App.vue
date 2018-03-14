<template>
  <list class="list scroller" @loadmore="loadnext" loadmoreoffset="10">
    <refresh class="refresh" @refresh="loadprevious" :display="refreshing">
      <text class="indicator">正在加载上一页...</text>
    </refresh>
    <cell class="cell" v-for="(item, index) in data" :key="`item-${index}`" :ref="`item-${index}`">
      <div class="row" @click="selectChapter(startPage + index)">
        <image class="chapter-pre" :src="getPre(startPage + index)"></image>
        <text class="chapter-num">{{startPage + index + 1}}.</text>
        <text class="chapter-label" :ref="`text-${index}`">{{item.title}}</text>
        <image class="chapter-right" src="http://images.diaoqianyaner.com.cn/img_book/bd_arrow_right.png"></image>
      </div>
    </cell>
  </list>
</template>

<script>
const PageStack = new BroadcastChannel('page')
const navigator = weex.requireModule('navigator')
import book from './../../mixins/book'
import source from './../../mixins/source'
export default {
  mixins: [book, source],
  name: 'chapter',
  created () {
    const id = this.getParam('id')
    this.currentBook = id
    // 获取书源列表
    this.getSourceList(id).then((sourceId) => {
      // 获取当前书源下
      this.getBookChapters(sourceId).then(res => {
        this.list = res

        this.currentPage = this.pages[this.currentBook].current
        this.startPage = this.currentPage - this.pageSize / 2
        if (this.startPage < 0) this.startPage = 0
        this.endPage = this.startPage + this.pageSize
      })
    })

    try {
      this.setTitle('目录')
    } catch (e) {

    }
  },
  computed: {
    data () {
      return this.list.slice(this.startPage, this.endPage)
    }
  },
  data () {
    return {
      list: [],
      startPage: 0, // 开始页
      endPage: 0, // 结束页
      currentPage: 0, // 当前页
      pageSize: 20,
      refreshing: 'hide', // 是否显示加载中
      showLoading: 'hide' // 是否显示加载中
    }
  },
  methods: {
    getPre (page) {
      if (page > this.currentPage) {
        return 'http://images.diaoqianyaner.com.cn/img_book/directory_not_previewed.png'
      } else if (page == this.currentPage) {
        return 'http://images.diaoqianyaner.com.cn/img_book/directory_selected.png'
      } else {
        return 'http://images.diaoqianyaner.com.cn/img_book/directory_previewed.png'
      }
    },
    selectChapter (index) {
      this.$set(this.pages, this.currentBook, {
        hasPrevious: index > 0, // 是否有上一页
        hasNext: this.chapters[this.currentBook].length > index, // 是否有下一页
        current: index,
        size: this.chapters[this.currentBook].length
      })
      PageStack.postMessage(this.pages)
      navigator.pop()
    },
    loadprevious () {
      this.showToast('加载中...')
      this.refreshing = 'show'
      setTimeout(() => {
        this.startPage -= this.pageSize
        if (this.startPage < 0) this.startPage = 0
        this.refreshing = 'hide'
      }, 300)
    },
    loadnext (event) {
      if (this.list.length <= this.endPage) return
      this.showToast('加载中...')
      this.showLoading = 'show'
      setTimeout(() => {
        this.endPage += this.pageSize
        this.showLoading = 'hide'
      }, 300)
    }
  }
}
</script>

<style scoped>
.container{
  padding: 30px;
}
.row {
  flex-direction: row;
  align-items: center;
  padding: 10px 40px;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #efefef;
  justify-content: space-between;
}
.chapter-pre{
  width: 22px;
  height: 30px;
}
.chapter-num {
  font-size: 24px;
  color: #999;
}
.chapter-label{
  font-size: 33px;
  width: 520px;
  lines: 1;
  color: #333333;
  text-overflow: ellipsis;
}
.chapter-right {
  width: 15px;
  height: 30px;
}
.loading {
  justify-content: center;
}
.refresh {
  width: 750px;
  justify-content: center;
}
.indicator {
  color: #888888;
  font-size: 22px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
</style>
