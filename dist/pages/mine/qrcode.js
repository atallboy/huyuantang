'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  onShow: function onShow() {
    this.getUserInfo();
  },
  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          user: res.data.data
        });
        wx.setStorageSync('user', res.data.data);
      }
    });
  }
});