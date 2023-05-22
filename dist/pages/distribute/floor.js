'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  onLoad: function onLoad() {
    this.initData();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  },

  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMyDistributeRelation',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log('------------');
        console.log(res);
        that.setData({
          list: res.data.data.list
        });
      }
    });
  }
});