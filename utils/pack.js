/**
 * wx.toast封装
 *    title: 提示信息，无默认值
 *    duration: 显示时长，默认为1500毫秒
 */
const toast = (title, duration = 1500) => {
  wx.showToast({
    title,
    icon: 'none',
    duration,
    mask: true
  })
}

module.exports = {
  toast
}
