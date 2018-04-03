Page({
  openAuth() {
    // 跳转 权限设置
    wx.openSetting({
      success: res => {
        // 开启 获取用户信息
        if (res.authSetting['scope.userInfo']) {
          this.getUserInfo()
        } else {
          wx.$toast('请开通您的用户信息权限')
        }
      }
    })
  },
  // 获取用户信息
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        wx.switchTab({
          url: '../home/home',
        })
      }
    })
  }
})
