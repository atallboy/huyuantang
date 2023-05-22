'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    list: []
  },

  onLoad: function onLoad() {
    this.initData();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  },

  detail: function detail(e) {
    wx.navigateTo({ url: 'fans?id=' + e.currentTarget.dataset.id });
  },
  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getFansReward',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data
        });
      }
    });
  }
});