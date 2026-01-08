Component({
  data: {
    currentUrl: "",
    items: [
      {
        label: "首页",
        desc: "推荐",
        url: "/pages/landing/index"
      },
      {
        label: "定制",
        desc: "下单",
        url: "/pages/customization/index"
      },
      {
        label: "订单",
        desc: "进度",
        url: "/pages/orders/index"
      }
    ]
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      const route = current ? `/${current.route}` : "";
      this.setData({ currentUrl: route });
    }
  },
  methods: {
    handleTap(event) {
      const { url } = event.currentTarget.dataset;
      if (!url || url === this.data.currentUrl) {
        return;
      }
      wx.reLaunch({ url });
    }
  }
});
