import React, { Component } from 'react';
import {withRouter,Link} from 'react-router-dom'
class test extends Component {
  render() {
    return (
      <div>
        test
        <Link to="/test/child1">嵌套路由1</Link>
        <Link to="/test/child2">嵌套路由2</Link>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(test);