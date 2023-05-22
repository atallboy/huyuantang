'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    tab_style: {
      'min-width': '120px'
    },
    inkBarStyle: {
      // 'width': '20%',
    },
    cate: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    list: [],
    current: 0,
    c_ready: true,
    cate_id: 0
  },

  onShow: function onShow() {
    this.getCate();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getCate();
    wx.stopPullDownRefresh();
  },

  detail: function detail(e) {
    wx.navigateTo({ url: 'detail?id=' + e.currentTarget.dataset.id });
  },
  handleChange: function handleChange(e) {
    console.log(e);
    this.setData({ cate_id: this.data.cate[e.detail.index].id });
    this.getList();
  },
  getCate: function getCate(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getArticleCate',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          cate: res.data.data,
          c_ready: false,
          cate_id: res.data.data[0].id
        });
        that.getList();
      }
    });
  },
  getList: function getList(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getArticleList',
      data: {
        token: wx.getStorageSync('token'),
        cate_id: this.data.cate_id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data
        });
      }
    });
  }
});