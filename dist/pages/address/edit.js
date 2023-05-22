'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
var QQMapWX = require('../../static/utils/qqmap-wx-jssdk.js');
var qqmapsdk;
exports.default = Page({
  /**
   * 页面的初始数据
   */
  data: _defineProperty({
    region: ['', '', ''],
    data: { address_name: '' },
    id: 0,
    addr_detail: {},
    addr_data: {}
  }, 'data', {
    name: '', tel: '', province: '', city: '', district: '', address: '', latitude: '', longitude: '', address_name: ''
  }),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
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
    if (options.id != undefined) {
      this.setData({
        id: options.id
      });
      this.initData();
    }
    // this.getLocation();
    qqmapsdk = new QQMapWX({
      key: 'KHABZ-MEULF-GGWJE-NUL5G-4TGFT-4VFT4'
    });
  },

  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getAddressDetail',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.id
      },
      success: function success(res) {
        that.setData({
          data: res.data.data,
          region: [res.data.data.province, res.data.data.city, res.data.data.strict]
        });
      }
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {},

  chooseLocation: function chooseLocation() {
    var vm = this;
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
                    location: res.address,
                    addr_detail: res
                  });
                  console.log('`````````res`````````');
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
                location: res.address,
                addr_detail: res
              });
              console.log('`````````res`````````');
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
        var lat = 'data.latitude';
        var lng = 'data.longitude';
        var province = 'data.province';
        var city = 'data.city';
        var district = 'data.district';
        var address = 'data.address';
        var address_name = 'data.address_name';
        vm.setData((_vm$setData = {
          addr_data: res.result
        }, _defineProperty(_vm$setData, lat, latitude), _defineProperty(_vm$setData, lng, longitude), _defineProperty(_vm$setData, province, res.result.address_component.province), _defineProperty(_vm$setData, city, res.result.address_component.city), _defineProperty(_vm$setData, district, res.result.address_component.district), _defineProperty(_vm$setData, address, res.result.address_component.street_number), _defineProperty(_vm$setData, address_name, res.result.address_component.street_number), _vm$setData));
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

  submit: function submit(e) {

    if (!e.detail.value.name) {
      wx.showModal({
        title: '请输入姓名'
      });
      return;
    }
    if (!e.detail.value.tel) {
      wx.showModal({
        title: '请输入手机号码'
      });
      return;
    }

    if (this.data.data.address_name == '') {
      wx.showModal({
        title: '请选择地址'
      });
      return;
    }

    //   if(this.data.region[0]==''){
    //     wx.showModal({
    //       title: '请选择省市区',
    //     })
    //     return ;
    // }

    //   if(!e.detail.value.addr){
    //     wx.showModal({
    //       title: '请输入地址',
    //     })
    //     return ;
    // }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/EditAddress',
      data: {
        id: this.data.id,
        token: wx.getStorageSync('token'),
        province: this.data.data.province,
        city: this.data.data.city,
        district: this.data.data.district,
        remark: e.detail.value.remark,
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        address: e.detail.value.address,
        lat: this.data.data.latitude,
        lng: this.data.data.longitude,
        address_name: this.data.data.address_name

      },
      success: function success(res) {
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },


  bindRegionChange: function bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      region: e.detail.value
    });
  }
});