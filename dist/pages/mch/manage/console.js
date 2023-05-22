'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    wait_num: 2,
    customStyle: {
      'background-color': '#006BFF'
    }
  },

  onLoad: function onLoad(e) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../../login/login' });
    }
  },
  onShow: function onShow() {
    this.getUserInfo();
    this.getMchDetail();
  },
  toOrder: function toOrder(e) {
    wx.navigateTo({ url: '../order/list?status=' + e.currentTarget.dataset.status });
  },
  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        if (res.data.data == -1) {
          wx.navigateTo({ url: '../login/login' });
        }
        that.setData({
          user: res.data.data
        });
        wx.setStorageSync('user', res.data.data);
      }
    });
  },
  getMchDetail: function getMchDetail() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMchDetail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);

        if (res.data.data.step == 1) {
          wx.showModal({
            title: '提示',
            cancelText: '返回',
            confirmText: '申请入驻',
            content: '你还未入驻平台，是否申请入驻？',
            success: function success(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo({ url: '../info/register' });
              } else if (res.cancel) {
                wx.navigateBack();
              }
            }
          });
        } else {
          that.setData({
            detail: res.data.data.info
          });
          // wx.setStorageSync('mch_info',res.data.data)            
        }
      }
    });
  },
  toTixian: function toTixian() {
    wx.navigateTo({ url: '../../balance/withdrawal' });
  },
  toGoodsList: function toGoodsList() {
    wx.navigateTo({ url: '../goods/goods_list' });
  },
  toGoodsCate: function toGoodsCate() {
    wx.navigateTo({ url: '../goods/cate' });
  },
  toStoreInfo: function toStoreInfo() {
    wx.navigateTo({ url: '../info/info_type' });
  },
  toAddGoods: function toAddGoods() {
    wx.navigateTo({ url: '../goods/goods_edit' });
  },
  toServiceList: function toServiceList() {
    wx.navigateTo({ url: '../service/list' });
  },
  toAddService: function toAddService() {
    wx.navigateTo({ url: '../service/edit' });
  },
  toServiceOrder: function toServiceOrder() {
    wx.navigateTo({ url: '../order/service_order' });
  }
});