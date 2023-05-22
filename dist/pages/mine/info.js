'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
var siteinfo = getApp().siteInfo;
var QQMapWX = require('../../static/utils/qqmap-wx-jssdk.js');
var qqmapsdk;
exports.default = Page({
  data: {
    mch_id: 0,
    step: 1,
    detail: [],
    cateArr: [],
    cateIndex: -1,
    headimg: '',
    cardimg: '',
    business_license: '',
    store_img: '',
    province: '',
    city: '',
    district: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    mch_cate: [],
    user_level_info_id: 0
  },

  onLoad: function onLoad(e) {
    qqmapsdk = new QQMapWX({
      key: 'KHABZ-MEULF-GGWJE-NUL5G-4TGFT-4VFT4'
    });
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
    this.getUserInfo();
  },
  onShow: function onShow() {},
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
        if (res.data.data.user_level_info.id) {
          this.setData({
            user_level_info_id: res.data.data.user_level_info.id
          });
        }
        wx.setStorageSync('user', res.data.data);
      }
    });
  },
  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    if (e.detail.value.name == '') {
      wx.showToast({ title: '请输入姓名' });return;
    }
    if (e.detail.value.tel == '') {
      wx.showToast({ title: '请输入电话' });return;
    }
    if (this.data.latitude == '') {
      wx.showToast({ title: '请选择定位' });return;
    }
    if (e.detail.value.address == '') {
      wx.showToast({ title: '请输入详细位置' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/EditUserLevelInfo',
      data: {
        id: this.data.user_level_info_id,
        token: wx.getStorageSync('token'),
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        address: e.detail.value.address,
        province: this.data.user.user_level_info.province,
        city: this.data.user.user_level_info.city,
        district: this.data.user.user_level_info.district,
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success: function success(res) {
        console.log(res);
        wx.showToast({
          title: '保存成功'
        });
        setTimeout(function () {
          that.getUserInfo();
        }, 1000);
      }
    });
  },
  saveImg: function saveImg() {
    if (this.data.business_license == '') {
      wx.showToast({ title: '请上传营业执照' });return;
    }
    if (this.data.store_img == '') {
      wx.showToast({ title: '请上传门头照' });return;
    }
    if (this.data.headimg == '') {
      wx.showToast({ title: '请上传正面照' });return;
    }
    if (this.data.cardimg == '') {
      wx.showToast({ title: '请上传身份证' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/submitMchApply',
      data: {
        token: wx.getStorageSync('token'),
        opt: 'pic_info',
        mch_id: this.data.mch_id,
        headimg: this.data.headimg,
        cardimg: this.data.cardimg,
        business_license: this.data.business_license,
        store_img: this.data.store_img
      },
      success: function success(res) {
        console.log(res);
        if (res.data.errno == 0) {
          wx.showToast({
            title: '保存成功'
          });
        }
        that.getMchDetail();
      }
    });
  },
  upload: function upload(e) {
    console.log(siteinfo.site);
    var t = e.currentTarget.dataset.t;
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var url = app.util.url('entry/wxapp/uploadPic');
        wx.uploadFile({
          // url:url,
          url: siteinfo.site + "/app/index.php?i=" + siteinfo.uniacid + "&c=entry&a=wxapp&do=UploadPic&m=" + siteinfo.model,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function success(res) {
            console.log(res.data);
            if (t == 1) {
              that.setData({
                headimg: res.data,
                pic1: siteinfo.site + res.data
              });
            } else if (t == 2) {
              that.setData({
                cardimg: res.data,
                pic2: siteinfo.site + res.data
              });
            } else if (t == 3) {
              that.setData({
                business_license: res.data,
                pic3: siteinfo.site + res.data
              });
            } else {
              that.setData({
                store_img: res.data,
                pic4: siteinfo.site + res.data
              });
            }
          }
        });
      }
    });
  },
  chooseLocation: function chooseLocation() {
    var vm = this;
    var str = 'data.address_name';
    wx.getSetting({
      success: function success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function success() {
              wx.chooseLocation({
                success: function success(res) {
                  console.log(res);
                  vm.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  });
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
          wx.chooseLocation({
            success: function success(res) {
              console.log(res);
              vm.setData({
                latitude: res.latitude,
                longitude: res.longitude
              });
              vm.getLocal(res.latitude, res.longitude);
            }
          });
        }
      }
    });
  },


  getLocal: function getLocal(latitude, longitude) {
    console.log(latitude);
    var vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function success(res) {
        var _vm$setData;

        console.log("getLocal");
        console.log(res);
        var a1 = 'user.user_level_info.province';
        var a2 = 'user.user_level_info.city';
        var a3 = 'user.user_level_info.district';
        var a4 = 'user.user_level_info.address';
        var a5 = 'latitude';
        var a6 = 'longitude';
        vm.setData((_vm$setData = {
          dingwei: latitude + ',' + longitude,
          latitude: latitude,
          addr_data: res.result
        }, _defineProperty(_vm$setData, a1, res.result.ad_info.province), _defineProperty(_vm$setData, a2, res.result.ad_info.city), _defineProperty(_vm$setData, a3, res.result.ad_info.district), _defineProperty(_vm$setData, a4, res.result.address_component.street_number), _defineProperty(_vm$setData, a5, latitude), _defineProperty(_vm$setData, a6, longitude), _vm$setData));
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