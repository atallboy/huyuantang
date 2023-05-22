'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    cate_id: 0,
    mch_id: 0,
    type: '',
    product_type: ''
  },
  onLoad: function onLoad(e) {
    if (e.cate_id) this.setData({ cate_id: e.cate_id });
    if (e.type) this.setData({ type: e.type });
    if (e.mch_id) this.setData({ mch_id: e.mch_id });
    if (e.product_type) this.setData({ product_type: e.product_type });
  },


  onShow: function onShow() {
    this.getGoodsList();
  },

  onPullDownRefresh: function onPullDownRefresh() {
    this.getGoodsList();
    wx.stopPullDownRefresh();
  },

  detail: function detail(e) {
    wx.navigateTo({ url: 'detail?id=' + e.currentTarget.dataset.id });
  },
  getGoodsList: function getGoodsList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductList',
      data: {
        token: wx.getStorageSync('token'),
        cate_id: this.data.cate_id,
        mch_id: this.data.mch_id,
        type: this.data.type,
        product_type: this.data.product_type
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data.list
        });
        wx.setNavigationBarTitle({ title: res.data.data.page_title });
      }
    });
  },
  addcar: function addcar(e) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });return;
    }
    var v = e.currentTarget.dataset.v;
    if (v.attribute_list.length > 0) {
      wx.navigateTo({ url: 'detail?id=' + e.currentTarget.dataset.id });
      return;
    }
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/addcar',
      data: {
        token: wx.getStorageSync('token'),
        product_id: e.currentTarget.dataset.id,
        type: 1
      },
      success: function success(res) {
        console.log(res);
        if (res.data.data > 0) {
          wx.showToast({ title: '已加入购物车' });
        }
      }
    });
  }
});