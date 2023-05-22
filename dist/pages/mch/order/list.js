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

  getOrderList: function getOrderList() {
    var that = this;
    var c = this.data.current;
    var cu = void 0;
    if (c == 0) {
      cu = 0;
    } else if (c == 1) {
      cu = 2;
    } else if (c == 2) {
      cu = 3;
    } else if (c == 3) {
      cu = 4;
    }

    app.util.request({
      'url': 'entry/wxapp/getOrderList',
      data: {
        token: wx.getStorageSync('token'),
        status: cu,
        mch_id: wx.getStorageSync('user').mch_id
      },
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