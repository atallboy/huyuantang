'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  onLoad: function onLoad(e) {
    this.setData({ order_id: e.order_id });
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  },

  onShow: function onShow() {
    this.initData();
  },
  initData: function initData(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getDeliverDetail',
      data: {
        token: wx.getStorageSync('token'),
        order_id: this.data.order_id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          detail: res.data.data
        });
      }
    });
  }
});