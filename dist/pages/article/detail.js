'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var WxParse = require('../../static/utils/wxParse/wxParse.js');
var app = getApp();
exports.default = Page({
  data: {
    id: 1,
    type: '',
    detail: {}
  },

  onLoad: function onLoad(e) {
    if (e.id) {
      this.setData({ id: e.id });
    }
    if (e.type) {
      this.setData({ type: e.type });
    }

    this.initData();
  },
  onShow: function onShow() {},


  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  },

  addScore: function addScore(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/AddScore',
      data: {
        token: wx.getStorageSync('token'),
        id: that.data.id,
        type: that.data.type
      },
      success: function success(res) {
        console.log(res);
        if (res.data.data > 0) {
          wx.showToast({ title: '\u79EF\u5206\uFF1A+' + res.data.data, icon: "success" });
        }
      }
    });
  },
  initData: function initData(e) {
    console.log(e);

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getArticleDetail',
      data: {
        token: wx.getStorageSync('token'),
        id: that.data.id
      },
      success: function success(res) {
        console.log(res);
        wx.setNavigationBarTitle({
          title: res.data.data.title
        });
        that.setData({
          detail: res.data.data
        });
        WxParse.wxParse('article', 'html', res.data.data.detail, that, 5);

        if (wx.getStorageSync('token') && res.data.data.valid.current_obj_get == 0) {
          setTimeout(function () {
            that.addScore();
          }, 5000);
        }
      }
    });
  }
});