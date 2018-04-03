Page({
  data: {
    tipShow: false, // head tips 显示或隐藏
    openState: false, // 优惠券列表 展开或折叠
    promotionShow: false, // 优惠券活动 全场满减 弹窗 显示或隐藏
    page: 1,
    count: 1,
    wholesalerList: [],
    wholesalerInfo: {},
    couponList: [],
    promotionTags: [],
    category: [],
    specialProducts: [],
    promotion: [],
    productList: [],
    // 购买弹框
    buyShow: false, // 弹框是否显示
    prodId: '', // 商品ID
    num: '', // 购买数量
    buyPrice: '', // 单价
    stock: '', // 库存数量
    promotionInfo: {} // 优惠券活动 全场满减 弹窗 信息
  },

  onLoad(opts) {
    opts.wholesaler_id = 33 // 测试值

    let wholesalerId = opts.wholesaler_id || wx.$data.wholesaler_id
    // 判断是否有供应商id，如果有就展示供应商信息，没有就跳转到选择供应商页
    if (wholesalerId) {
      if (!wx.$data.wholesaler_id) wx.$data.wholesaler_id = wholesalerId
      if (wx.$data.auth_token) {
        this.pageData()
      } else {
        // 注册全局init函数，供登录成功后回调使用
        wx.$init = () => {
          this.pageData()
        }
      }
    } else {
      wx.redirectTo({
        url: '../chooseseller/chooseseller'
      })
    }
  },
  // 获取页面数据
  pageData() {
    // 如果登录成功返回，已经授权过，则直接获取页面初始化数据
    // 否则弹出微信授权弹窗
    if (wx.$data.is_auth) {
      this.initData()
    } else {
      // 授权确认则获取用户信息，服务器兑换UnionID,否则跳转到授权页面
      wx.authorize({
        scope: 'scope.userInfo',
        success: () => {
          this.getUserInfo()
        },
        fail: () => {
          wx.redirectTo({
            url: '../index/index',
          })
        }
      })
    }
  },
  // 获取用户信息
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        let { signature, rawData, encryptedData, iv } = res
        // 兑换UnionId
        wx.$ajax(
          'customers.saveCustomerUnionId',
          { signature, rawData, encryptedData, iv }
        ).then(() => {
          this.initData()
        })
      }
    })
  },
  // 上拉刷新
  onPullDownRefresh() {
    this.initData()
  },
  // 获取初始化页面数据
  initData() {
    this.getHomeInfo()
    this.getHotGoods()
    this.getStoreList()
  },
  // 关闭tips
  closeEvt() {
    this.setData({
      tipShow: false
    })
  },
  // 获取 首页数据
  getHomeInfo() {
    wx.$ajax(
      'merchant.home',
      { isSaler: true }
    ).then(res => {
      wx.stopPullDownRefresh()
      // 判断是否显示头部绑定用户手机信息
      this.setData({
        tipShow: !wx.$data.is_bind_customer
      })
      this.setData({
        wholesalerInfo: res['wholesaler_info'],
        couponList: res['coupon_list'],
        promotionTags: res['promotion_tags'],
        category: res['category']['child_category'],
        specialProducts: res['special_products'],
        promotion: res['promotion']
      })
    })
  },
  // 去绑定
  bindEvt() {
    wx.navigateTo({
      url: '../bindphone/bindphone',
    })
  },
  // 搜索商品跳转
  searchEvt() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 获取供应商列表
  getStoreList() {
    wx.$ajax(
      'merchant.storeList'
    ).then(res => {
      this.setData({
        wholesalerList: res['wholesaler_list']
      })
    })
  },
  // 选择供应商事件
  pickerEvt(e) {
    wx.reLaunch({
      url: 'home?id=' + this.data.wholesalerList[e.detail.value]
    })
  },
  // 查看供应商资料页
  storeEvt() {
    wx.navigateTo({
      url: '../info/info',
    })
  },
  // 领取优惠券
  receiveEvt(e) {
    wx.$ajax(
      'sales.receiveCoupon',
      { rule_id: e.currentTarget.dataset.id }
    ).then(res => {
      let idx = e.currentTarget.dataset.idx
      let couponList = this.data.couponList
      couponList[idx].state = !couponList[idx].state
      wx.$toast('领取成功')
      this.setData({
        couponList
      })
    })
  },
  // 查看优惠券列表页
  couponEvt(e) {
    if (e.currentTarget.dataset.state){
      wx.navigateTo({
        url: '../coupon/coupon',
      })
    }
  },
  // 促销活动事件
  promotionEvt(e) {
    let item = e.currentTarget.dataset.item
    if (item.type === 1) {
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?product_id=' + item['product_id']
      })
    } else if (item.type === 2) {
      wx.navigateTo({
        url: '../special/special?id=' + item['rule_id']
      })
    } else if (item.type === 3) {
      this.setData({
        promotionShow: true,
        promotionInfo: item
      })
    }
  },
  // 促销活动 弹窗 关闭事件
  closePromoEvt() {
    this.setData({
      promotionShow: false
    })
  },
  // 优惠券展开或折叠
  openEvt() {
    this.setData({
      openState: !this.data.openState
    })
  },
  // 分类跳转
  navEvt(e) {
    console.log(wx.$data.cateId)
    wx.$data.cateId = e.currentTarget.dataset.id
    wx.switchTab({
      url: '../classify/classify' 
    })
  },
  // 天天特价子标题跳转
  topicTap() {
    wx.navigateTo({
      url: '../special/special'
    })
  },
  // 特价事件
  topicEvt(e) {
    wx.navigateTo({
      url: '../special/special?id=' + e.currentTarget.dataset.id
    })
  },
  // 活动促销事件
  activityEvt (e) {
    wx.navigateTo({
      url: '../special/special?id=' + e.currentTarget.dataset.id
    })
  },
  // 获取热门推荐商品
  getHotGoods() {
    if (this.data.count >= this.data.page) {
      wx.$ajax(
        'merchant.recommendProductList',
        { page: this.data.page },
        { isSaler: true }
      ).then(res => {
        let productList = res['product_list']
        productList.map(item => {
          if (item['shelf_life'] === '') {
            item['spec'] = item['unite_specification']
          } else {
            item['spec'] = item['unite_specification'] + '|' + item['shelf_life']
          }
          for (let i = 0; i < item['tags'].length; i++) {
            if (!item['tags'][i]['color']) item['tags'][i]['color'] = '#D4372F'
          }
          return item
        })
        this.setData({
          page: res.pages['page'] + 1,
          count: res.pages['last_page'],
          productList: this.data.productList.concat(productList)
        })
      })
    }
  },
  // 刷新热门推荐商品
  onReachBottom() {
    this.getHotGoods()
  },
  // 跳转商品详情
  detailsEvt(e) {
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?product_id=' + e.currentTarget.dataset.id,
    })
  },
  // 购买事件
  buyEvt(e) {
    if (wx.$data.is_bind_customer) {
      let { product_id, num, price, qty } = e.target.dataset.item
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
    let prod = { product_id: this.data.prodId, num: e.detail, selected: 1 };
    wx.$ajax(
      'merchant.updateItems',
      { products: [prod] },
      { isSaler: true }
    )
  },
  // 转发
  onShareAppMessage() {
    return {
      title: '小程序slogan',
      path: '/pages/home/home?name=123'
    }
  }
})