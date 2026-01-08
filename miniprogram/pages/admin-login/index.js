Page({
  data: {
    username: '',
    password: ''
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },
  login() {
    wx.cloud.callFunction({
      name: 'adminLogin',
      data: {
        username: this.data.username,
        password: this.data.password
      }
    }).then((res) => {
      const token = res.result && res.result.token
      if (token) {
        wx.setStorageSync('adminToken', token)
        wx.navigateTo({ url: '/pages/admin-dashboard/index' })
      }
    }).catch(() => {
      wx.showToast({ title: 'Login failed', icon: 'none' })
    })
  }
})
