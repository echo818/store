// pages/components/item.js

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    // 是否可编辑数量
    hasEdit: {
      type: Boolean,
      value: true
    },
    item: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    checkDetail () {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?product_id=' + this.data.item.product_id,
      })
    }
  }
})
