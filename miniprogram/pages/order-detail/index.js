Page({
  data: {
    order: null,
    loading: false,
    statusMap: {
      CREATED: '已创建',
      PAID: '已支付',
      FULFILLING: '制作中',
      COMPLETED: '已完成',
      CANCELED: '已取消'
    }
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
      wx.showToast({ title: '订单已取消' })
      this.fetchOrder()
    }).catch(() => {
      wx.showToast({ title: '暂无法取消订单', icon: 'none' })
    })
  }
})
