'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    pic1: '../../static/images/icon-mch-p3.png',
    pic2: '../../static/images/icon-mch-p4.png',
    pic3: '../../static/images/icon-mch-p1.png',
    pic4: '../../static/images/icon-mch-p2.png',
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
    if (this.data.cateIndex == -1) {
      wx.showToast({ title: '请选择类目', icon: 'none' });return;
    }
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
        mch_id: this.data.mch_id,
        token: wx.getStorageSync('token'),
        opt: 'base_info',
        cate_id: this.data.cateArr[that.data.cateIndex].id,
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
        that.getMchDetail();
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
        that.setData({
          detail: res.data.data.info,
          step: res.data.data.step,
          mch_cate: res.data.data.mch_cate
        });
        if (res.data.data.id) {
          that.setData({
            mch_id: res.data.data.id
          });
        }
        if (res.data.data.step == 5) {
          wx.redirectTo({ url: '../mine/index' });
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
  saveImg: function saveImg() {
    if (this.data.headimg == '') {
      wx.showToast({ title: '请上传正面照', icon: 'none' });return;
    }
    if (this.data.cardimg == '') {
      wx.showToast({ title: '请上传身份证', icon: 'none' });return;
    }
    if (this.data.business_license == '') {
      wx.showToast({ title: '请上传营业执照', icon: 'none' });return;
    }
    if (this.data.store_img == '') {
      wx.showToast({ title: '请上传门头照', icon: 'none' });return;
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
  topay: function topay() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/CreateMchDepositOrder',
      data: {
        token: wx.getStorageSync('token'),
        mch_id: that.data.mch_id,
        money: that.data.mch_cate.deposit_fee
      },
      success: function success(res) {
        that.setData({ order: res.data.data });
        app.util.request({
          'url': 'entry/wxapp/pay',
          data: {
            token: wx.getStorageSync('token'),
            money: res.data.data.pay_money,
            order_id: res.data.data.id
          },
          success: function success(res) {
            console.log(res);
            that.pay(res.data.data);
          }
        });
      }
    });
  },


  /* 支付   */
  pay: function pay(param) {
    var slet = this;
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function success(res) {
        slet.payBack(slet.data.order.order_no);
        wx.showToast({
          title: '支付成功'
        });
      },
      fail: function fail() {
        wx.showModal({
          title: '提示',
          content: '订单支付失败',
          showCancel: false,
          complete: function complete() {}
        });
      },
      complete: function complete() {}
    });
  },

  payBack: function payBack(orderno) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/payBack',
      data: { orderno: orderno },
      success: function success(res) {
        that.getMchDetail();
      }
    });
  },
  upload: function upload(e) {
    console.log(siteinfo);
    var t = e.currentTarget.dataset.t;
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: siteinfo.siteroot + "/upload?i=" + siteinfo.uniacid + '&token=' + wx.getStorageSync('token'),
          filePath: tempFilePaths[0],
          name: 'file',
          success: function success(res) {
            console.log(res.data);
            if (t == 1) {
              that.setData({
                headimg: res.data,
                pic1: siteinfo.siteroot + res.data
              });
            } else if (t == 2) {
              that.setData({
                cardimg: res.data,
                pic2: siteinfo.siteroot + res.data
              });
            } else if (t == 3) {
              that.setData({
                business_license: res.data,
                pic3: siteinfo.siteroot + res.data
              });
            } else {
              that.setData({
                store_img: res.data,
                pic4: siteinfo.siteroot + res.data
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