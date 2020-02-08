import { Tabs } from 'antd-mobile';
import PropTypes from 'prop-types';
import React from 'react';
import { theme } from '../../../utils/theme';
import './tabs.less';

const TabExample = (props) => (
  <div className='tabsStyle'>
    {/* <WhiteSpace /> */}
    <Tabs
      tabs={props.tabs}
      initialPage={0}
      onChange={props.onTabChange}
      animated
      swipeable={false}
      useOnPan={false}
      tabBarActiveTextColor={theme.hitActiveColor}
      tabBarInactiveTextColor='#e0d7d7'
      tabBarUnderlineStyle={{ width: '1rem', marginLeft: '1.3rem', borderColor: theme.hitActiveColor, }}
    >
      <div className='content'>
        {props.tabsContent1()}
      </div>
      <div className='content'>
        {props.tabsContent2()}
      </div>
    </Tabs>
  </div>
);

TabExample.propTypes = {
  tabs: PropTypes.array.isRequired,
  onTabChange: PropTypes.func,
  tabsContent1: PropTypes.func,
  tabsContent2: PropTypes.func,
}

TabExample.defaultProps = {
  tabs: [
    { title: '视频' },
    { title: '听书' },
  ],
  onTabChange: () => null,
  tabsContent1: () => null,
  tabsContent2: () => null,
}
export default TabExample
