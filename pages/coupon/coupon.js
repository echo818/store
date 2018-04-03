// pages/coupon/coupon.js
let Zan = require('../../dist/index');
let couponList = require('./couponList');

Page(Object.assign({}, Zan.Tab, {

  /**
   * 页面的初始数据
   */
  data: {
    indexTab: {
      list: [
        {
          id: 1,
          title: '未使用'
        }, {
          id: 2,
          title: '已使用'
        }, {
          id: 3,
          title: '已失效'
        }
      ],
      selectedId: 1,
      scroll: false
    },
    coupons: [],
    nodes: [{
      name: 'div',
      attrs: {
        style: 'line-height: 60px; color: red;'
      },
      children: [{
        type: 'text',
        text: 'Hello \n World!'
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateData(1)
  },
  updateData (type) {
    // type = 1 未使用，2 已使用，3 已失效
    wx.$ajax('sales.getCustomerCouponList', {
      list_type: type
    }, {
      isSaler: true
    }).then(res => {
      if (res) {
        this.setData({
          coupons: res
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  handleZanTabChange(e) {
    let componentId = e.componentId;
    let selectedId = e.selectedId;
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    this.updateData(selectedId)
  },
  goto (e) {
    console.log(e)
    let typ = e.currentTarget.dataset.type
    let prodId = e.currentTarget.dataset.prodId
    if (typ === 1) {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?product_id=' + prodId,
      })
    } else if (typ === 2) {
      wx.navigateTo({
        url: '/pages/',
      })
    } else {
      console.log('hahah')
      wx.switchTab({
        url: '/pages/home/home',
      })
    }
  }
}))