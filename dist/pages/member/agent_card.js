'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    list: []
  },

  onShow: function onShow() {
    this.getList();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getList();
    wx.stopPullDownRefresh();
  },

  become: function become(e) {
    wx.navigateTo({ url: 'agent_card_detail?id=' + e.currentTarget.dataset.item.level_id });
  },
  getList: function getList(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMyLevelCard',
      data: {
        token: wx.getStorageSync('token')
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