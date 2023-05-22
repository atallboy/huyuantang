'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    current: 0,
    inkBarStyle: {
      'width': '20%'
    },
    list: []
  },

  onLoad: function onLoad(e) {
    this.setData({ current: e.status });
  },


  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../../login/login' });
    }
    this.getOrderList();
  },

  onPullDownRefresh: function onPullDownRefresh() {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },

  getOrderList: function getOrderList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getOrderList',
      data: { token: wx.getStorageSync('token'), status: this.data.current },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data
        });
      }
    });
  },
  handleChange: function handleChange(e) {
    var index = e.detail.index;
    this.setData({
      current: index
    });
    this.getOrderList();
  },
  toDetail: function toDetail(e) {
    wx.navigateTo({
      url: 'detail?into_type=1&id=' + e.currentTarget.dataset.id
    });
  },
  openLocation: function openLocation(e) {
    console.log(e);
    var lat = Number(this.data.list[e.currentTarget.dataset.k].address.latitude);
    var lon = Number(this.data.list[e.currentTarget.dataset.k].address.longitude);
    console.log(lat);
    wx.openLocation({ latitude: lat, longitude: lon, scale: 18 });
  }
});