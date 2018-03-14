// 追书神器 cdk
const STATIC_URL = 'http://statics.zhuishushenqi.com'
const CONTENT_URL = 'http://content.book.dduke.me/chapter/'
// const CONTENT_URL = http://chapter2.zhuishushenqi.com/chapter/
const modal = weex.requireModule('modal')
const navigator = weex.requireModule('navigator')
const navBar = weex.requireModule('navigationBar');
export default {
  methods: {
    jump (url) {
      navigator.push({
        url: url,
        animated: "true"
      }, event => {
        // modal.toast({ message: 'callback: ' + event })
      })
    },
    getBook (id) { // 跳转到书籍页面
      // this.getSourceList(id).then(() => {
      //   this.setBookCurrent(id)
      //   this.jump('/book')
      // })
    },
    setTitle (title) {
      navBar.setTitle({title})
    },
    showToast (message) {
      modal.toast({message,duration: .3})
    },
    getParam (name) {
	    const url = weex.config.bundleUrl.split('?')[1];
	    const regExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    const result = url.match(regExp);
	    return result != null ? decodeURIComponent(result[2]) : null;
    },
    getImageUrl (url) { // 获取图片地址
      return STATIC_URL + url
    },
    getContentUrl (url) { // 获取内容地址
      return CONTENT_URL + url
    },
    getUpdateTime (dateStr) {
      if (!dateStr) return ''
      let date = new Date(dateStr)
      let now = new Date()
      let time = Math.round((now.getTime() - date.getTime()) / 1000)
      if (time < 60) {
        return `${time} 秒前更新`
      } else {
        time = Math.round(time / 60)
        if (time < 60) {
          return `${time} 分前更新`
        } else {
          time = Math.round(time / 60)
          if (time < 24) {
            return `${time} 小时前更新`
          } else {
            time = Math.round(time / 24)
            return `${time} 天前更新`
          }
        }
      }
    }
  }
}
