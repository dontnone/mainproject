import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import { localItem , removeLocalItem } from '../../common/Util'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import Api from '../../components/api/financial'

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
export default class extends Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            height:'',
            refreshing: true,
            isLoading: true,
            hasMore: true,
            useBodyScroll: false,
        }
    }
    async componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 98) + 'px'
        })
        if(!localItem('creditList')){
            const res = await Api.creditList({page: pageIndex})
            this.rData = res.items
            const cont = {
                page: 1,
                data: this.rData,
                hasMore: this.state.hasMore
            }
            localItem('creditList', JSON.stringify(cont))
        }else{
            const localItems = JSON.parse(localItem('creditList'))
            this.rData = localItems.data
            pageIndex = localItems.page
            this.setState({
                hasMore: localItems.hasMore
            })
        }
        await this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        });
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
        const res = await Api.creditList({page: 1})
        if(res.items.length < 20 || res.totalCount == 0){
            this.setState({
                hasMore: false
            })
        }
        this.rData = res.items
        const cont = {
            page: pageIndex,
            data: this.rData,
            hasMore: this.state.hasMore
        }
        localItem('creditList', JSON.stringify(cont))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        })
    }
    
    onEndReached = async (event) => {
        this.setState({ isLoading: true });
        const res = await Api.creditList({page: ++pageIndex})
        if(res.totalCount == 0 || res.items.length == 0){
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
        localItem('creditList', JSON.stringify(cont))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        });
    };
    entryDetail = row => () => {
        localItem('scrollPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        if(row.type == '20'){
            location = '/financial/creditdetailxyd?id=' + row.borrowId
        }else{
            location = '/financial/creditdetail?id=' + row.borrowId
        }
    }
    render() {
        const separator = (sectionID, rowID) => (
            <div
              key={`${sectionID}-${rowID}`}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            return (
                <li className="" key={ rowID }>
                    <p className="zq-name">
                        <span>{ rowData.name }</span>
                    </p>
                    <div className="zq-detail dis-flex-row">
                        <div className="detail-li zq-earnings">
                            <p className="count"><span className="month">{ rowData.period }</span>{ rowData.periodUnit }</p>
                            <p className="txt">借款期限</p>
                        </div>
                        <div className="detail-li">
                            <p className="count sum">{ rowData.account }<span>元</span></p>
                            <p className="txt">出借金额</p>
                        </div>
                        <div className="detail-li">
                            <p className="count"><span className="month">{ rowData.apr }</span>%</p>
                            <p className="txt">借款利率</p>
                        </div>
                    </div>
                    <p className="p-link dmp-click" dev_id="A8.4-1.1" eventtype="jump"><a className="dmp-click" dev_id="A8.4-1.1" eventtype="jump" onClick={ this.entryDetail(rowData) }>查看详情</a></p>
                </li>
            );
        };
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="债权列表" dmp={ true } dev_id="A8.4-1" eventtype="jump" />
                    <div className="zq-container position-a">
                        <div className='credit-tip'>
                            <p>———— 近期借款项目 ————</p>
                        </div>
                        <ul className="zq-list">
                        <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref='lv'
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                            {this.state.hasMore ? '加载中...' : '已全部加载'}
                            </div>)}
                            renderRow={row}
                            renderSeparator={separator}
                            initialListSize={this.rData && this.rData.length || 20}
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
                    </div>
                </div>
            </div>
        )
    }
}