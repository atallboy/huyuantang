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
    pic1: '../../static/images/icon-mch-p3.png',
    pic2: '../../static/images/icon-mch-p4.png',
    pic3: '../../static/images/icon-mch-p1.png',
    pic4: '../../static/images/icon-mch-p2.png',
    headimg: '',
    cardimg: '',
    business_license: '',
    store_img: '',
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
  bindChange: function bindChange(e) {
    this.setData({ cateIndex: e.detail.value });
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
          that.setData({
            detail: res.data.data.info,
            pic1: res.data.data.info.headimg,
            pic2: res.data.data.info.cardimg,
            pic3: res.data.data.info.business_license,
            pic4: res.data.data.info.store_img
          });
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

    var data = {
      token: wx.getStorageSync('token'),
      opt: 'pic_info',
      id: this.data.detail.id
    };
    if (this.data.headimg) {
      data.headimg = this.data.headimg;
    }
    if (this.data.cardimg) {
      data.cardimg = this.data.cardimg;
    }
    if (this.data.business_license) {
      data.business_license = this.data.business_license;
    }
    if (this.data.store_img) {
      data.store_img = this.data.store_img;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/submitMchApply',
      data: data,
      success: function success(res) {
        console.log(res);
        if (res.data.errno == 0) {
          wx.showToast({
            title: '保存成功'
          });
        }
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
  }
});