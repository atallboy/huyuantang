'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _data;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
exports.default = Page({
  data: (_data = {
    order_id: 0,
    addr: [],
    is_use_score: false,
    is_use_balance: false,
    pay_type: 1,
    total_price: 0,
    type: 0,
    car_order_id: 0,
    product_id: 0,
    product_num: 0,
    preOrder: [],
    c: { sub_image: '', name: '', price: '', num: '' },
    origin_total_price: 0,
    use_coupon: false,
    can_use_coupon: false,
    coupon_money: 0,
    coupon: {},
    coupon_list: [],
    couponPopup: false,
    deduction_money: 0,
    deduction_id: 0,
    is_pay: false,
    open_balance_pay: 0,
    into_type: 1
  }, _defineProperty(_data, 'addr', { id: '' }), _defineProperty(_data, 'freight', 0), _data),
  onLoad: function onLoad(options) {
    this.setData({
      addr: { id: '' }
    });
    if (options.into_type) {
      this.setData({ into_type: options.into_type });
    }
    if (options.type == 1) {
      this.setData({
        type: options.type,
        product_id: options.product_id,
        product_num: options.product_num,
        attribute_id: options.attribute_id
      });
    } else {
      this.setData({
        // type:2,
        // car_order_id:66,       
        type: options.type,
        car_order_id: options.car_order_id
      });
    }

    this.getUserInfo();
  },

  onShow: function onShow() {
    this.setData({
      open_balance_pay: wx.getStorageSync('system_info').open_balance_pay
    });
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../../login/login' });
    }
    if (wx.getStorageSync('seladdrdata')) {
      this.setData({
        addr: wx.getStorageSync('seladdrdata')
      });
      wx.removeStorageSync('seladdrdata');
    } else {
      this.getDefaultAddress();
    }

    if (this.data.type == 1) {
      this.getGoodsDetail();
    } else {
      this.getCarOrderInfo();
    }
  },

  openCouponPopup: function openCouponPopup() {
    this.setData({ couponPopup: true });
  },
  closeCouponPopup: function closeCouponPopup() {
    this.setData({ couponPopup: false });
  },
  selCoupon: function selCoupon(e) {
    var v = e.currentTarget.dataset.v;
    console.log(v, this.data.total_price, this.data.coupon_money, v.amount);
    var tp = (this.data.total_price * 100 + this.data.coupon_money * 100 - v.amount * 100) / 100;
    this.setData({
      coupon_money: v.amount,
      total_price: tp,
      coupon: v,
      couponPopup: false
    });
  },
  selAddr: function selAddr() {
    // wx.setStorageSync('toseladdr', 1);
    wx.navigateTo({
      url: '../address/list?t=1'
    });
  },
  getDefaultAddress: function getDefaultAddress() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetAddressDetail',
      data: { token: wx.getStorageSync('token'), type: 'default' },
      success: function success(res) {
        console.log(res);
        // wx.setStorageSync('user', res.data.data)
        that.setData({
          addr: res.data.data
        });
      }
    });
  },
  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        // wx.setStorageSync('user', res.data.data)
        that.setData({
          user: res.data.data,
          score_money: res.data.data.score / 100,
          is_login: true
        });
      }
    });
  },
  getGoodsDetail: function getGoodsDetail() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductPreOrder',
      data: {
        token: wx.getStorageSync('token'),
        address_id: this.data.addr.id,
        product_id: this.data.product_id,
        attribute_id: this.data.attribute_id,
        num: this.data.product_num,
        w_type: 'o'
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          freight: res.data.data.freight,
          preOrder: res.data.data.preOrder,
          total_price: res.data.data.total_price,
          origin_total_price: res.data.data.total_price
        });
      }
    });
  },
  getCarOrderInfo: function getCarOrderInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getCarOrderInfo',
      data: {
        id: this.data.car_order_id,
        address_id: this.data.addr.id,
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        that.setData({
          freight: res.data.data.freight,
          preOrder: res.data.data.preOrder,
          total_price: res.data.data.total_price,
          origin_total_price: res.data.data.total_price
          // coupon_list:res.data.data.coupon_list,
          // coupon_money:res.data.data.coupon_money,
        });
        if (res.data.data.coupon_list.length > 0) {
          that.setData({
            use_coupon: true,
            can_use_coupon: true,
            coupon: res.data.data.coupon_list[0]
          });
        }
      }
    });
  },
  closePay: function closePay() {
    this.setData({
      is_pay: false
    });
  },
  selPayType: function selPayType(e) {
    var t = e.currentTarget.dataset.t;
    if (t == 2) {
      if (parseInt(this.data.total_price * 100) > parseInt(this.data.user.balance * 100)) {
        wx.showToast({
          title: '余额不足'
        });
        return;
      }
    }
    this.setData({
      pay_type: e.currentTarget.dataset.t
    });
  },
  selBalance: function selBalance() {
    var a = this.data.total_price * 100;
    var b = this.data.user.balance * 100;
    console.log(a, b);
    console.log(a - b);
    if (!this.data.is_use_balance) {

      this.setData({
        is_use_balance: !this.data.is_use_balance,
        total_price: (a - b) / 100
      });
    } else {
      this.setData({
        is_use_balance: !this.data.is_use_balance,
        total_price: (a + b) / 100
      });
    }
  },
  selScore: function selScore() {
    var a = this.data.total_price * 100;
    var b = parseInt(this.data.user.score);
    console.log(a, b);
    console.log(a - b);
    console.log(a + b);
    if (!this.data.is_use_score) {
      this.setData({
        is_use_score: !this.data.is_use_score,
        total_price: (a - b) / 100
      });
    } else {
      this.setData({
        is_use_score: !this.data.is_use_score,
        total_price: (a + b) / 100
      });
    }
  },
  payto: function payto() {
    if (this.data.addr == undefined || this.data.addr == false || this.data.addr.length == 0 || !this.data.addr.id) {
      wx.showToast({
        title: '请选择地址'
      });
      return;
    }
    this.setData({
      is_pay: true
    });
  },
  submitOrder: function submitOrder() {
    var that = this;
    var use_score = void 0,
        use_balance = void 0;
    this.data.is_use_score ? use_score = 1 : use_score = 0;
    this.data.is_use_balance ? use_balance = 1 : use_balance = 0;
    var coupon_id = 0;
    if (this.data.coupon.coupon_id) coupon_id = this.data.coupon.coupon_record_id;
    app.util.request({
      'url': 'entry/wxapp/submitOrder',
      data: {
        token: wx.getStorageSync('token'),
        product_origin: this.data.type,
        pay_type: this.data.pay_type,
        use_balance: use_balance,
        use_score: use_score,
        product_id: this.data.product_id,
        product_num: this.data.product_num,
        attribute_id: this.data.attribute_id,
        car_order_id: this.data.car_order_id,
        address_id: this.data.addr.id,
        coupon_id: coupon_id,
        deduction_id: this.data.deduction_id,
        into_type: this.data.into_type
      },
      success: function success(res) {
        that.setData({ orderInfo: res.data.data.orderInfo });
        if (this.data.pay_type == 1) {
          var param = res.data.data.payInfo;
          wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            'success': function success(res) {},
            fail: function fail(res) {
              console.log(res);
            },
            complete: function complete(res) {
              wx.redirectTo({ url: '../order/list' });
            }
          });
        } else {
          wx.redirectTo({ url: '../order/list' });
        }
      }
    });
  }
});