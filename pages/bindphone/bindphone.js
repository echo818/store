const { countdown } = require('../../utils/util.js')

Page({
  data: {
    time: 60,
    disabled: false,
    visible: false,
    phone: '',
    vcode: ''
  },
  // 输入绑定
  inputEvt(e) {
    let form = {}
    form[e.currentTarget.dataset.type] = e.detail.value
    this.setData(form)
  },
  // 获取验证码
  getCode() {
    if (!this.data.disabled) {
      // 校验手机号码
      if (!wx.$const.PHONE_REG.test(this.data.phone)) {
        wx.$toast('手机号输入有误，请重新输入')
        return
      }
      // 获取验证码按钮 置灰
      this.setData({
        disabled: true
      })
      // 发送请求，获取验证码
      wx.$ajax(
        'customers.getVcode',
        { phone: this.data.phone },
        { raw: true }
      ).then(res => {
        wx.$toast(res.msg)
      })
      // 倒计时
      countdown(time => {
        this.setData({
          time
        })
      }, time => {
        this.setData({
          time,
          disabled: false
        })
      }, this.data.time)
    }
  },
  // 绑定提交
  submitEvt() {
    if (this.data.vcode === '') {
      wx.$toast('验证码不能为空')
      return
    }
    wx.$ajax(
      'customers.customerBind',
      {
        phone: this.data.phone,
        vcode: this.data.vcode
      }
    ).then(res => {
      // this.setData({
      //   visible: true
      // })
      wx.$data.is_bind_customer = 1
      wx.switchTab({
        url: '../home/home',
      })
    })
  },
  // 弹窗关闭回调函数
  closeEvt() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 完善店铺信息 事件
  storeEvt() {
    wx.redirectTo({
      url: '../editshop/editshop',
    })
  }
})