Component({
  properties: {
    // 弹窗的显示/隐藏
    visible: {
      type: Boolean,
      value: false
    },
    // 点击遮罩层是否关闭弹窗
    isMask: {
      type: Boolean,
      value: true
    },
    // 是否显示关闭图标
    isClose: {
      type: Boolean,
      value: false
    },
    // dialog-box 元素样式
    innerstyle: {
      type: String,
      value: ''
    }
  },
  externalClasses: 'dialog-class',
  methods: {
    open() {
      this.setData({
        visible: true
      })
    },
    close() {
      this.setData({
        visible: false
      })
    },
    maskEvt() {
      if (this.data.isMask) {
        this.close()
        // 点击遮罩层 回调事件
        this.triggerEvent('mask')
      }
    },
    closeEvt() {
      this.close()
      // 点击关闭图标 回调事件
      this.triggerEvent('close')
    }
  }
})
