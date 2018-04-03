const {domain: url} = require('../config/index.js')
/**
 * cmd: 接口命令
 * data: 请求参数
 * opts: 额外设置
 *    raw: 原始数据直接返回,默认为false,返回过滤后的数据
 *    noToken: 无token验证,默认为false,需要auth_token验证
 *    isSaler: 是否带有供应商Id,默认为false。如果设置true,则每次请求自动携带供应商Id参数
 *    noLoad: 无加载动画,默认为false,每次请求显示加载动画
 */
module.exports = (cmd, data = {}, opts = {}) => {
  // 如何没有传递data参数，设置参数对象为第二个参数情形
  if (data.raw || data.noToken || data.isSaler || data.noLoad) {
    opts = data
    data = {}
  }
  // 如果noToken为true，则不需要token验证
  if (!opts.noToken) {
    Object.assign(data, {
      wx_user_id: wx.$data['wx_user_id'],
      auth_token: wx.$data['auth_token']
    })
  }
  // 如果isSaler为true，则每次请求自动携带供应商Id参数
  if (opts.isSaler) {
    Object.assign(data, {
      wholesaler_id: wx.$data['wholesaler_id']
    })
  }
  data = {
    cmd,
    data
  }
  // 如果noLoad为true，则不显示加载动画
  if (!opts.noLoad) wx.showLoading({
    title: '数据加载中...',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method: 'POST',
      success: res => {
        res = res.data
        // 如果noLoad为true，则不加载动画
        if (!opts.noLoad) wx.hideLoading()
        if (res.code === 0) {
          if (!opts.raw) {
            resolve(res && res.data)
          } else {
            resolve(res)
          }
        } else {
          wx.$toast(res.msg)
        }
      },
      fail: err => {
        // 如果noLoad为true，则不加载动画
        if (!opts.noLoad) wx.hideLoading()
        if (!opts.errMsg) {
          reject(err)
        } else {
          reject(err)
        }
      }
    })
  })
}
