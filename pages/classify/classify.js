Page({
  data: {
    // 购买弹框
    buyShow: false, // 弹框是否显示
    prodId: '', // 商品ID
    num: '', // 购买数量
    buyPrice: '', // 单价
    stock: '', // 库存数量
    sortShow: false, // 排序选择 显示/隐藏
    brandShow: false, // 品牌选择 显示/隐藏
    buyShow: false, // 购买图层 显示或隐藏
    page: 1,
    count: 1,
    cateId: '', // 默认第一个分类Id
    cateList: [], // 分类列表信息
    brandKeys: [], // 品牌选中的key
    brandList: [], // 品牌列表信息
    brandArr: [], // 热门品牌列表信息
    productList: [] // 商品列表
  },

  onLoad() {
    this.getCategory()
  },
  onShow() {
    this.getCategory()
  },
  // 获取分类信息
  getCategory() {
    wx.$ajax(
      'merchant.getWholesalerCategory',
      { isSaler: true }
    ).then(res => {
      let cateId = wx.$data.cateId
      if (!cateId) cateId = res[0] ? res[0]['id'] : 0
      this.setData({
        cateId,
        cateList: res
      })
      this.getCateData()
    })
  },
  // 切换分类
  switchCate(e) {
    this.setData({
      page: 1,
      count: 1,
      productList: [],
      cateId: e.currentTarget.dataset.id
    })
    this.getCateData()
    this.getGoods()
  },
  // 获取分类后的数据
  getCateData() {
    this.getGoods()
    this.getBrand()
  },
  // 获取品牌信息
  getBrand() {
    wx.$ajax(
      'merchant.brand',
      { "first_category_id": this.data.cateId },
      { isSaler: true }
    ).then(res => {
      let brandList = res.brand_list
      let brandArr = brandList
      if (brandList.length > 6) {
        brandArr = brandList.slice(0, 5)
      }
      this.setData({
        brandList,
        brandArr
      })
    })
  },
  // 品牌选中或取消事件
  brandSelect(e) {
    let idx = e.currentTarget.dataset.idx
    let brandKeys = this.data.brandKeys
    let index = brandKeys.indexOf(idx)
    if (index > -1) {
      brandKeys.splice(index, 1)
      this.setData({
        brandKeys
      })
    } else {
      brandKeys.push(idx)
      this.setData({
        brandKeys
      })
    }
  },
  // 获取商品信息
  getGoods() {
    if (this.data.count >= this.data.page) {
      wx.$ajax(
        'merchant.searchProduct',
        { "first_category_id": this.data.cateId },
        { isSaler: true }
      ).then(res => {
        let productList = res['product_list']
        productList.map(item => {
          if (item['shelf_life'] === '') {
            item['spec'] = item['unite_specification']
          } else {
            item['spec'] = item['unite_specification'] + '|' + item['sales_attribute_value']
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
  // 搜索事件
  searchEvt() {
    wx.navigateTo({
      url: '../search/search'
    })
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
  // 排序事件
  sortEvt() {
    this.setData({
      sortShow: !this.data.sortShow
    })
  },
  // 品牌事件
  brandEvt() {
    this.setData({
      brandShow: !this.data.brandShow
    })
  },
  onHide() {
    wx.$data.cateId = ''
  },
  onUnload() {
    wx.$data.cateId = ''
  }
})