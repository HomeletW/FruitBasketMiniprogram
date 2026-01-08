const allCases = [
  {
    id: 1,
    title: "生日惊喜花果礼",
    desc: "为闺蜜准备的生日仪式感，偏粉色系，甜感满满。",
    tags: ["生日", "闺蜜"],
    imageUrl: "/assets/case-1.png"
  },
  {
    id: 2,
    title: "感谢老师心意篮",
    desc: "表达毕业季谢意，清新雅致，搭配可食用鲜果。",
    tags: ["毕业季", "感谢"],
    imageUrl: "/assets/case-2.png"
  },
  {
    id: 3,
    title: "父母纪念日礼盒",
    desc: "稳重温暖风格，强调健康与陪伴。",
    tags: ["纪念日", "父母"],
    imageUrl: "/assets/case-3.png"
  },
  {
    id: 4,
    title: "新居乔迁祝福",
    desc: "明亮大气，适合摆放客厅，提升氛围。",
    tags: ["乔迁", "祝福"],
    imageUrl: "/assets/case-4.png"
  },
  {
    id: 5,
    title: "求婚心动礼篮",
    desc: "法式浪漫，搭配玫瑰与高颜值水果。",
    tags: ["求婚", "浪漫"],
    imageUrl: "/assets/case-5.png"
  },
  {
    id: 6,
    title: "探望长辈暖心篮",
    desc: "低糖清淡口感，注重健康与关怀。",
    tags: ["探望", "长辈"],
    imageUrl: "/assets/case-6.png"
  },
  {
    id: 7,
    title: "同事升职祝贺",
    desc: "高级感礼盒，强调体面与祝福。",
    tags: ["职场", "祝贺"],
    imageUrl: "/assets/case-1.png"
  },
  {
    id: 8,
    title: "宝宝满月礼",
    desc: "柔和色调，适合新生家庭的温柔氛围。",
    tags: ["宝宝", "满月"],
    imageUrl: "/assets/case-2.png"
  }
];

Page({
  data: {
    bannerUrl: "/assets/banner.png",
    slogan: "开心的从来不是收礼物，而是被爱",
    promotion: {
      title: "初夏限定 · 甜感加倍",
      desc: "下单享定制卡片与专属祝福语设计。",
      imageUrl: "/assets/promo.png"
    },
    cases: allCases.slice(0, 6),
    hasMore: allCases.length > 6,
    isLoadingMore: false
  },
  onLoad() {},
  goAdminLogin() {
    wx.navigateTo({
      url: "/pages/admin-login/index"
    });
  },
  goOrder() {
    wx.navigateTo({
      url: "pages/orders/index"
    });
  },
  handleLoadMore() {
    if (!this.data.hasMore || this.data.isLoadingMore) {
      return;
    }
    this.setData({ isLoadingMore: true });
    setTimeout(() => {
      const currentLength = this.data.cases.length;
      const nextCases = allCases.slice(0, currentLength + 3);
      this.setData({
        cases: nextCases,
        hasMore: nextCases.length < allCases.length,
        isLoadingMore: false
      });
    }, 400);
  }
});
