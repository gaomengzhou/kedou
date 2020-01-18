import { ListView } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';

const data = [
  { title: '老一', img: require('../../../assets/images/testphoto.png'), des: '我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言', key: 1 },
  { title: '老二', img: require('../../../assets/images/testphoto.png'), des: '我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言', key: 2 },
  { title: '老三', img: require('../../../assets/images/testphoto.png'), des: '我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言', key: 3 },
  { title: '老四', img: require('../../../assets/images/testphoto.png'), des: '我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言', key: 4 },
  { title: '老五', img: require('../../../assets/images/testphoto.png'), des: '我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言我是留言', key: 5 },
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

class MyViewList extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      hasMore: false,//来自后端数据，指示是否为最后一页，这里为false
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    setTimeout(() => {
      genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei,
      });
    }, 600);
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
  //     });
  //   }
  // }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      genData(++pageIndex);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
      });
    }, 1000);
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div className='messageBoard'>
            <div style={{ display: 'flex', height: '1rem', alignContent: 'center', justifyItems: 'center' }}>
              <div style={{ display: 'flex', width: '90%', alignContent: 'center', justifyItems: 'center' }}>
                <img src={obj.img} alt="" />
                <p style={{ flex: 1 }}>{obj.title}</p>
              </div>
              <div style={{ width: '10%', textAlign: 'left' }}>
                <i className='love' />
                <p>{300}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', paddingBottom: '15px' }} className='messageBoard'>
            <p style={{ backgroundColor: '#e6e3e3', borderRadius: '.15rem', padding: '.1rem' }}>{obj.des}</p>
          </div>
        </div>
      );
    };

    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        // renderBodyComponent={() => <MyBody />}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        pageSize={4}
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
}


export default MyViewList
