Page({
  data: {
    orders: [],
    statusMap: {
      CREATED: '已创建',
      PAID: '已支付',
      FULFILLING: '制作中',
      COMPLETED: '已完成',
      CANCELED: '已取消'
    }
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
