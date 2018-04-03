// pages/leftSwiperDel/index.js

Page({
  data: {
    isEdit: false,
    hasCart: true, // 购物车中是否有商品

    rule_title: '', // e.g.全场满减
    rule_str: '', // e.g.再买300元，可减100元
    store_rule_short: '', // e.g.特价商品不参与本活动
    activities: [], // 活动
    products: [], // 购物车中所有商品
    // prodsNum: 0, // 购物车商品数量

    min_trade_amount: '', // 起送价
    diff_amount: '', // 还差多少满起送价
    grand_total: '', // 小计
    sub_total: '', // 总额
    prom_total: '', // 优惠金额

    deliveryPriceDlg: true, // 起送价说明弹框
    selectAll: 0, // 0 全不选，1 全选
    checkedNum: 0, // 选中商品的数量
    isOpen: false, // 是否打开无法结算商品弹框
    invalidProds: [], // 无法结算的商品

    // 购买弹框
    isBuy: false,
    prodId: '', // 商品ID
    num: 0, // 购买数量
    price: 0, // 单价
    stock: 0 // 库存数量
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onShow: function () {
    console.log('on show in cart')
    wx.$ajax('merchant.cartItems', {
      isSaler: true
    }).then(res => {
      if (res) {
        this.updateData(res)
      }
    })
  },
  updateData (cart) {
    if (!cart || !cart.rule_cart || cart.rule_cart.length === 0) {
      this.setData({
        hasCart: false
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    this.data.activities = cart.rule_cart
    this.data.products = this.products()
    // this.data.prodsNum = this.prodsNum()
    this.data.checkedNum = this.checkedNum()
    this.data.selectAll = this.selectAll()
    this.setData({
      rule_title: cart.rule_title,
      rule_str: cart.rule_str,
      store_rule_short: cart.store_rule_short,
      min_trade_amount: cart.min_trade_amount,
      diff_amount: (cart.min_trade_amount - cart.sub_total).toFixed(2),
      grand_total: cart.grand_total,
      sub_total: cart.sub_total,
      prom_total: cart.prom_total,
      activities: cart.rule_cart,
      products: this.data.products,
      checkedNum: this.data.checkedNum,
      selectAll: this.data.selectAll
    });
    wx.hideLoading()
  },
  products () {
    let activities = this.data.activities;
    let products = []
    for (let i = 0, len = activities.length; i < len; i++) {
      if (activities[i].product) {
        products.push(...activities[i].product)
      }
    }
    return products;
  },
  // prodsNum () {
  //   let num = 0, products = this.data.products;
  //   products.map(prod => { num+= prod.num });
  //   return num;
  // },
  checkedNum () {
    let products = this.data.products;
    let checkedNum = products.filter(prod => { return prod.selected === 1 }).length;
    return checkedNum;
  },
  selectAll () {
    let products = this.data.products;
    let checkedNum = this.data.checkedNum;
    if (checkedNum === products.length) {
      return 1
    } else {
      return 0
    }
  },
  changeNum (e) {
    // 修改购物弹框的商品数量
    let { product_id, num, price, qty } = e.target.dataset.item
    this.setData({
      isBuy: true,
      prodId: product_id,
      num: num,
      price: price,
      stock: qty
    })
  },
  confirmNum (e) {
    let products = this.data.products, prod = { product_id: this.data.prodId, num: e.detail };
    products.map(product => {
      if (product.product_id === prod.product_id) {
        prod.selected = product.selected
      }
    })
    wx.$ajax('merchant.updateItems', {
      products: [prod]
    }, {
      isSaler: true
    }).then(res => {
      this.updateData(res)
    })
  },
  deleteProducts (e) {
    // 删除商品
    let product = e.currentTarget.dataset.prod, products = this.data.products, prods = [];
    if (product) {
      // 删除单个商品
      prods.push({
        product_id: product.product_id,
        num: product.num
      })
    } else {
      // 删除多个商品
      for (let i = 0, len = products.length; i < len; i++) {
        if (products[i].selected) {
          prods.push({
            product_id: products[i].product_id,
            num: products[i].num
          })
        }
      }
    }
    wx.$ajax('merchant.removeCartItems', {
      products: prods
    }, {
      isSaler: true
    }).then(res => {
      this.updateData(res)
    })
  },
  handleSelectAll (e) {
    // 全选是["selectAll"]，不全选是[]，selected = 1 选中商品，0 不选中商品
    let products = this.data.products, prods = [];
    for (let i = 0, len = products.length; i < len; i++) {
      let prod = {
        product_id: products[i].product_id,
        selected: e.detail.value[0] === 'selectAll' ? 1 : 0,
        num: products[i].num
      }
      prods.push(prod)
    }
    wx.$ajax('merchant.updateItems', {
      products: prods
    }, {
      isSaler: true
    }).then(res => {
      this.updateData(res)
    })
  },
  checkboxChange (e) {
    // 勾选单个商品
    console.log(e)
    let products = this.data.products, values = e.detail.value, prods = [];
    for (let i = 0, lenI = products.length; i < lenI; i++) {
      let prod = { product_id: products[i].product_id, selected: 0, num: products[i].num }
      for (let j = 0, lenJ = values.length; j < lenJ; j++) {
        if (prod.product_id == values[j]) { // 通过values来匹配选中项
          prod.selected = 1;
          break;
        }
      }
      prods.push(prod)
    }
    console.log(prods)
    wx.$ajax('merchant.updateItems', {
      products: prods
    }, {
      isSaler: true
    }).then(res => {
      this.updateData(res)
    })
  },
  explDeliveryPrice () {
    // 显示起送价说明弹框
    wx.showModal({
      title: '起送价规则',
      content: '1、默认按供货商设置的起送价。\r\n2、免起送条件：每天下单时，如有未接单状态的订单，且商品金额大于起送金额，则本单免起送价',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  placeAnOrder () {
    // 去下单
    // wx.showModal({
    //   content: '特价商品不参与全场活动，优惠计算时会扣除特价商品金额。',
    //   showCancel: false,
    //   confirmText: '知道了'
    // })
    wx.$ajax('merchant.invalidateCartItemsProducts', {
      products: this.data.products
    }, {
      isSaler: true
    }).then(res => {
      if (res.data && res.data.length > 0) {
        this.setData({
          isOpen: true,
          invalidProds: res.data
        })
      }
    })
  },
  editOrFinish () {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  closeDialog () {
    this.setData({
      isOpen: false
    })
  }
})