const { timedown } = require('../../utils/util.js')

Page({
  data: {
    id: '',
    buyShow: false,
    productData: {},
    cartNum: 0
  },

  onLoad(opts) {
    this.setData({
      id: opts.product_id,
    })
    this.getData()
    this.getCart()
  },
  // 获取详情数据
  getData() {
    wx.$ajax(
      'merchant.productDetail',
      { product_id: this.data.id },
      { isSaler: true }
    ).then(res => {
      if (res['is_special']) {
        // 活动倒计时
        timedown(res['special_to_date'], date => {
          this.setData({
            date
          })
        })
      }
      this.setData({
        productData: res
      })
    })
  },
  // 获取购物车数据
  getCart() {
    wx.$ajax(
      'merchant.cartItems',
      { isSaler: true }
    ).then(res => {
      if (res) {
        let activities = res.rule_cart, products = [];
        for (let i = 0, len = activities.length; i < len; i++) {
          if (activities[i].product) {
            products.push(...activities[i].product)
          }
        }
        let num = 0;
        products.map(prod => { num += prod.num });
        this.setData({
          cartNum: num
        })
      }
    })
  },
  // 跳转购物车
  cartEvt() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  // 加入购物车
  joinEvt() {
    this.setData({
      buyShow: true
    })
  },
  // 购买事件
  buyEvt(e) {
    if (wx.$data.is_bind_customer) {
      let { product_id, price, qty } = this.data.productData
      this.setData({
        buyShow: true,
        prodId: product_id,
        buyPrice: price,
        stock: qty
      })
    } else {
      wx.navigateTo({
        url: '../bindphone/bindphone',
      })
    }
  },
  confirmNum (e) {
    let prod = { product_id: this.data.productData.product_id, num: e.detail, selected: 1 };
    wx.$ajax(
      'merchant.updateItems',
      { products: [prod] },
      { isSaler: true }
    ).then(res => {
      this.setData({
        cartNum: this.data.cartNum + e.detail
      })
    })
  },
  // 转发
  onShareAppMessage() {
    return {
      title: '小程序slogan',
      path: '/pages/goodsdetail/goodsdetail?product_id=123'
    }
  }
})