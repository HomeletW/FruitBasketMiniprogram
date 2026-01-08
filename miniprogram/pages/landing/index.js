Page({
  data: {
    featured: []
  },
  onLoad() {
    this.loadContent()
  },
  loadContent() {
    wx.cloud.callFunction({
      name: 'adminGetContent',
      data: { key: 'landing' }
    }).then((res) => {
      if (res.result && res.result.data) {
        this.setData({ featured: res.result.data.sections || [] })
      }
    }).catch(() => {})
  },
  goCustomize() {
    wx.navigateTo({ url: '/pages/customization/index' })
  },
  goOrders() {
    wx.navigateTo({ url: '/pages/orders/index' })
  }
})
