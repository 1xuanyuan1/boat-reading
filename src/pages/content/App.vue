<template>
  <scroller class="scroller">
    <div class="loading-box" v-if="isLoading">
      <text class="loading-text">加载中...</text>
    </div>
    <div class="content-box" v-else>
      <text class="content">{{content}}</text>
    </div>
    <div class="action">
      <div class="action-btn" :style="{opacity: `${pageInfo.hasPrevious? 1: .2}`}" @click="toPrevious"><text class="action-btn-text">上一页</text></div>
      <div class="action-btn"><a :href="`chapter.html?id=${currentBook}`"><text class="action-btn-text">目录</text></a></div>
      <div class="action-btn" :style="{opacity: `${pageInfo.hasNext? 1: .2}`}" @click="toNext"><text class="action-btn-text">下一页</text></div>
    </div>
  </scroller>
</template>

<script>
const navigator = weex.requireModule('navigator')
const PageStack = new BroadcastChannel('page')
const SourceStack = new BroadcastChannel('source')
import api from '../../service'
import book from './../../mixins/book'
import source from './../../mixins/source'
const navBar = weex.requireModule('navigationBar')
const storage = weex.requireModule('storage')
export default {
  mixins: [book, source],
  name: 'content',
  data () {
    return {
      isLoading: true,
      isCreated: false,
      currentPage: 0, // 当前页
      content: '' // 文章内容
    }
  },
  computed: {
    // 当前书籍的页面信息
    pageInfo () {
      return this.pages[this.currentBook] || {}
    },
    // 所有章节信息
    chapterInfo () {
      return this.chapters[this.currentBook] || []
    }
  },
  watch: {
    currentPage () {
      if (!this.isCreated) return // 若未初始化则 不进入下一步
      this.isLoading = true
      this.$set(this.pages, this.currentBook, {
        hasPrevious: this.currentPage > 0, // 是否有上一页
        hasNext: this.chapters[this.currentBook].length > this.currentPage, // 是否有下一页
        current: this.currentPage,
        size: this.chapters[this.currentBook].length
      })
      console.error('currentPage', this.pages[this.currentBook])
      PageStack.postMessage(this.pages)
      storage.setItem('pages', JSON.stringify(this.pages))
      this.getContent(this.chapterInfo[this.currentPage])
    }
  },
  created () {
    navBar.setRightItem({title: '换源'},(res) => {
      // 解决iOS端 返回为 '{}' 的问题
      while (typeof res !== 'object') {
        res = JSON.parse(res)
      }
      // 没有参数的话表示为设置成功 不做处理
      if (Object.keys(res).length < 1) return 
      // this.showToast('换源')
      navigator.push({url: `source.html?id=${this.currentBook}`})
    })
    // 换源之后监听
    SourceStack.onmessage = (event) => {
      this.isLoading = true
      let sourceId = event.data || ''
      if (sourceId !== '' ) {
         // 获取当前书源下
        this.getBookChapters(sourceId).then(res => {
          this.getContent(res[this.currentPage])
        })
      }
    }
  },
  mounted () {
    let id = this.getParam('id')
    this.currentBook = id
    let page = this.getParam('page')
    this.currentPage = page
    this.initBookChapter(page, this.getContent, () => {
      // 获取书源列表
      this.getSourceList(id).then((sourceId) => {
        // 获取当前书源下
        this.getBookChapters(sourceId).then(res => {
          this.getContent(res[0])
        })
      })
    })
    
  },
  methods: {
    // 获取文章内容
    getContent (currentChapter) {
      console.error(this.pageInfo)
      this.content = '正在加载...'
      this.isCreated = true
      this.isLoading = true
      api.get(this.getContentUrl(currentChapter.link)).then((res) => {
        this.isLoading = false
        this.content = res.chapter.body
        try {
          this.setTitle(res.chapter.title)
        } catch (e) {
          console.log(e)
        }
      }).catch(() => {
        this.isLoading = false
        this.content = '该书源有问题,请点击右上角换源'
        this.showToast('该书源有问题,请点击右上角换源')
      })
    },
    // 上一页
    toPrevious () {
      if (!this.pageInfo.hasPrevious) {
        return
      }
      this.toChangePage(false)
    },
    // 下一页
    toNext () {
      if (!this.pageInfo.hasNext) {
        return
      }
      this.toChangePage(true)
    },
    toChangePage (isNext) {
      if (isNext) {
        this.currentPage ++
      } else {
        this.currentPage --
      }
    }
  }
}
</script>

<style scoped>
.scroller{
  padding: 20px 40px;
}
.loading-box {
  width: 710px;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-text {
  color: #333333;
  font-size: 26px;
}
.content-box {
}
.content {
  color: #333333;
  font-size: 34px;
}
.action {
  flex-direction: row;
  margin: 20px 0;
}
.action-btn {
  flex: 1;
  background-color: #15b6e4;
  margin: 0 20px;
  padding: 10px 0;
  border-radius: 10px;
}
.action-btn-disabled{
  flex: 1;
  background-color: #15b6e4;
  margin: 0 20px;
  padding: 10px 0;
  border-radius: 10px;
  opacity: .3;
}
.action-btn-text {
  text-align: center;
  color: white;
  font-size: 30px;
}
.disabled{
  opacity: .2;
}
</style>
