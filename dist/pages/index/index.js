'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var QQMapWX = require('../../static/utils/qqmap-wx-jssdk.js');
var city = require('../../static/data/city.js');
var qqmapsdk;
// let hostUrl = getApp().globalData.host;
exports.default = Page({
  data: {
    region: [],
    menu: [],
    banner: [],
    system_info: {},
    menu_row_num: 4
  },

  onLoad: function onLoad() {

    // this.getLocation();
    qqmapsdk = new QQMapWX({
      key: 'KHABZ-MEULF-GGWJE-NUL5G-4TGFT-4VFT4'
    });
    this.refreshFunc();
  },
  onShow: function onShow() {
    var city = wx.getStorageSync('city');
    if (city) {
      this.setData({
        selCity: city
      });
    }
  },
  refreshFunc: function refreshFunc() {
    this.getSettingInfo();
    this.getBannerList();
    this.getMenuList();
    this.getGoodsList();
    this.getImageMagic();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.refreshFunc();
    wx.stopPullDownRefresh();
  },

  cate: function cate(e) {
    var url_type = e.currentTarget.dataset.item.url_type;
    var url = e.currentTarget.dataset.item.url;
    console.log(url_type);
    if (url_type == 'navigate') wx.navigateTo({ url: url });
    if (url_type == 'redirect') wx.redirectTo({ url: url });
    if (url_type == 'switch') wx.switchTab({ url: url });
  },
  getSettingInfo: function getSettingInfo(e) {
    console.log(e);

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getSettingInfo',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          system_info: res.data.data
        });
        wx.setNavigationBarTitle({ title: res.data.data.name });
        wx.setStorageSync('system_info', res.data.data);
      }
    });
  },
  getBannerList: function getBannerList(e) {
    console.log(e);

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getBannerList',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          banner: res.data.data
        });
      }
    });
  },
  getMenuList: function getMenuList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMenuList',
      success: function success(res) {
        console.log(res);
        that.setData({
          menu: res.data.data
        });
      }
    });
  },
  getImageMagic: function getImageMagic() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getImageMagic',
      success: function success(res) {
        console.log(res);
        that.setData({
          magic: res.data.data
        });
      }
    });
  },
  goodsDetail: function goodsDetail(e) {
    wx.navigateTo({ url: '../product/detail?id=' + e.currentTarget.dataset.id });
  },
  getGoodsList: function getGoodsList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductList',
      data: {
        token: wx.getStorageSync('token'),
        recommend: 1
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          product_list: res.data.data.list
        });
      }
    });
  },
  addcar: function addcar(e) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../../login/login' });return;
    }
    var v = e.currentTarget.dataset.v;
    if (v.attribute_list.length > 0) {
      wx.navigateTo({ url: '../product/detail?id=' + e.currentTarget.dataset.id });
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
  },
  getLocation: function getLocation() {
    var vm = this;
    wx.getSetting({
      success: function success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function success() {
              wx.getLocation({
                success: function success(res) {
                  console.log(res);
                  vm.getLocal(res.latitude, res.longitude);
                }
              });
            },

            fail: function fail(res) {
              wx.showModal({
                content: '你拒绝了授权地理位置，或许会出现不能正常使用的情况'
              });
            }
          });
        } else {
          wx.getLocation({
            success: function success(res) {
              console.log(res);
              wx.setStorageSync('lng', res);
              vm.getLocal(res.latitude, res.longitude);
            }
          });
        }
      }
    });
  },


  // 获取当前地理位置
  getLocal: function getLocal(latitude, longitude) {
    var vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function success(res) {
        console.log("getLocal");
        console.log(res);
        vm.setData({ selCity: res.result.ad_info.city });
        wx.setStorageSync('city', res.result.ad_info.city);
        wx.setStorageSync('location', res);
      },
      fail: function fail(res) {
        console.log("fail");
        console.log(res);
      },
      complete: function complete(res) {
        // console.log(res);
      }
    });
  },

  onShareAppMessage: function onShareAppMessage() {},

  onShareTimeline: function onShareTimeline() {}

});