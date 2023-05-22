'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    data_type: 0,
    show_add_btn: false
  },
  onLoad: function onLoad(e) {
    this.setData({ product_id: e.product_id, data_type: e.data_type });
    if (e.show_add_btn) {
      this.setData({ show_add_btn: true });
    }
    if (e.data_type == 1) {
      wx.setNavigationBarTitle({ title: '商品评价' });
    } else {
      wx.setNavigationBarTitle({ title: '我的评价' });
    }
  },
  onShow: function onShow() {
    this.initData();
  },
  initData: function initData(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        product_id: that.data.product_id,
        data_type: this.data.data_type
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data.list
        });
      }
    });
  },
  addEva: function addEva() {
    wx.navigateTo({ url: 'construct?product_id=' + this.data.product_id });
  },
  toSheet: function toSheet(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showActionSheet({
      itemList: ['删除', '下架'],
      success: function success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          that.delEvaluation(id);
        }
        if (res.tapIndex == 1) {
          that.downEvaluation(id);
        }
      }
    });
  },
  delEvaluation: function delEvaluation(id) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/delEvaluation',
            data: {
              token: wx.getStorageSync('token'),
              evaluation_id: id
            },
            success: function success(res) {
              console.log(res);
              that.initData();
            }
          });
        }
      }
    });
  },
  downEvaluation: function downEvaluation(id) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定下架该评论吗？',
      success: function success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/downEvaluation',
            data: {
              token: wx.getStorageSync('token'),
              evaluation_id: id
            },
            success: function success(res) {
              console.log(res);
              that.initData();
            }
          });
        }
      }
    });
  },
  zc: function zc(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/czProductEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        evaluation_id: e.currentTarget.dataset.id,
        type: e.currentTarget.dataset.type
      },
      success: function success(res) {
        console.log(res);
        that.initData();
      }
    });
  },
  preImg: function preImg(e) {
    var src = e.currentTarget.dataset.src;
    var arr = e.currentTarget.dataset.srcarr;
    console.log(src);
    wx.previewImage({
      current: src,
      urls: arr
    });
  }
});