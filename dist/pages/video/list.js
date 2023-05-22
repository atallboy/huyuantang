'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    tab_style: {
      'min-width': '90px'
    },
    inkBarStyle: {},
    cate: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    list: [],
    current: 0,
    c_ready: true,
    cate_id: 0
  },

  onShow: function onShow() {
    this.getCate();
    this.getList();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getCate();
    this.getList();
    wx.stopPullDownRefresh();
  },

  handleChange: function handleChange(e) {
    console.log(e);
    this.setData({ cate_id: this.data.cate[e.detail.index].id });
    this.getList();
  },
  detail: function detail(e) {
    wx.navigateTo({ url: 'detail?id=' + e.currentTarget.dataset.id });
  },
  getCate: function getCate(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getvideoCate',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          cate: res.data.data,
          c_ready: false
        });
      }
    });
  },
  getList: function getList(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getVideoList',
      data: {
        token: wx.getStorageSync('token'),
        cate_id: this.data.cate_id
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