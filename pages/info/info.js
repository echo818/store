Page({
  data: {
    id: '',
    info: {},
    polyline: {}
  },

  onLoad(opts) {
    this.data.id = opts.id || '33'
    this.getWholesalerInfo()
  },
  // 获取供应商信息
  getWholesalerInfo() {
    wx.$ajax(
      'merchant.getWholesalerInfo',
      { isSaler: true }
    ).then(res => {
      let polyline = {
        points: res.delivery_range,
        color: '#FF0000DD',
        width: 2,
        dottedLine: true
      }
      this.setData({
        info: res,
        polyline
      })
    })
  }
})