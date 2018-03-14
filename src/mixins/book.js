const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
const api = require('../service')
const PageStack = new BroadcastChannel('page')
export default {
  data: () => ({
    bookcase: {}, // 书架信息(key为书籍ID)
    isExists: -1, // 当前的书是否已经放入书架中
    currentBook: '', // 当前书籍ID
    chapters: {}, // 书籍所有章节(key为书籍ID)
    currentBookChapter: {}, // 书籍当前章节 (key为书籍ID)
    pages: {} // 书籍页数信息(key为书籍ID) 为了翻页
  }),
  created () {
    // 获得书籍页数信息
    storage.getItem('pages', event => {
      this.pages = event.data == 'undefined' ? {} : JSON.parse(event.data)
    })
    // 更新页数信息
    PageStack.onmessage = (event) => {
      this.pages = event.data || {}
      // 若有当前选中的书籍ID 并在在书籍查看页的时候 更新当前书籍的页数
      if (this.currentPage != null && this.currentBook != '') {
        this.currentPage = this.pages[this.currentBook].current
      }
    }
  },
  methods: {
    /**
     * 初始化书架
     * @param {*} bookId 只在书籍页需要传书籍ID
     */
    initBookcase (bookId = -1) {
      storage.getItem('bookcase', event => {
        this.bookcase = event.data == 'undefined' ? {} : JSON.parse(event.data)
        this.isExists = Object.keys(this.bookcase).indexOf(bookId)
      })
    },
    /**
     * 加入书架
     * @param {*} book 需要加入书架的书
     */
    addBookcase (book) {
      this.bookcase[book._id] = book
      this.isExists = 1
      this.setBookcase(this.bookcase)
      modal.toast({message: '加入书架成功',duration: 0.3})
    },
    /**
     * 移除书架
     * @param {*} bookId 移除书架的书籍ID
     */
    removeBookcase (bookId) {
      delete this.bookcase[bookId]
      this.isExists = -1
      this.setBookcase(this.bookcase)
      modal.toast({message: '移除书架成功',duration: 0.3})
    },
    /**
     * 每次操作书架后 更新书籍信息
     * @param {*} bookcase 
     */
    setBookcase (bookcase) {
      storage.setItem('bookcase', JSON.stringify(bookcase), event => {
        console.log('setBookcase success')
      })
    },
    /**
     * 根据书源ID获取到书籍目录
     * @param {*} sourceId 
     */
    getBookChapters (sourceId) {
      // return api.get(`toc/${sourceId}?view=chapters&channel=mweb`).then((res) => {
      return api.get(`toc/${sourceId}?view=chapters`).then((res) => {
        let list = res.chapters
        this.chapters[this.currentBook] = list
        console.log(res)
        console.log(list)
        if (Object.keys(this.pages).indexOf(this.currentBook) === -1) {
          this.pages[this.currentBook] = {
            hasPrevious: false, // 是否有上一页
            hasNext: list.length > 0, // 是否有下一页
            current: 0,
            size: list.length
          }
          console.log(this.pages)
          this.currentBookChapter[this.currentBook] = list[0]
          storage.setItem('pages', JSON.stringify(this.pages))
          storage.setItem('currentBookChapter', JSON.stringify(this.currentBookChapter))
        } else {
          this.currentBookChapter[this.currentBook] = list[this.pages[this.currentBook].current]
          storage.setItem('currentBookChapter', JSON.stringify(this.currentBookChapter))
        }
        storage.setItem('chapters', JSON.stringify(this.chapters))
        return res.chapters
      })
    },
    /**
     * 初始化书籍章节
     * @param {*} callback 初始化完当前目录回调
     */
    initBookChapter (page = 0, callback = ()=>{}, failback = () => {}) {
      storage.getItem('chapters', event => {
        this.chapters = event.data == 'undefined' ? {} : JSON.parse(event.data)
        // 若并没有改书源信息则去加载
        if (!this.chapters[this.currentBook]) {
          failback()
          return
        }
        this.pages[this.currentBook] = {
          hasPrevious: page > 0, // 是否有上一页
          hasNext: this.chapters[this.currentBook].length > page, // 是否有下一页
          current: page,
          size: this.chapters[this.currentBook].length
        }
        storage.setItem('pages', JSON.stringify(this.pages))
        callback(this.chapters[this.currentBook][page])
      })
    }
  }
}