import { message } from 'antd';

class EMap {
  promise = (callback) => new Promise((resolve, reject) => callback(resolve, reject));
  get window() {
    const w = 'window';
    if (!global.hasOwnProperty(w)) throw Error('window is undefined!');
    return global[w];
  }
  alphabet(list) {
    const alphabetList = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
    return list.map((item, index) => ((item.index = alphabetList[index] || index), item));
  }
  hasFun = (fun) => typeof fun === 'function';
  propsState = {
    searchKey: 'searchCompleteList',
  };
  get hasMap() {
    return 'BMap' in this.window;
  }
  get BMap() {
    return window.BMap;
  }
  create(id, callback) {
    return this.promise((resolve, reject) => {
      try {
        const that = this;
        that.id = id;
        typeof callback === 'function' && (this.propsChange = callback);
        if (this.hasMap) {
          that.init();
          resolve();
          return;
        }
        const BMapElement = document.createElement('script');
        BMapElement.src = `//api.map.baidu.com/api?v=2.0&ak=kYgWE4wZFMLMkGNzeDviE7ycZp7TneSS&&callback=BMapCallback`;
        document.querySelector('body').appendChild(BMapElement);
        window.BMapCallback = () => {
          that.init();
          resolve();
        };
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }
  centerAndZoom = (cityName) => {
    let city = cityName;
    if (Array.isArray(cityName)) {
      city = cityName.slice(0, 2).join('');
    }
    console.log('city:', city);
    this.map.centerAndZoom(city);
  };
  // 初始化
  init() {
    const BMap = this.BMap;
    const map = new BMap.Map(this.id);
    this.map = map;
    const point = new BMap.Point(121.480539, 31.235929);
    map.centerAndZoom(point, 14);
    // 平移缩放控件
    map.addControl(new BMap.NavigationControl());
    // 比例尺控件
    map.addControl(new BMap.ScaleControl());
    // 定位控件
    map.addControl(new BMap.GeolocationControl());
    // 地图点击事件
    map.addEventListener('click', this.handleMapClick, true);
    // 开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true);
    // 添加地图类型控件
    map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP],
      })
    );
    // 城市列表控件
    // const size = new BMap.Size(5, 10);
    // map.addControl(new BMap.CityListControl({
    //     anchor: window.BMAP_ANCHOR_TOP_LEFT,
    //     offset: size,
    // }));
    // 浏览器定位
    // this.Geolocation();
  }
  handleMapClick = (e) => {
    if (this.isMapClick) return false;
    this.isMapClick = true;
    window.setTimeout(() => {
      this.isMapClick = false;
    }, 500);
    this.filterOverlaysMarker();
    this.map.closeInfoWindow();
    let hasMarker = false;
    if (e.domEvent) {
      e.domEvent.preventDefault();
      const className = e.domEvent.target.classList;
      hasMarker = Object.values(className).indexOf('BMap_Marker') > -1;
      !hasMarker && this.map.clearOverlays();
    }
    this.Geocoder(e.point, 'getLocation').then((res) => {
      this.filterOverlaysMarker();
      this.InfoWindow(res);
      if (hasMarker) return false;
      this.Marker(res.point);
    });
  };
  // 位置信息有改变时，通知上级方法
  handleChange(...arg) {
    typeof this.propsChange === 'function' && this.propsChange(...arg);
  }
  // 过滤无效点
  filterOverlaysMarker = () => {
    const overlaysList = this.map.getOverlays();
    overlaysList.forEach((values) => {
      const { z = {} } = values;
      return !z.title && this.map.removeOverlay(values);
    });
  };
  // 窗口关闭
  handleCloseInfoWindow = () => {
    this.filterOverlaysMarker();
  };
  // 信息窗口
  InfoWindow = (info) => {
    const {
      address,
      surroundingPois = [],
      point: { lng, lat },
      index,
    } = info;
    const point = new this.BMap.Point(lng, lat);
    var opts = {
      width: 240, // 信息窗口宽度
      height: 25, // 信息窗口高度
      offset: new this.BMap.Size(0, 0),
    };
    // 信息窗口标题
    if (surroundingPois[0] || index) {
      opts.title = index ? info.title : surroundingPois[0].title;
      const infoWindow = new this.BMap.InfoWindow(`地址:${address}`, opts); // 创建信息窗口对象
      infoWindow.removeEventListener('clickclose', this.handleCloseInfoWindow);
      infoWindow.addEventListener('clickclose', this.handleCloseInfoWindow);
      this.map.openInfoWindow(infoWindow, point);
      this.handleChange(info);
    } else {
      this.map.removeOverlay();
      this.map.closeInfoWindow();
    }
  };
  // 定位
  Geolocation() {
    const that = this;
    return that.promise((resolve, reject) => {
      const geolocation = new this.BMap.Geolocation();
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
          var mk = new that.BMap.Marker(r.point);
          that.map.addOverlay(mk);
          that.map.panTo(r.point);
          resolve(r);
        } else {
          reject(this.getStatus());
        }
      });
    });
  }
  // 标注
  Marker(point) {
    const { lng, lat } = point;
    const _point = point.nb ? point : new this.BMap.Point(lng, lat);
    const marker = new this.BMap.Marker(_point);
    this.map.addOverlay(marker);
    this.handleChange({ [this.propsState.searchKey]: [] }, 'set');
    // marker.addEventListener("click", (e) => this.Geocoder(e.point, 'getLocation'));
  }
  // 检索POI
  LocalSearch(value) {
    const local = new this.BMap.LocalSearch(this.map, {
      renderOptions: {
        map: this.map,
        selectFirstResult: false,
      },
      pageCapacity: 10,
    });
    this.map.clearOverlays();
    this.map.closeInfoWindow();
    this.map.openInfoWindow();
    local.setMarkersSetCallback((res) =>
      this.handleChange({ [this.propsState.searchKey]: this.alphabet(res) }, 'set')
    );
    local.search(value);
  }
  // 解析地址，获取对应经纬度
  Geocoder(value, type = 'getPoint') {
    return this.promise((resolve, reject) => {
      const that = this;
      const Geo = new this.BMap.Geocoder();
      const events = {
        // 按名称查找坐标
        getPoint() {
          that.map.clearOverlays(); //清除地图上所有覆盖物
          let local;
          function myFun() {
            const getPoi = local.getResults().getPoi(0);
            if (!getPoi) {
              return message.warn('地图定位-经纬度错误');
            }
            let pp = getPoi.point; //获取第一个智能搜索的结果
            that.map.centerAndZoom(pp, 18);
            that.map.addOverlay(new that.BMap.Marker(pp)); //添加标注
            that.handleChange({ point: pp, address: value });
          }
          local = new that.BMap.LocalSearch(that.map, {
            //智能搜索
            onSearchComplete: myFun,
          });
          local.search(value);
          // Geo.getPoint(value, (point) => {
          //   point && this.LocalSearch(value);
          //   resolve(point);
          // });
        },
        // 按坐标查找详细地址
        getLocation() {
          const point = value.nb ? value : new this.BMap.Point(value.lng, value.lat);
          Geo.getLocation(point, (res) => resolve(res));
        },
      };
      typeof events[type] === 'function' && events[type].apply(this);
    });
  }
  // 时实搜索结果列表
  Autocomplete() {
    const map = this.map;
    const BMap = this.BMap;
    var ac = new BMap.Autocomplete({
      //建立一个自动完成的对象
      input: 'address',
      location: map,
    });
    let myValue;
    ac.addEventListener('onconfirm', function(e) {
      //鼠标点击下拉列表后的事件
      let _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      setPlace();
    });
    function setPlace() {
      map.clearOverlays(); //清除地图上所有覆盖物
      function myFun() {
        let pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp)); //添加标注
        // that.handleChange(pp);
      }
      let local = new BMap.LocalSearch(map, {
        //智能搜索
        onSearchComplete: myFun,
      });
      local.search(myValue);
    }
  }
}
export default EMap;
