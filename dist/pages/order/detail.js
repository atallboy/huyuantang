'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    id: 0,
    data: [],
    into_type: 0
  },

  onLoad: function onLoad(e) {
    this.setData({
      // id:122,
      id: e.id,
      into_type: e.into_type
    });
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getGoodsOrderDetail();
    wx.stopPullDownRefresh();
  },

  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../../login/login' });
    }
    this.getGoodsOrderDetail();
  },

  getGoodsOrderDetail: function getGoodsOrderDetail() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getOrderDetail',
      data: { token: wx.getStorageSync('token'), id: this.data.id },
      success: function success(res) {
        console.log(res);
        that.setData({
          data: res.data.data
        });
      }
    });
  },
  pay: function pay() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/OrderDo',
      data: {
        token: wx.getStorageSync('token'),
        id: that.data.id,
        op: 'pay'
      },
      success: function success(res) {
        console.log(res);
        var param = res.data.data.payInfo;
        wx.requestPayment({
          timeStamp: param.timeStamp,
          nonceStr: param.nonceStr,
          package: param.package,
          signType: param.signType,
          paySign: param.paySign,
          'success': function success(res) {},
          fail: function fail(res) {
            console.log(res);
          },
          complete: function complete(res) {
            that.getGoodsOrderDetail();
          }
        });
      }
    });
  },
  cancel: function cancel() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗',
      success: function success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/OrderDo',
            data: {
              token: wx.getStorageSync('token'),
              id: that.data.id,
              op: 'cancel'
            },
            success: function success(res) {
              console.log(res);
              that.getGoodsOrderDetail();
            }
          });
        }
      }
    });
  },
  confirm: function confirm() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定完成订单吗',
      success: function success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/OrderDo',
            data: {
              token: wx.getStorageSync('token'),
              id: that.data.id,
              op: 'confirm'
            },
            success: function success(res) {
              console.log(res);
              that.getGoodsOrderDetail();
            }
          });
        }
      }
    });
  },
  toEva: function toEva() {
    wx.navigateTo({ url: '../evaluation/edit?order_id=' + this.data.id });
  },
  refund: function refund() {
    wx.navigateTo({ url: 'refund?order_id=' + this.data.id });
  },
  sendGoods: function sendGoods() {
    wx.navigateTo({ url: '../../deliver/send?order_id=' + this.data.id });
  },
  checkDeliver: function checkDeliver() {
    wx.navigateTo({ url: '../deliver/detail?order_id=' + this.data.id });
  },
  openLocation: function openLocation() {
    var lat = Number(this.data.data.snap.latitude);
    var lon = Number(this.data.data.snap.longitude);
    console.log(lat);
    wx.openLocation({ latitude: lat, longitude: lon, scale: 18 });
  },
  call: function call() {
    wx.makePhoneCall({ phoneNumber: this.data.data.snap.tel });
  }
});