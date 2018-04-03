const ajax = require('plugins/ajax.js')
const constant = require('config/constant.js')
const { toast } = require('utils/pack.js')

App({
  onLaunch(opts) {
    // 设置 调试
    wx.setEnableDebug({
      enableDebug: true,
    })
    wx.$ajax = ajax // 设置 全局网络请求
    wx.$toast = toast // 封装 wx.showToast
    wx.$const = constant // 常量配置
    wx.$data = this.data // 设置 全局数据
    this.login()
  },
  // 全局数据，直接通过 wx.$data 获取
  data: {},
  // 登录
  login() {
    wx.login({
      success: res => {
        wx.$code = res.code
        wx.$ajax(
          'customers.login',
          { code: res.code },
          { noToken: true, raw: true }
        ).then(ret => {
          if (ret.code === 0) {
            Object.assign(wx.$data, ret.data)
            wx.$init && wx.$init()
          } else {
            wx.$toast(ret.msg)
          }
        })
      }
    })
  }
})