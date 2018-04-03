Component({
  properties: {
    // 显示状态(默认关闭)
    visible: {
      type: Boolean,
      value: false
    },
    // 售价
    price: String,
    // 库存
    stock: {
      type: Number,
      value: 0,
      observer: function(val) {
        // 判断库存显示状态
        this.setMsg(val)
      }
    },
    // 购买数量
    value: {
      type: Number,
      value: 0
    }
  },

  data: {
    msg: '库存充足', // 库存状态提示,
    test: 0
  },

  methods: {
    inputValue (e) {
      this.setData({
        value: e.detail.value
      })
    },
    // 减少数量 操作
    cutEvt() {
      this.setValue(--this.data.value)
    },
    // 添加数量 操作
    addEvt() {
      this.setValue(++this.data.value)
    },
    // 设置数量
    setValue(value) {
      this.setData({
        value
      })
    },
    // 设置库存状态信息
    setMsg(num) {
      let msg
      if (num >= 100) {
        msg = '库存充足'
      } else if (num >= 20) {
        msg = '库存紧张'
      } else if (num > 0) {
        msg = `仅剩${num}件`
      } else {
        msg = '库存不足'
      }
      this.setData({
        msg
      })
    },
    // 取消按钮 事件
    cancelEvt() {
      this.setData({
        visible: false
      })
      this.triggerEvent('cancel', this.data.value)
    },
    // 确定按钮 事件
    confirmEvt() {
      this.setData({
        visible: false
      })
      this.triggerEvent('confirm', this.data.value)
    }
  }
})
