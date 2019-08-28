import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const NoMatch = ({ location }) => (
  <div className="page">
    <div className="page_nomatch">
      <div className="nomatch_content">
        <h3>404</h3>
        <div className="nomatch_desc">
          抱歉，你访问的页面不存在<code>{location.pathname}</code>
        </div>
        <div className="nomatch_actions">
          <Link to={'/'} replace>
            <Button type="primary">返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default NoMatch;
