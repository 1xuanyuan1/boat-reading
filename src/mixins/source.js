const api = require('../service')
const storage = weex.requireModule('storage')
export default {
  data: () => ({
    sources: {}, // 所有源 (list)
    currentSource: {} // 当前选中源
  }),
  created () {
    // 获得当前选中的源
    storage.getItem('currentSource', event => {
      this.currentSource = event.data == 'undefined' ? {} : JSON.parse(event.data)
    })

    // 获得所有的源
    storage.getItem('sources', event => {
      this.sources = event.data == 'undefined' ? {} : JSON.parse(event.data)
    })
  },
  methods: {
    /**
     * 根据书籍ID获取到所有的书源
     * @param {*} bookid
     * @returns 当前选择的书源ID 
     */
    getSourceList (bookid) {
      return api.get(`toc?view=summary&book=${bookid}`).then((data) => {
        // 过滤掉VIP书源
        let list = data.filter(item => item.source !== 'zhuishuvip')
        this.sources[bookid] = list
        // 若改书籍没有默认源 则给其一个默认值
        if (Object.keys(this.currentSource).indexOf(bookid) === -1 && list.length > 0) {
          this.currentSource[bookid] = list[0]._id
        }
        storage.setItem('sources', JSON.stringify(this.sources))
        storage.setItem('currentSource', JSON.stringify(this.currentSource))
        return this.currentSource[bookid]
      })
    }
  }
}