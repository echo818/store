// pages/orderlist/orderlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexTab: {
      list: [
        {
          id: 1,
          title: '待接单'
        }, {
          id: 2,
          title: '待收货'
        }, {
          id: 3,
          title: '待取消'
        }, {
          id: 4,
          title: '全部订单'
        }
      ],
      selectedId: 1,
      scroll: false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  updateData () {

  },

  handleZanTabChange (e) {
    let componentId = e.componentId;
    let selectedId = e.selectedId;
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    this.updateData(selectedId)
  }
})