import React from 'react';
import previewPDF from 'src/modules/previewPDF';
import { getPageQuery } from 'src/modules/utils';

class View extends React.Component {
  get query() {
    return getPageQuery();
  }
  componentDidMount() {
    this.query.fileUrl && previewPDF(this.query.fileUrl);
  }  
  render() {
    return null;
  }
}

export default View;
