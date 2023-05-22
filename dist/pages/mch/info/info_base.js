'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
var siteinfo = getApp().siteInfo;
var QQMapWX = require('../../../static/utils/qqmap-wx-jssdk.js');
var qqmapsdk;
exports.default = Page({
  data: {
    mch_id: 0,
    step: 1,
    detail: [],
    cateArr: [],
    cateIndex: -1,
    province: '',
    city: '',
    district: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    mch_cate: [],
    agree_declaration: false
  },

  changDecalation: function changDecalation(e) {
    console.log(e);this.setData({ agree_declaration: !this.data.agree_declaration });
  },
  onLoad: function onLoad(e) {
    qqmapsdk = new QQMapWX({
      key: 'KHABZ-MEULF-GGWJE-NUL5G-4TGFT-4VFT4'
    });
    this.getMchCate();
    this.getMchDetail();
  },
  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
  },
  selStep: function selStep(e) {
    // this.setData({step:e.currentTarget.dataset.step})
  },
  bindChange: function bindChange(e) {
    this.setData({ cateIndex: e.detail.value });
  },
  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    if (e.detail.value.mch_name == '') {
      wx.showToast({ title: '请输入店铺名称', icon: 'none' });return;
    }
    if (e.detail.value.mch_tel == '') {
      wx.showToast({ title: '请输入店铺客服', icon: 'none' });return;
    }
    if (e.detail.value.user_name == '') {
      wx.showToast({ title: '请输入申请人姓名', icon: 'none' });return;
    }
    if (e.detail.value.user_tel == '') {
      wx.showToast({ title: '请输入申请人电话', icon: 'none' });return;
    }
    if (this.data.latitude == '') {
      wx.showToast({ title: '请选择定位', icon: 'none' });return;
    }
    // if(this.data.cateIndex==-1){wx.showToast({title:'请选择类目',icon:'none'});return ;}
    if (e.detail.value.address == '') {
      wx.showToast({ title: '请输入详细位置', icon: 'none' });return;
    }

    if (!this.data.agree_declaration) {
      wx.showToast({ title: '请阅读并都勾选协议', icon: 'none' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/submitMchApply',
      data: {
        id: this.data.detail.id,
        token: wx.getStorageSync('token'),
        opt: 'base_info',
        // cate_id: this.data.cateArr[that.data.cateIndex].id,
        mch_name: e.detail.value.mch_name,
        mch_tel: e.detail.value.mch_tel,
        user_name: e.detail.value.user_name,
        user_tel: e.detail.value.user_tel,
        remark: e.detail.value.remark,
        province: this.data.province,
        city: this.data.city,
        district: this.data.district,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        address: e.detail.value.address,
        location: this.data.location
      },
      success: function success(res) {
        console.log(res);
        wx.showToast({ title: '保存成功' });
        // that.getMchDetail();           
      }
    });
  },
  getMchDetail: function getMchDetail() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMchDetail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        if (res.data.data.step != 1) {
          that.setData(_defineProperty({
            detail: res.data.data.info,
            step: res.data.data.step,
            mch_cate: res.data.data.mch_cate,
            province: res.data.data.info.province,
            city: res.data.data.info.city,
            district: res.data.data.info.district,
            address: res.data.data.info.address,
            location: res.data.data.info.location,
            latitude: res.data.data.info.latitude
          }, 'location', res.data.data.info.location));
        }
      }
    });
  },
  getMchCate: function getMchCate() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMchCate',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        that.setData({ cateArr: res.data.data });
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
        console.log("getLocal");
        console.log(res);
        vm.setData({
          addr_data: res.result,
          province: res.result.ad_info.province,
          city: res.result.ad_info.city,
          district: res.result.ad_info.district,
          location: res.result.address_component.street_number,
          address: res.result.address_component.street_number
        });
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