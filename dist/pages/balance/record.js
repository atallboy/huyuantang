'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    user: { balance: '' },
    list: [],
    page: 0
  },

  onLoad: function onLoad(e) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
  },
  onShow: function onShow() {
    this.getUserInfo();
    this.initData();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getUserInfo();
    this.initData();
    wx.stopPullDownRefresh();
  },

  cz: function cz() {
    wx.navigateTo({ url: 'recharge' });
  },
  tx: function tx() {
    wx.navigateTo({ url: 'withdrawal' });
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
  },
  initData: function initData(e) {
    console.log(e);

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetBalanceRecord',
      data: {
        token: wx.getStorageSync('token'),
        page: this.data.page
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: that.data.list.concat(res.data.data.list)
        });
      }
    });
  },


  onReachBottom: function onReachBottom() {
    this.setData({
      page: this.data.page + 1
    });
    this.initData();
  }

});