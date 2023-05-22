'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    list: [],
    id: 0,
    page: 0
  },

  onLoad: function onLoad(e) {
    this.setData({ id: e.id });
    this.initData();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  },

  detail: function detail(e) {},
  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getFansRecord',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.id,
        page: this.data.page
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: that.data.list.concat(res.data.data)
        });
      }
    });
  },


  onReachBottom: function onReachBottom() {
    // 页面触底时执行
    this.setData({
      page: this.data.page + 1
    });
    this.initData();
  }

});