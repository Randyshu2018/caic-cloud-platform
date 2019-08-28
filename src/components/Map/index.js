import './style.scss';
import React from 'react';
import EMap from './api';
const EMapApi = new EMap();

/*
  用法：
  <input type="text" onChange={this.handleChange} value={this.state.value} />
  <button onClick={this.handleSearch}>搜索</button>
  <EjuMap onChange={this.handleMapChange} value={this.state.searchValue} isSearchResult={true}/>
  默认标注：
  const markerList = [
      { lan: 116.414, lat: 39.915 },
      { lan: 116.424, lat: 39.915 },
      { lan: 116.434, lat: 39.915 },
  ];
  markerList.forEach((v) => EMapApi.Marker(v));
  // 设置初始定位
  EMapApi.Geocoder('上海市', 'getPoint').then((res) => console.log(res));
  // 根据浏览器ip定位
  EMapApi.Geolocation()
  .then(() => {
  })
  .finally(() => {
      typeof this.props.onLoading === 'function' && this.props.onLoading(false);
  });
*/

const classNameFun = (str = '', cls = {}) => {
  const classNameList = [];
  classNameList.push(str);
  const className = Object.entries(cls)
    .filter(([_, value]) => !!value)
    .map(([className, _]) => className);
  classNameList.push(...className);
  return classNameList.join(' ');
};

class component extends React.Component {
  constructor(props) {
    super(props);
    this.id = 'eju-amap-container';
    // console.log('component: props', props);

    this.state = {
      searchCompleteList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps:', nextProps.isSearchResult);

    const { selectedCityOptions } = this.props;
    if (selectedCityOptions && selectedCityOptions.length > 0) {
      if (nextProps.selectedCityOptions.join('') !== selectedCityOptions.join('')) {
        EMapApi.centerAndZoom(selectedCityOptions);
      }
    }
    if (this.props.isSearchResult) {
      this.handleSearch();
    }
  }

  componentDidMount() {
    // console.log('componentDidMount:', this.props.isSearchResult);
    this.createNodeMap();
  }
  createNodeMap = () => {
    EMapApi.create(this.id, this.handleMapChange).then(() => {
      this.handleSearch();
    });
  };
  handleMapSearchList = (res) => {
    EMapApi.InfoWindow(res);
    this.setState({
      transition: false,
    });
  };
  handleMapChange = (res, type = 'fun') => {
    const { onChange, onSearchResult } = this.props;
    const event = {
      fun: () => {
        this.propsValue = res.address;
        EMapApi.hasFun(onChange) && onChange(res);
      },
      set: () => {
        const key = 'searchCompleteList';
        this.setState({ ...res, transition: !!(res[key] || []).length });
        EMapApi.hasFun(onSearchResult) && onSearchResult(res[key]);
      },
    };
    EMapApi.hasFun(event[type]) && event[type]();
  };
  handleSearch = (_value) => {
    const { value, isSearchResult, searchValue } = this.props;
    if (isSearchResult) {
      return EMapApi.LocalSearch(searchValue);
    }
    searchValue && EMapApi.Geocoder(searchValue);
    // 是否精确查找
    // if (typeof this.props.value === 'object') {
    //   EMapApi.Geocoder(this.props.value, 'getLocation').then((res) => {
    //     EMapApi.Marker(res.point);
    //     EMapApi.InfoWindow(res);
    //   });
    // }
  };
  renderTransition() {
    return !this.state.transition ? (
      <div
        className="tab"
        onClick={() => {
          this.setState({
            transition: true,
          });
        }}
      >
        展开
      </div>
    ) : null;
  }

  renderResults() {
    const { searchCompleteList, transition } = this.state;
    const className = classNameFun('search-results', {
      transition: transition,
    });
    return searchCompleteList.length ? (
      <div className={className}>
        {this.renderTransition()}
        <div className="search-list-container">
          {searchCompleteList.map((item, index) => (
            <div
              className="search-results-list-item"
              key={index}
              onClick={() => this.handleMapSearchList(item)}
            >
              <div className="label">{item.index}</div>
              <div className="text">
                <p className="p1">{item.title}</p>
                <p className="p2">{item.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
  componentWillUnmount() {}
  render() {
    const isSView = this.props.isSearchView;
    return (
      <div className="eju-map-container">
        <div id={this.id} className="maps" />
        {isSView === true || typeof isSView === 'undefined' ? this.renderResults() : null}
      </div>
    );
  }
}

export default component;
