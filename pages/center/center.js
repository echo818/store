Page({
  data: {
    custInfo: {},
    orderInfo: {},
    couponLen: 0
  },

  onLoad() {
    wx.$init = () => {
      this.getCustomer()
      this.getOrderList()
      this.getCouponList()
    }
  },
  // 获取店铺信息
  getCustomer() {
    wx.$ajax(
      'customers.customerInfo'
    ).then(custInfo => {
      this.setData({
        custInfo
      })
    })
  },
  // 获取订单统计信息
  getOrderList() {
    wx.$ajax(
      'sales.orderStatistical'
    ).then(orderInfo => {
      this.setData({
        orderInfo
      })
    })
  },
  // 获取优惠券列表
  getCouponList() {
    wx.$ajax(
      'core.getCustomerCouponList',
      { list_type: 1 },
      { isSaler: true }
    ).then(res => {
      this.setData({
        couponLen: res.length
      })
    })
  }
})