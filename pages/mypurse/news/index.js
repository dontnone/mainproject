import React, { Component } from 'react'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import Head from 'next/head'
import Router from 'next/router'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import { localItem , removeLocalItem } from '../../../common/Util'
import moment from 'moment'

let pageIndex = 1
// 滚动到记录的位置方法
const returnTop = (con)=> {
    if (localItem('scrollPosition')) {
        if (!con.refs.lv) return;
        try {
            con.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop = localItem('scrollPosition');
        }
        catch (e) {
            // console.log(e)
        }
        removeLocalItem('scrollPosition');
    }
}
class App extends Component {
    constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
        dataSource,
        refreshing: true,
        isLoading: true,
        hasMore: true,
        underline: true,
        useBodyScroll: false,
    };
}

async componentDidMount() {
    typeof window !== "undefined" ? window : this
    const document = window.document
    this.setState({
        height: (document.documentElement.clientHeight - 97) + 'px'
    })
    if(!localItem('newsList')){
        const res = await Api.noticeList({page: pageIndex})
        this.rData = res.items
        const cont = {
            page: pageIndex,
            data: this.rData,
            hasMore: this.state.hasMore
        }
        localItem('newsList', JSON.stringify(cont))
    }else{
        const lists = JSON.parse(localItem('newsList'))
        this.rData = lists.data
        pageIndex = lists.page
        this.setState({
            hasMore: lists.hasMore
        })
    }
    await this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
    });
    // this.onReload()
    returnTop(this)
}

   //返回记录滚动位置三件套2-针对浏览器返回按钮情况：
componentDidUpdate() {
    returnTop(this)
}
//返回记录滚动位置三件套3-记录离开时的滚动条位置：
componentWillUnmount() {
    localItem('scrollPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
}

onRefresh = async () => {
    pageIndex = 1
    this.setState({ refreshing: true, isLoading: true });
    if(this.state.underline){
        const res = await Api.noticeList({page: 1})
        this.rData = res.items
        const cont = {
            page: pageIndex,
            data: this.rData,
            hasMore: this.state.hasMore
        }
        localItem('newsList', JSON.stringify(cont))
    }else{
        const res = await Api.systermInfoList({page: 1})
        this.rData = res.items
    }
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
    })
}

onEndReached = async (event) => {
    this.setState({ isLoading: true });
    let res = {}
    if(this.state.underline){
        res = await Api.noticeList({page: ++pageIndex})
    }else{
        res = await Api.systermInfoList({page: ++pageIndex})
    }
    
    if(res.totalCount == 0){
        this.setState({
            hasMore: false
        })
        return
    }
    this.rData = this.rData.concat(res.items);
    const cont = {
        page: pageIndex,
        data: this.rData,
        hasMore: this.state.hasMore
    }
    localItem('newsList', JSON.stringify(cont))
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
    })
}
onReload = async () => {
    const res = await Api.noticeList({page: 1})
    this.rData = res.items
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
    })
}
onReloadSysterm = async () => {
    const res = await Api.systermInfoList({page: 1})
    this.rData = res.items
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
    })
}
onChange = key => async (e) => {
    this.rData = []
    pageIndex = 1
    this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop = 0;
    if(key == 'notice'){
    const res = await Api.noticeList({page: pageIndex})
    this.rData = res.items
    const cont = {
        page: pageIndex,
        data: this.rData,
        hasMore: this.state.hasMore
    }
    localItem('newsList', JSON.stringify(cont))
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
        underline: true
    });
    this.setState({
        hasMore: true
    })
    if(this.rData.length < 20){
        this.setState({
            hasMore: false
        })
    }
    }else{
    const res = await Api.systermInfoList({page: pageIndex})
    if(res.totalCount == '0'){
        this.rData = []
    }else{
        this.rData = res.items
    }
    
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
        underline: false
    });
    this.setState({
        hasMore: true
    })
    if(this.rData.length < 20){
        this.setState({
            hasMore: false
        })
    }
    
    }
}
noticeInfo = async (e) => {
    const target = e.currentTarget.children[0].children[0]
    if(this.state.underline){
        let newsList = JSON.parse(localItem('newsList'))
        const newsListData = newsList.data
        for(let i=0; i<newsListData.length; i++){
            if(newsListData[i].id == e.currentTarget.id){
                newsListData[i].status = 'Y'
            }
        }
        const cont = {
            page: pageIndex,
            data: newsListData,
            hasMore: this.state.hasMore
        }
        localItem('newsList', JSON.stringify(cont))
        Router.push('/mypurse/news/detail?id=' + e.currentTarget.id)
    }else{
        const res = await Api.systermRead(e.currentTarget.id)
        if(res.code == '0'){
            target.className = ''
        }
    }
}

allRead = async () => {
    if(this.state.underline){
        const res = await Api.allRead(1)
        if(res.code == '0'){
            let newsList = JSON.parse(localItem('newsList'))
            const newsListData = newsList.data
            for(let i=0; i<newsListData.length; i++){
                newsListData[i].status = 'Y'
            }
            this.rData = newsListData
            pageIndex = newsList.page
            const cont = {
                page: pageIndex,
                data: this.rData
            }
            localItem('newsList', JSON.stringify(cont))
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData)
            });
            // this.onReload()
            Toast.info('设置成功', 2)
        }
    }else{
        const res = await Api.allRead(2)
        if(res.code == '0'){
            this.onReloadSysterm()
            Toast.info('设置成功', 2)
        }
    }
}

  render() {    
   
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
      />
    );
    const row = (rowData, sectionID, rowID) => {
        let targetId = 'A13.1-3.1-'
        if(this.state.underline){
            targetId = 'A13.1-2.1-'
        }
      return (
        <li className="list-item" key={ rowID } id={ rowData.id } onClick={ this.noticeInfo }>
            <div className="tit">
                <span className={ rowData.status == 'N' ? 'notice' : '' }></span>
                <p >{rowData.title}</p>
                <span className="time">{moment(Number(rowData.addTime)).format('YYYY-MM-DD')}</span>
            </div>
            <div className="digest">
                {rowData.context}
            </div>
        </li>
      );
    };
    return (<div>
        <Head>
            <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/news/_.css" />
        </Head>
        <div className="news-box position-a">
            <Header title="我的消息" dmp={ true } dev_id="A13.1-1" eventtype="jump" rightTitle="全部已读" everyRead={ this.allRead } />
            <div className="news-container position-a">
                <ul className="tab-wrapper">
                    <li onClick={ this.onChange('notice') } dev_id="A13.1-2" eventtype="to_active" className={ this.state.underline ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a dev_id="A13.1-2" eventtype="to_active" className="dmp-click" >通知公告</a></li>
                    <li onClick={ this.onChange('systerm') } dev_id="A13.1-3" eventtype="to_active" className={ this.state.underline ? 'tab-link dmp-click' : 'tab-link tab-link-act dmp-click' }><a dev_id="A13.1-3" eventtype="to_active" className="dmp-click">系统消息</a></li>
                </ul>
                <div className="tab-content-wrapper">
                   
                    {
                        this.rData && this.rData.length == 0 ?
                        <div className="nomsg block">
                            <div className="nomsg-bg"></div>
                            <p>当前无消息提示</p>
                        </div> :
                        <ul className="tab-content">
                            <ListView
                                key={this.state.useBodyScroll ? '0' : '1'}
                                ref='lv'
                                dataSource={this.state.dataSource}
                                renderFooter={() => (<div style={{ padding: '10px 0 30px', textAlign: 'center' }}>
                                {this.state.hasMore ? '加载中...' : '已全部加载'}
                                </div>)}
                                renderRow={row}
                                initialListSize={this.rData && this.rData.length || 20}
                                renderSeparator={separator}
                                useBodyScroll={this.state.useBodyScroll}
                                style={this.state.useBodyScroll ? {} : {
                                height: this.state.height,
                                margin: '5px 0',
                                }}
                                pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                                />}
                                onEndReached={this.onEndReached}
                                pageSize={5}
                            />
                        </ul>
                    }
                </div>
            </div>
        </div>
    </div>);
  }
}

export default App