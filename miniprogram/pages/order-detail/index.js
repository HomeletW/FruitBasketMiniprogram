Page({
  data: {
    order: null,
    loading: false
  },
  onLoad(query) {
    this.setData({ orderId: query.id })
    this.fetchOrder()
  },
  fetchOrder() {
    if (!this.data.orderId) return
    this.setData({ loading: true })
    wx.cloud.callFunction({
      name: 'getMyOrderDetail',
      data: { id: this.data.orderId }
    }).then((res) => {
      this.setData({ order: res.result.data })
    }).finally(() => {
      this.setData({ loading: false })
    })
  },
  cancelOrder() {
    if (!this.data.orderId) return
    wx.cloud.callFunction({
      name: 'cancelMyOrder',
      data: { id: this.data.orderId }
    }).then(() => {
      wx.showToast({ title: 'Order canceled' })
      this.fetchOrder()
    }).catch(() => {
      wx.showToast({ title: 'Unable to cancel', icon: 'none' })
    })
  }
})
