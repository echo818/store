Page({
  data: {
    inviteCode: '',
    wholesalerList: [],
    delVisible: false,
    storeVisible: false,
    delId: ''
  },

  onLoad () {
    if (wx.$data.wholesaler_id) {
      this.getList()
    }
  },
  // 输入绑定
  inputEvt(e) {
    this.setData({
      inviteCode: e.detail.value
    })
  },
  // 获取供应商列表
  getList() {
    wx.$ajax(
      'customers.wholesalerRelationship',
    ).then(res => {
      this.setData({
        wholesalerList: res
      })
    })
  },
  // 搜索邀请码
  searchEvt() {
    wx.$ajax(
      'customers.wholesalerBind',
      { invite_code: this.data.inviteCode },
      { raw: true }
    ).then(res => {
      if (res.data) {
        this.setData({
          storeVisible: true
        })
      } else {
        wx.$toast('邀请码输入有误，请重新输入')
      }
    })
  },
  // 扫码
  scanEvt() {
    wx.scanCode({
      success: function(res) {
        console.log(res)
      }
    })
  },
  // 删除
  deleteEvt(e) {
    this.setData({
      delVisible: true,
      delId: e.currentTarget.dataset.id
    })
  },
  // 弹窗 取消
  cancelEvt() {
    this.setData({
      delVisible: false
    })
  },
  // 弹窗 确定
  confirmEvt() {
    wx.$ajax(
      'customers.wholesalerAbolish',
      {
        wholesaler_id: this.data.delId
      },
    ).then(res => {
      console.log(res)
    })
  },
  // 进入店铺
  storeEvt() {
    wx.switchTab({
      url: '../home/home',
    })
  }
})