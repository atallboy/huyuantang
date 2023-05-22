'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
exports.default = Page({
  data: {
    is_del: false,
    is_sel: false,
    total_price: 0.00
  },

  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '../../login/login'
      });
    }
    this.setData({
      is_del: false,
      is_sel: false,
      is_all_sel: false,
      total_price: 0.00
    });
    this.getCar();
  },

  onPullDownRefresh: function onPullDownRefresh() {
    this.getCar();
    wx.stopPullDownRefresh();
  },

  delCarGoods: function delCarGoods() {
    var p = [];
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].is_sel == 1) {
        p.push(list[i].car_id);
      }
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/delCarProduct',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        p: p.join('&')
      },
      success: function success(res) {
        that.getCar();
      }
    });
  },
  submit: function submit() {
    var p = [];
    var list = this.data.list;
    var c = '';
    for (var i = 0; i < list.length; i++) {
      if (list[i].is_sel == 1) {
        p.push(list[i].car_id);
      }
    }
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/SubmitCarProduct',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        p: p.join('&'),
        total_price: this.data.total_price
      },
      success: function success(res) {
        if (res.data.errno == 0) {
          wx.navigateTo({
            url: '../order/submit?into_type=2&type=2&car_order_id=' + res.data.data
          });
        }
      }
    });
  },
  getCar: function getCar() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getCarInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        that.setData({
          list: res.data.data
        });
      }
    });
  },
  sel: function sel(e) {
    var k = e.currentTarget.dataset.k;
    var d = e.currentTarget.dataset.d;
    var a = 'list[' + k + '].is_sel';
    this.setData(_defineProperty({}, a, d));
    this.checkSel();
  },
  selAll: function selAll(e) {
    var d = e.currentTarget.dataset.d;
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var a = 'list[' + i + '].is_sel';
      this.setData(_defineProperty({}, a, d));
    }

    this.checkSel();
  },
  doit: function doit(e) {
    var k = e.currentTarget.dataset.k;
    var t = e.currentTarget.dataset.t;
    var product_id = this.data.list[k].id;
    var attribute_id = this.data.list[k].attribute_id;
    var num = this.data.list[k].num;
    var n = 'list[' + k + '].num';
    if (t == 1) {
      if (num == 1) {
        wx.showToast({
          title: '无法再减'
        });
        return;
      }
      num = parseInt(num) - 1;
      this.addCar(2, product_id, attribute_id);
    } else {
      num = parseInt(num) + 1;
      this.addCar(1, product_id, attribute_id);
    }
    this.setData(_defineProperty({}, n, num));
    this.checkSel();
  },
  addCar: function addCar(type, product_id, attribute_id) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/addCar',
      data: {
        token: wx.getStorageSync('token'),
        product_id: product_id,
        attribute_id: attribute_id,
        type: type
      },
      success: function success(res) {
        console.log(res);
      },
      complete: function complete() {
        that.getCar();
      }
    });
  },
  checkSel: function checkSel() {
    var is_all_sel = true;
    var is_sel = false;
    var total_price = 0;
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].is_sel == 1) {
        is_sel = true;
        total_price = Math.floor(parseFloat(total_price) * 100 + parseFloat(list[i].price) * parseInt(list[i].num) * 100) / 100;
      } else {
        is_all_sel = false;
      }
    }
    this.setData({
      is_sel: is_sel,
      is_all_sel: is_all_sel,
      total_price: total_price
    });
  },
  edittype: function edittype() {
    this.setData({
      is_del: !this.data.is_del
    });
  }
});