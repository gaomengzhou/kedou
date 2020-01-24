import { Tabs } from 'antd-mobile';
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
      tabBarUnderlineStyle={{width:'1rem',marginLeft:'1.3rem',borderColor:theme.hitActiveColor,}}
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

export default TabExample
