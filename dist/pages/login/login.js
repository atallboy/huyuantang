'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var QQMapWX = require('../../static/utils/qqmap-wx-jssdk.js');
var city = require('../../static/data/city.js');
var qqmapsdk;
exports.default = Page({
  data: {
    share_id: 0,
    system_info: {},
    latitude: '',
    longitude: ''
  },

  onLoad: function onLoad(e) {
    if (e.share_id) {
      this.setData({
        share_id: e.share_id
      });
    }
    if (e.scene) {
      this.setData({
        share_id: decodeURIComponent(e.scene)
      });
    }

    // this.getLocation();
    // qqmapsdk = new QQMapWX({
    //   key: 'KHABZ-MEULF-GGWJE-NUL5G-4TGFT-4VFT4'
    // });
  },
  onShow: function onShow() {
    this.getSettingInfo();
  },
  toBack: function toBack() {
    wx.navigateBack({});
  },
  updateUserInfo: function updateUserInfo(e) {
    console.log(e);
    wx.showLoading({
      title: ''
    });
    var that = this;

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: function success(res) {
        console.log(res);
        var data = res.userInfo;
        if (that.data.share_id > 0) {
          data.share_id = that.data.share_id;
        }
        wx.setStorageSync('WxUserInfo', data);
        wx.login({
          success: function success(res) {
            console.log(res);
            data.code = res.code;
            data.latitude = that.data.latitude;
            data.longitude = that.data.longitude;
            app.util.request({
              'url': 'entry/wxapp/wxappLogin',
              data: data,
              success: function success(res) {
                if (res.data.errno == 0) {
                  wx.setStorageSync('token', res.data.data);
                  app.util.request({
                    'url': 'entry/wxapp/GetUserInfo',
                    data: { token: res.data.data },
                    success: function success(r) {
                      console.log(r);
                      wx.setStorageSync('user', r.data.data);
                      if (that.data.share_id > 0) {
                        wx.switchTab({
                          url: '../index/index'
                        });
                      } else {
                        wx.navigateBack({
                          delta: 1
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        });
      },
      fail: function fail(e) {
        console.log(e);
        wx.showToast({
          title: '不授权无法使用',
          icon: 'success',
          duration: 1000
        });
      },
      complete: function complete(e) {
        wx.hideLoading();
      }
    });

    return;

    if (e.detail.rawData != undefined) {
      wx.showLoading({
        title: ''
      });
    } else {
      wx.showToast({
        title: '不授权无法使用',
        icon: 'success',
        duration: 1000
      });
    }
  },
  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          user: res.data.data
        });
        wx.setStorageSync('user', res.data.data);
      }
    });
  },
  getSettingInfo: function getSettingInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getSettingInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          system_info: res.data.data
        });
        wx.setStorageSync('system_info', res.data.data);
      }
    });
  },
  updateUser: function updateUser(result) {

    //拿到用户数据时，通过app.util.getUserinfo将加密串传递给服务端
    //服务端会解密，并保存用户数据，生成sessionid返回
    wx.showLoading({
      title: '登录中'
    });
    app.util.getUserInfo(function (userInfo) {
      //这回userInfo为用户信息
      console.log(userInfo);
      var data = userInfo.wxInfo;
      wx.setStorageSync('UserInfo', data);
      data.sessionid = userInfo.sessionid;
      app.util.request({
        'url': 'entry/wxapp/UpdateUserInfo',
        data: data,
        success: function success(res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.errno == 0) {
            wx.setStorageSync('token', res.data.data);
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
    }, result.detail);
  },
  onGotUserInfo: function onGotUserInfo(e) {
    console.log(e);
    var that = this;
    wx.setStorageSync('userInfo', e.detail.userInfo);
    if (e.detail.rawData != undefined) {
      wx.showLoading({
        title: ''
      });
      wx.login({
        success: function success(res) {
          console.log(res);
          wx.request({
            url: hostUrl + '/micro/login',
            method: 'POST',
            data: {
              code: res.code,
              info: e.detail.userInfo
            },
            success: function success(res) {
              wx.hideLoading();
              if (res.data.code == 200) {
                wx.setStorageSync("token", res.data.token);
                wx.navigateBack({});
              } else {
                wx.showToast({
                  title: '登陆失败'
                });
              }
            }
          });
        }
      });
    } else {
      wx.showToast({
        title: '不授权无法使用',
        icon: 'success',
        duration: 1000
      });
    }
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
              vm.getLocal(res.latitude, res.longitude);
            }
          });
        }
      }
    });
  },


  // 获取当前地理位置
  getLocal: function getLocal(latitude, longitude) {
    this.setData({
      latitude: latitude,
      longitude: longitude
    });
    var vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function success(res) {
        console.log("getLocal");
        console.log(res);
        wx.setStorageSync('location_city', res.result.ad_info.city);
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
  }

});