<template>
  <list class="list scroller">
    <cell class="cell" v-for="(item, index) in source" :key="`item-${index}`" @click="changeSoure(item._id)">
      <div class="row">
        <div class="icon" :class="[`${item._id === current?'current':''}`]">
          <text class="icon-text">{{item.name.substr(0, 1)}}</text>
        </div>
        <div class="content">
          <div class="content-top">
            <text class="name">{{item.name}}</text>
            <text class="time">{{getUpdateTime(item.updated)}}</text>
          </div>
          <div class="content-bottom">
            <text class="last-chapter">{{item.lastChapter}}</text>
          </div>
        </div>
        <div class="right">
          <text class="right-text" v-if="item._id === current">当前选择</text>
          <image class="right-icon" src="http://images.diaoqianyaner.com.cn/img_book/bd_arrow_right.png"></image>
        </div>
      </div>
    </cell>
  </list>
</template>

<script>
import source from './../../mixins/source'
const SourceStack = new BroadcastChannel('source')
const navigator = weex.requireModule('navigator')
const storage = weex.requireModule('storage')
export default {
  name: 'app',
  mixins: [source],
  computed: {
    source () {
      return this.sources[this.currentBook] || []
    },
    current () {
      return this.currentSource[this.currentBook] || ''
    }
  },
  created () {
    this.currentBook = this.getParam('id')
    try {
      this.setTitle('换源')
    } catch (e) {

    }
  },
  data () {
    return {
      currentBook: '',
      src: "https://img.alicdn.com/tfs/TB1ggbThqagSKJjy0FcXXcZeVXa-334-82.png"
    }
  },
  methods: {
    changeSoure (id) {
      this.currentSource[this.currentBook] = id
      storage.setItem('currentSource', JSON.stringify(this.currentSource))
      SourceStack.postMessage(id)
      navigator.pop()
    }
  }
}
</script>

<style scoped>
.list {
  background: #efefef;
}
.row {
  background: white;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #efefef;
}
.icon {
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #cccccc;
}
.current {
  background-color: #333333;
}
.content {
  width: 480px;
}
.content-top {
  flex-direction: row;
  align-items: center;
}
.name {
  font-size: 28px;
  color: #333333;
  margin-right: 20px;
}
.time {
  font-size: 20px;
  color: #666666;
}
.last-chapter {
  lines: 1;
  font-size: 24px;
  color: #666666;
  text-overflow: ellipsis;
}
.icon-text {
  color: white;
  font-size: 24px;
}
.right {
  width: 120px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.right-text {
  font-size: 24px;
  color: #999999;
  margin-right: 10px;
}
.right-icon {
  width: 15px;
  height: 30px;
}
</style>
