import Header from '@/components/header';
// import { category } from '@/store/action/book';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { category, setOnRefresh } from '../../store/action/book'
import { Modal } from 'antd-mobile';
import { bannel_list } from '../../store/action/bannel'
import Tabs from '../../components/tabs'
import { detail } from '../../services/book'
// import BooksDetail from '../../components/BooksDetail'
import Audio from '../../components/Audio'
import './index.less'
const stateToProps = (state) => {
    return {
        tabList: state.book.tabList,
        refresh: state.book.refresh,
    }
}
const mapDispatchToProps = {
    category,
    setOnRefresh,
    bannel_list
};
@connect(
    stateToProps,
    mapDispatchToProps,
)
class Book extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showHome: true,
            loginShow: false,
            my: false,
            novelItem: '',
            detailShow: false,
            // collectSucceed: []
        }
    }
    componentDidMount() {
        this.props.category({
            page: 1
        })
        this.props.bannel_list({
            type: 1
        })
        this.props.setOnRefresh(true)
        if (this.props.history.location.state) {
            const { id } = this.props.history.location.state
            if (id) {
                this.getBooKDetail(id)
                this.props.setOnRefresh(false)
            }
        }
    }
    testRightCallBack = () => {
        const { loginShow, my } = this.state
		const user_id = sessionStorage.getItem('user_id')
		if (!user_id) {
			this.props.history.push('/Login')
		} else {
			if (loginShow) {
				this.setState({
					loginShow: false,
					my: false
				})
				// this.props.history.push('/Login')
			} else {
				this.setState({
					my: !my
				})
			}

		}
    }
    closeMyLoginShow = () => {
        this.setState({
            my: false
        })
    }
    Popo = () => {
        const arr = [
            {
                src: `user_favorite_btn.png`,
                title: '我的收藏',
                goto: '/collect'
            }, {
                src: `user_feedback_btn.png`,
                title: '意见反馈',
                goto: '/userfeedback'
            },
            {
                src: 'user_close_btn.png',
                title: '退出登录',
                goto: '/'
            }
        ]
        return (
            arr.map(e => {
                return (
                    <div key={e.goto} onClick={() => {
                        if (e.title === '退出登录') {
                            sessionStorage.removeItem('user_id')
                            sessionStorage.removeItem('invitation_code')
                            this.setState({
                                my: false
                            })
                            return false
                        }
                        this.props.history.push(e.goto)
                    }}>
                        <div style={{
                            width: '70%',
                            margin: 'auto',
                            padding: '.1rem'
                        }}>
                            <img src={require(`@/assets/images/${e.src}`)} alt="" style={{
                                width: '100%',
                                height: '100%'
                            }} />
                        </div>
                        <p style={{
                            textAlign: 'center',
                            padding: '0 0 .1rem 0'
                        }}>{e.title}</p>

                    </div>
                )
            })
        )
    }
    getBooKDetail = async (bookId) => {
        if (!sessionStorage.getItem('user_id')) {
            Modal.alert('您还没有登录', '', [
				{ text: '取消', onPress: () =>''},
				{
					text: '去登录 >',
					onPress: () => this.props.history.push({
                        pathname:'/login',
                        state:{
                            bookId
                        }
                    }),
					style:{
						color:'#9718ec'
					}
				},
			])
			return false
        }
        await this.setState({
            novelItem: null
        })
        await detail({
            user_id: sessionStorage.getItem('user_id'),
            novel_id: bookId
        }).then(res => {

            const serials = res.video
            const novelPoster = res.poster
            const novelTitle = res.title
            const novelItem = {
                serials,
                novelPoster,
                novelTitle,
                player: serials[0]
            }
            document.querySelector('.TabBer').style.display = 'none'
            this.props.setOnRefresh(false)
            this.setState({
                detailShow: true,
                novelItem,
                detailInfo: res
            }, () => {
                this.props.history.push({
                    pathname: '/book',
                    state: {
                        id: bookId
                    }
                })
            })
        })

    }
    // setOnRefresh=()=>{
    // 	console.log('this.state.detailShow',this.state.detailShow);
    //         this.setState({
    //             onOnRefresh:this.state.detailShow
    //         })
    // }
    // setCollect = (novel_id) => {
    //  if (!sessionStorage.getItem('user_id')) {
    //      this.testRightCallBack()
    //      return false
    //  }
    //  const collectSucceed=this.state.collectSucceed
    //  collect({
    //      user_id: sessionStorage.getItem('user_id'),
    //      novel_id: novel_id
    //  }).then(res => {
    //      if (res.code === 0) {
    //          Toast.info(res.suc)
    //          if(res.suc==='取消成功'){
    //              collectSucceed.splice(collectSucceed.findIndex(item => item === novel_id), 1)
    //              this.setState({
    //                  collectSucceed
    //              })
    //              return false
    //          }
    //          collectSucceed.push(novel_id)
    //          this.setState({
    //              collectSucceed: collectSucceed
    //          })
    //      } else {
    //          Toast.info(res.err)
    //      }

    //  })

    // }
    setDetailShow = (open) => {
        if(open){
            document.querySelector('.TabBer').style.display = 'none'
            this.props.setOnRefresh(false)
            this.setState({
                detailShow:true
            })
            return false
        }
        document.querySelector('.TabBer').style.display = 'block'
        // if (document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.header-search') && document.querySelector('.background') && document.querySelector('.TabBer')) {
        //     document.querySelector('.background').style.top = '0rem'
        //     document.querySelector('.header-search').style.top = '0rem'
        //     document.querySelector('.am-tabs-tab-bar-wrap').style.top = '1rem'
        //     document.querySelector('.TabBer').style.bottom = '0'
        // }
        this.props.setOnRefresh(true)
        this.setState({
            detailShow: !this.state.detailShow
        })
    }
    render() {
        const {
            state: {
                // loginShow,
                my,
                detailShow,
                novelItem,
                // collectSucceed,
                detailInfo,
            },
            props: {
                tabList,
            },
            getBooKDetail,
            testRightCallBack,
            setDetailShow,
            closeMyLoginShow
            // setCollect
        } = this
        const novelItem2 = {
            ...novelItem,
            setDetailShow,
            detailInfo,
            getBooKDetail,
            closeMyLoginShow
        }
        const bookHeader = {
            // leftCallBack: this.testCallBack,
            rightCallBack: testRightCallBack,
            detailShow,
            type: 'book'
        }

        const tabsParameter = {
            tabList: tabList,
            getBooKDetail,
            testRightCallBack,
            closeMyLoginShow,
            detailShow
            // setCollect,
            // collectSucceed
        }
        return (
            <div id='home_book'>
                <div style={!detailShow ? { height: '100%' } : { height: '0' }}>
                    <Header {...bookHeader} />
                    <Tabs {...tabsParameter} />
                    {/* {loginShow && <Login rightCallBack={this.testRightCallBack} />} */}
                    {
                        my && <div style={{
                            position: 'fixed',
                            top: '1rem',
                            left: '.1rem',
                            zIndex: '1000',
                            padding: '.1rem',
                            backgroundColor: '#fff',
                            borderRadius: '.1rem'
                        }}>
                            {
                                this.Popo()
                            }
                            <div style={{
                                position: 'absolute',
                                top: '-.2rem',
                                left: '20%',
                                borderTop: ' .1rem solid transparent',
                                borderBottom: '.1rem solid #fff',
                                borderLeft: '.1rem solid transparent',
                                borderRight: '.1rem solid transparent'
                            }}></div>
                        </div>
                    }
                </div>
                {
                    novelItem && <Audio {...novelItem2} />
                }

            </div>
        );
    }
}
export default Book;
