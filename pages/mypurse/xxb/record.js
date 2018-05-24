import React, { Component } from 'react'
import Head from 'next/head'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import Header from '../../../components/header/index'
import Api from '../../../components/api/redpacket'
import moment from 'moment'

let pageIndex = 1
export default class extends Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            hasMore: true,
            useBodyScroll: false,
            xxbType: '0'
        }
    }
    async componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 98) + 'px'
        })
        const res = await Api.xxbRecord({page: 1, type: 0})
        if(res.totalCount == 0){
            this.setState({
                hasMore: false
            })
        }
        this.rData = res.items
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        });
    }
    onRefresh = async () => {
        pageIndex = 1
        this.setState({ refreshing: true, isLoading: true });
        switch (this.state.xxbType){
            case '0':
                const res = await Api.xxbRecord({type: 0, page: 1})
                this.rData = res.items
                break;
            case '1':
                const res1 = await Api.xxbRecord({type: 1, page: 1})
                this.rData = res1.items
                break;
            case '2':
                const res2 = await Api.xxbRecord({type: 2, page: 1})
                this.rData = res2.items
                break;
            default:
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
        switch (this.state.xxbType) {
            case "0":
                res = await Api.xxbRecord({type: 0, page: ++pageIndex})
                break;
            case "1":
                res = await Api.xxbRecord({type: 1, page: ++pageIndex})
                break;
            case "2":
                res = await Api.xxbRecord({type: 2, page: ++pageIndex})
                break;
            default:
        }
        if(res.totalCount == 0){
            this.setState({
                hasMore: false
            })
            return
        }
        this.rData = this.rData.concat(res.items);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        })
    }
    getServer = async (type, pages) => {
        const context = {
            type: type,
            page: pages
        }
        const res = await Api.xxbRecord(context)
        if(res && res.totalCount == 0){
            this.setState({
                hasMore: false
            })
        }
        return res
    }
    changeTab = key => async () => {
        pageIndex = 1
        const res = await this.getServer(key, 1)
        if(res.totalCount == 0){
            this.rData = []
        }else{
            this.rData = res.items
        }
        await this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            hasMore: true,
            refreshing: false,
            isLoading: false,
            xxbType: key
        })
        if(this.refs.lv){
            this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop = 0
        }
    }
    render() {
        const separator = (sectionID, rowID) => (
            <div
              key={`${sectionID}-${rowID}`}
            />
        )
        const row = (rowData, sectionID, rowID) => {
            return (
                <li className="list-item dis-flex-row" key={ rowID }>
                    <div className="item-left">
                        <p className="xxb-source">{ rowData.name }</p>
                        <p className="exchange-time">{ moment(Number(rowData.tradeTime)).format('YYYY/MM/DD HH:mm:ss') }</p>
                        <p className="activity-name">{ rowData.tradeExplain }</p>
                    </div>
                    <div className={ rowData.tradeType == 2 ? 'item-right amount subtract' : 'item-right amount' }>{ rowData.tradeType == 2 ? '-' + rowData.tradeNum : '+' + rowData.tradeNum }个</div>
                </li>
            );
        }
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/xxb/_.css" />
                </Head>
                <div className="xxb-box">
                    <Header title="新新币记录" dmp={ true } dev_id="A12.8-1" eventtype="jump" />
                    <div className="record-container position-a">
                        <ul className="tab-wrapper">
                            <li onClick={ this.changeTab('0') } dev_id="A12.8-2" eventtype="to_active" className={ this.state.xxbType == '0' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A12.8-2" eventtype="to_active">全部</a></li>
                            <li onClick={ this.changeTab('1') } dev_id="A12.8-3" eventtype="to_active" className={ this.state.xxbType == '1' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A12.8-3" eventtype="to_active">获得</a></li>
                            <li onClick={ this.changeTab('2') } dev_id="A12.8-4" eventtype="to_active" className={ this.state.xxbType == '2' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A12.8-4" eventtype="to_active">兑换</a></li>
                        </ul>
                        <div className="tab-content">
                            <ul className="list">
                            {
                                this.rData && this.rData.length == 0 ? 
                                <div className="text-center">
                                    <p>暂无新新币记录</p>
                                </div>
                                :
                                <ListView
                                    key={this.state.useBodyScroll ? '0' : '1'}
                                    ref="lv"
                                    dataSource={this.state.dataSource}
                                    renderFooter={() => (<div style={{ padding: '10px 0 30px', textAlign: 'center' }}>
                                    {this.state.hasMore ? '加载中...' : '已全部加载'}
                                    </div>)}
                                    renderRow={row}
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
                            }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}