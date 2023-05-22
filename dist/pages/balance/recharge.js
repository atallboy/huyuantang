'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    money: '',
    fast_list: [{ id: 0, amount: 100, selected: '' }, { id: 0, amount: 200, selected: '' }, { id: 0, amount: 500, selected: '' }, { id: 0, amount: 1000, selected: '' }],
    solution_list: [],
    ori_fast_list: [],
    ori_solution_list: [],
    _id: 0,
    describe: ''
  },

  onLoad: function onLoad(e) {
    if (e.amount) {
      this.setData({ money: e.amount });
    }
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
    //  this.getSolution();     
  },
  selFast: function selFast(e) {
    var k = e.currentTarget.dataset.k;
    var data = this.data.fast_list;
    var data2 = this.data.solution_list;
    var s = '';
    var amount = '';
    if (this.data.fast_list[k].selected == '') {
      s = 'fast-item-active';amount = data[k].amount;
    }
    for (var i = 0; i < data.length; i++) {
      if (i == k) {
        data[i].selected = s;
      } else {
        data[i].selected = '';
      }
    }
    for (var j = 0; j < data2.length; j++) {
      data2[j].selected = '';
    }
    console.log(data);
    this.setData({
      fast_list: data,
      solution_list: data2,
      money: amount,
      _id: data[k].id,
      describe: ''
    });
  },
  selSolution: function selSolution(e) {
    var k = e.currentTarget.dataset.k;
    var data2 = this.data.fast_list;
    var data = this.data.solution_list;
    var s = '';
    var amount = '';
    var describe = '';
    if (this.data.solution_list[k].selected == '') {
      s = 'package-item-active';amount = data[k].amount;describe = data[k].describe;
    }
    for (var i = 0; i < data.length; i++) {
      if (i == k) {
        data[i].selected = s;
      } else {
        data[i].selected = '';
      }
    }
    for (var j = 0; j < data2.length; j++) {
      data2[j].selected = '';
    }
    console.log(data);
    this.setData({
      solution_list: data,
      fast_list: data2,
      money: amount,
      _id: data[k].id,
      describe: describe
    });
  },
  bindinput: function bindinput(e) {
    var data = this.data.fast_list;
    var data2 = this.data.solution_list;
    for (var i = 0; i < data.length; i++) {
      data[i].selected = '';
    }
    for (var j = 0; j < data2.length; j++) {
      data2[j].selected = '';
    }
    this.setData({
      money: e.detail.value,
      // fast_list:data,
      // solution_list:data2,
      _id: 0,
      describe: ''
    });
  },
  getSolution: function getSolution(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getRechargeSolution',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          ori_fast_list: res.data.data.fast,
          ori_solution_list: res.data.data.solution,
          fast_list: res.data.data.fast,
          solution_list: res.data.data.solution
        });
      }
    });
  },
  formSubmit: function formSubmit(e) {
    console.log(e);
    if (!(this.data.money > 0)) {
      wx.showToast({ title: '充值金额无效' });return;
    }
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/CreateRechargeOrder',
      data: {
        id: this.data._id,
        token: wx.getStorageSync('token'),
        money: this.data.money
      },
      success: function success(res) {
        console.log(res);
        that.setData({ orderInfo: res.data.data.orderInfo });
        var param = res.data.data.payInfo;
        wx.requestPayment({
          timeStamp: param.timeStamp,
          nonceStr: param.nonceStr,
          package: param.package,
          signType: param.signType,
          paySign: param.paySign,
          'success': function success(res) {
            wx.redirectTo({ url: '../balance/record' });
          },
          fail: function fail(res) {
            console.log(res);
          }
        });
      }
    });
  }
});