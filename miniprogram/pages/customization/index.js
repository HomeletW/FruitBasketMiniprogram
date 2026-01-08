Page({
  data: {
    basketName: '',
    message: '',
    deliveryDate: '',
    contactName: '',
    contactPhone: '',
    address: '',
    loading: false
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },
  onDateChange(e) {
    this.setData({ deliveryDate: e.detail.value })
  },
  submitOrder() {
    if (this.data.loading) return
    this.setData({ loading: true })
    const orderPayload = {
      basketName: this.data.basketName,
      message: this.data.message,
      deliveryDate: this.data.deliveryDate,
      contactName: this.data.contactName,
      contactPhone: this.data.contactPhone,
      address: this.data.address
    }
    wx.cloud.callFunction({
      name: 'createOrderAndPay',
      data: orderPayload
    }).then((res) => {
      const payment = res.result && res.result.payment
      if (payment) {
        wx.requestPayment({
          ...payment,
          success: () => {
            wx.showToast({ title: 'Payment success' })
            wx.navigateTo({ url: '/pages/orders/index' })
          },
          fail: () => {
            wx.showToast({ title: 'Payment canceled', icon: 'none' })
          }
        })
      }
    }).catch(() => {
      wx.showToast({ title: 'Failed to create order', icon: 'none' })
    }).finally(() => {
      this.setData({ loading: false })
    })
  }
})
