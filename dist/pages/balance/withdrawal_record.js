'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  onLoad: function onLoad(options) {
    if (!wx.getStorageSync('token')) {
      wx.showModal({ title: '提示', content: '登录后才可以操作哦', success: function success(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '../login/login' });
          } else if (res.cancel) {
            wx.navigateBack({ delta: 1 });
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    this.getList();
  },

  onPullDownRefresh: function onPullDownRefresh() {
    this.getList();
    wx.stopPullDownRefresh();
  },

  getList: function getList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getWithdrawalRecord',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data.list
        });
      }
    });
  }
});