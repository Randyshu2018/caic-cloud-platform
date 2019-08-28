import InnerhandleOption from './inner-option';
// import { TYPE } from './template';

class ChartOption {
  innerhandleOption = new InnerhandleOption();

  handlechartOption = (type, data) => {
    switch (type) {
      case TYPE.PERCENT_PIE:
        return this.innerhandleOption.handlePercentPie(data);
      case TYPE.SIMPLE_PIE:
        return this.innerhandleOption.handleSimplePie(data);
      case TYPE.LINE_BAR:
        return this.innerhandleOption.handleLineBar(data);
      case TYPE.LINES:
        return this.innerhandleOption.handleLines(data);
      case TYPE.SIMPLE_LINE:
        return this.innerhandleOption.handleSimpleLine(data);
      default:
        break;
    }
  };
  TYPE = TYPE;
}
const TYPE = {
  SIMPLE_PIE: 0, //空心圆
  LINE_BAR: 1, //线条和柱子
  LINES: 2, //全是线条
  SIMPLE_LINE: 3, //单线条且无x和y轴
  PERCENT_PIE: 4, //占比图
};
export { ChartOption };
export default new ChartOption();
