'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {

    this.setData({
      t: options.t
    });

    if (!wx.getStorageSync('token')) {
      wx.showModal({ title: '提示', content: '登录后才可以操作哦', success: function success(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '../login/login' });
          } else if (res.cancel) {
            wx.navigateBack({ delta: 1 });
          }
        }
      });
    }
  },

  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetAddressList',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        that.setData({
          list: res.data.data
        });
      }
    });
  },
  edit: function edit(e) {
    wx.navigateTo({
      url: 'edit?id=' + e.currentTarget.dataset.id
    });
  },
  del: function del(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success: function success(res) {
        if (res.confirm) {
          console.log('用户点击确定');

          app.util.request({
            'url': 'entry/wxapp/DelAddress',
            data: {
              token: wx.getStorageSync('token'),
              id: e.currentTarget.dataset.id
            },
            success: function success(res) {
              that.initData();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  add: function add() {
    wx.navigateTo({
      url: 'edit'
    });
  },
  seladdr: function seladdr(e) {
    console.log(e);
    console.log(this.data.t);
    if (this.data.t == 1) {
      wx.setStorageSync('seladdrdata', this.data.list[e.currentTarget.dataset.k]);
      wx.navigateBack({
        delta: 1
      });
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    this.initData();
  },

  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  }

});