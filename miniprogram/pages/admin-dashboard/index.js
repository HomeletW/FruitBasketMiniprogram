Page({
  data: {
    orders: [],
    contentKey: 'landing',
    contentValue: ''
  },
  onShow() {
    this.fetchOrders()
    this.fetchContent()
  },
  getAdminToken() {
    return wx.getStorageSync('adminToken')
  },
  fetchOrders() {
    wx.cloud.callFunction({
      name: 'adminListOrders',
      data: { adminToken: this.getAdminToken() }
    }).then((res) => {
      this.setData({ orders: res.result.data || [] })
    }).catch(() => {})
  },
  updateStatus(e) {
    const { id, status } = e.currentTarget.dataset
    wx.cloud.callFunction({
      name: 'adminUpdateOrderStatus',
      data: { adminToken: this.getAdminToken(), id, status }
    }).then(() => {
      wx.showToast({ title: 'Updated' })
      this.fetchOrders()
    }).catch(() => {
      wx.showToast({ title: 'Update failed', icon: 'none' })
    })
  },
  onContentInput(e) {
    this.setData({ contentValue: e.detail.value })
  },
  fetchContent() {
    wx.cloud.callFunction({
      name: 'adminGetContent',
      data: { key: this.data.contentKey }
    }).then((res) => {
      this.setData({ contentValue: JSON.stringify(res.result.data || {}, null, 2) })
    }).catch(() => {})
  },
  saveContent() {
    wx.cloud.callFunction({
      name: 'adminUpdateContent',
      data: {
        adminToken: this.getAdminToken(),
        key: this.data.contentKey,
        value: this.data.contentValue
      }
    }).then(() => {
      wx.showToast({ title: 'Content updated' })
    }).catch(() => {
      wx.showToast({ title: 'Content update failed', icon: 'none' })
    })
  }
})
