Page({
  data: {
    orders: []
  },
  onShow() {
    this.fetchOrders()
  },
  fetchOrders() {
    wx.cloud.callFunction({ name: 'getMyOrders' }).then((res) => {
      this.setData({ orders: res.result.data || [] })
    }).catch(() => {})
  },
  goDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  }
})
