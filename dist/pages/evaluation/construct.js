'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
var siteinfo = getApp().siteInfo;
exports.default = Page({
  data: {
    starResult1: '感觉怎么样，打个分吧',
    title: '来给我们评个分吧',
    stars: {
      normalSrc: 'http://images.uileader.com/20180403/7ea55056-3fe9-4f8c-a500-1734cf955b5b.png',
      selectedSrc: 'http://images.uileader.com/20180403/5d063eda-9e1b-49b6-b270-63a8318a6881.png',
      halfSrc: 'http://images.uileader.com/20180403/e9bede50-e470-46cc-83c0-f078e8c645bb.png'
    },
    check_status: 1,
    order_id: 0,
    detail: '',
    score: 0,
    videoArr: [],
    picArr: [],

    evaluation: {},
    product_list: [],
    imgs: [{}, {}],
    evaluation_list: [],
    attribute_id: 0,
    product_id: 0,
    content: '',

    page: 0,
    page_num: 0,
    user: {},
    date: '',
    userToast: false,
    user_type: '虚拟用户',
    keyword: ''

  },

  onLoad: function onLoad(e) {
    this.setData({
      product_id: e.product_id
      // order_id:61,
    });
    this.initData();
    this.getProductDetail();
    this.getUserList();
  },
  selUserType: function selUserType() {
    var that = this;
    wx.showActionSheet({
      itemList: ['全部用户', '真实用户', '虚拟用户'],
      success: function success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          that.setData({ user_type: '全部用户' });
        }
        if (res.tapIndex == 1) {
          that.setData({ user_type: '真实用户' });
        }
        if (res.tapIndex == 2) {
          that.setData({ user_type: '虚拟用户' });
        }
      }
    });
  },
  toSelUser: function toSelUser() {
    this.setData({ userToast: true });
  },
  selUser: function selUser(e) {
    this.setData({ user: e.currentTarget.dataset.user, userToast: false });
  },
  statusChange: function statusChange(e) {
    this.setData({ check_status: e.detail.value });
  },
  keywordInput: function keywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },
  detailInput: function detailInput(e) {
    this.setData({ content: e.detail.value });
  },
  delPic: function delPic(e) {
    var k = e.currentTarget.dataset.k;
    var arr = [];
    for (var i = 0; i < this.data.picArr.length; i++) {
      if (i != k) {
        arr.push(this.data.picArr[i]);
      }
    }
    this.setData({ picArr: arr });
  },
  delVideo: function delVideo(e) {
    var k = e.currentTarget.dataset.k;
    var arr = [];
    for (var i = 0; i < this.data.videoArr.length; i++) {
      if (i != k) {
        arr.push(this.data.videoArr[i]);
      }
    }
    this.setData({ videoArr: arr });
  },
  preImg: function preImg(e) {
    var src = e.currentTarget.dataset.src;
    var arr = e.currentTarget.dataset.srcarr;
    console.log(src);
    wx.previewImage({
      current: src,
      urls: arr
    });
  },
  submit: function submit(e) {
    console.log(e);
    var data = { score: '', content: '', pic: [], video: [] };
    var arr = [];

    if (this.data.attribute_list.length > 0 && !this.data.attribute_id) {
      wx.showToast({ title: '请选择规格', icon: 'none' });return;
    }
    if (this.data.score == 0) {
      wx.showToast({ title: '请选择评分', icon: 'none' });return;
    }
    if (!this.data.user.id) {
      wx.showToast({ title: '请选择评价用户', icon: 'none' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/submitProductEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        product_id: that.data.product_id,
        attribute_id: that.data.attribute_id,
        score: this.data.score,
        content: this.data.content,
        pic: this.data.picArr.join('&'),
        video: this.data.videoArr.join('&'),
        user_id: this.data.user.id,
        check_status: this.data.check_status
      },
      success: function success(res) {
        console.log(res);
        // that.initData();
        wx.showToast({
          title: '评价成功'
        });
        setTimeout(function () {
          wx.navigateBack();
        }, 1000);
      }
    });
  },
  initData: function initData(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getOrderEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        order_id: that.data.order_id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          product_list: res.data.data.product_list,
          evaluation: res.data.data.evaluation
        });
        if (res.data.data.evaluation.service > 0) {
          that.setData({ status: true });
        } else {
          that.setData({ status: false });
        }
      }
    });
  },
  getProductDetail: function getProductDetail(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductDetail',
      data: {
        token: wx.getStorageSync('token'),
        id: that.data.product_id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          product: res.data.data,
          attribute_list: res.data.data.attribute_list
        });
      }
    });
  },
  prePage: function prePage() {
    if (this.data.page > 0) {
      var p = this.data.page - 1;
      console.log(this.data.page);
      console.log(p);
      this.setData({ page: p });
      this.getUserList();
    }
  },
  nextPage: function nextPage() {
    if (this.data.page < this.data.page_num) {
      var p = this.data.page + 1;
      console.log(this.data.page);
      console.log(p);
      this.setData({ page: p });
      this.getUserList();
    }
  },
  getUserList: function getUserList(e) {
    console.log(e);
    var that = this;
    var type = void 0;
    if (this.data.user_type == '全部用户') {
      type = '';
    }
    if (this.data.user_type == '真实用户') {
      type = 1;
    }
    if (this.data.user_type == '虚拟用户') {
      type = 0;
    }
    app.util.request({
      'url': 'entry/wxapp/getUserList',
      data: {
        token: wx.getStorageSync('token'),
        type: type,
        page: this.data.page,
        keyword: this.data.keyword
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          user_list: res.data.data.list,
          page_num: res.data.data.page_num
        });
      }
    });
  },
  changeDate: function changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  productScore: function productScore(e) {
    var index = e.detail;
    this.setData({ score: index });
  },
  selAttribute: function selAttribute(e) {
    console.log(e);
    var k = e.currentTarget.dataset.k;
    var v = e.currentTarget.dataset.v;
    var arr = this.data.attribute_list;
    for (var i = 0; i < arr.length; i++) {
      if (k == i) {
        arr[i].selected = 'attribute-item-selected';
        this.setData({
          price: v.price,
          attribute_id: v.id,
          stock: v.stock
        });
      } else {
        arr[i].selected = '';
      }
    }
    this.setData({ attribute_list: arr });
  },
  serviceScore: function serviceScore(e) {
    var str = 'evaluation.service';
    this.setData(_defineProperty({}, str, e.detail));
  },
  deliverScore: function deliverScore(e) {
    var str = 'evaluation.deliver';
    this.setData(_defineProperty({}, str, e.detail));
  },
  selPic: function selPic(e) {
    console.log(siteinfo);
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading();
        for (var i = 0; i < tempFilePaths.length; i++) {
          that.toUpload(e, tempFilePaths[i]);
        }
        wx.hideLoading();
      }
    });
  },
  selVideo: function selVideo(e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function success(res) {
        console.log(res.tempFilePath);
        wx.showLoading();
        that.toUpload(e, res.tempFilePath);
        wx.hideLoading();
      }
    });
  },
  toUpload: function toUpload(e, file) {
    var that = this;
    var k = e.currentTarget.dataset.k;
    var pic = e.currentTarget.dataset.pic;
    var video = e.currentTarget.dataset.video;
    wx.uploadFile({
      url: siteinfo.siteroot + "/upload?i=" + siteinfo.uniacid + '&token=' + wx.getStorageSync('token'),
      filePath: file,
      name: 'file',
      formData: { return_type: 1 },
      success: function success(res) {
        var data = JSON.parse(res.data);
        if (data.data.file_type == 1) {
          var arr = that.data.picArr;
          arr.push(data.data.src);
          that.setData({
            picArr: arr
          });
        }
        if (data.data.file_type == 2) {
          var _arr = that.data.videoArr;
          _arr.push(data.data.src);
          that.setData({
            videoArr: _arr
          });
        }
      }
    });
  }
});