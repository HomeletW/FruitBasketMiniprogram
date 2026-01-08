App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('wx.cloud not available')
      return
    }
    wx.cloud.init({
      traceUser: true
    })
  }
})
