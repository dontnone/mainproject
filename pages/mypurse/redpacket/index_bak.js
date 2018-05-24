import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/redpacket'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import moment from 'moment'
import { onFocus, onBlur } from '../../../common/Util'


let pageIndex = 1
export default class extends Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            hasMore: true,
            useBodyScroll: false,
            redCode: '',
            redType: '1'
        }
    }
    async componentDidMount() {
        // const res = await Api.redpacketList({status: 0, page: 1})
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 165) + 'px'
        })
        const res = await Api.redpacketList({status: 1, page: 1})
        this.rData = res.items
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        });
        if(res && res.items.length <= 20){
            this.setState({
                hasMore: false
            })
        }
    }
    getServer = async (type, pages) => {
        const context = {
            status: type,
            page: pages
        }
        const res = await Api.redpacketList(context)
        if(res && res.items.length <= 20){
            this.setState({
                hasMore: false
            })
        }
        return res
    }
    onRefresh = async () => {
        pageIndex = 1
        this.setState({ refreshing: true, isLoading: true });
        switch (this.state.redType){
            case '1':
                const res = await Api.redpacketList({status: 1, page: 1})
                this.rData = res.items
                break;
            case '2':
                const res1 = await Api.redpacketList({status: 2, page: 1})
                this.rData = res1.items
                break;
            case '3':
                const res2 = await Api.redpacketList({status: 3, page: 1})
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
        switch (this.state.redType) {
            case "1":
                res = await Api.redpacketList({status: 1, page: ++pageIndex})
                break;
            case "2":
                res = await Api.redpacketList({status: 2, page: ++pageIndex})
                break;
            case "3":
                res = await Api.redpacketList({status: 3, page: ++pageIndex})
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
        });
    };
    entryCode = (e) => {
        var reg = /^[0-9a-zA-Z]+$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        this.setState({
            redCode: e.target.value
        })
    }
    bindRedpacket = async () => {
        const res = await Api.redpacketBind(this.state.redCode)
        if(res.code == '0'){
            const resRed = await this.getServer(key, 1)
            if(resRed.totalCount == 0){
                this.rData = []
            }else{
                this.rData = resRed.items
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false,
                redType: "1"
            })
            Toast.info(res.message, 2)
        }else{
            Toast.info(res.message, 2)
        }
    }
    changeTab = key => async () => {
        pageIndex = 1
        const res = await this.getServer(key, 1)
        if(res.totalCount == 0){
            this.rData = []
        }else{
            this.rData = res.items
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
            redType: key
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
          );
          const row = (rowData, sectionID, rowID) => {
            return (
                <li className={this.state.redType == '1' ? 'red-list-item' : this.state.redType == '2' ? 'red-list-item used-list-wrapper' : 'red-list-item overdue-red-list-wrapper'} key = {rowID}>
                    <div className="dis-flex-row">
                        <div className="item-left red-detail">
                            <p className="red-name">{rowData.title}</p>
                            <p className="expiration-date">有效日期：{moment(Number(rowData.startDate)).format('YYYY-MM-DD')}至{moment(Number(rowData.validDate)).format('YYYY-MM-DD')}</p>
                            <p className="expiration-date">使用平台：{rowData.platform}</p>
                        </div>
                        <div className="item-right red-amount">
                            <p className="red-packet">{rowData.amount}元</p>
                            <p className="reduction-range">满{rowData.amountLimit}使用</p>
                        </div>
                    </div>
                    <p className="red-range">适用范围：{rowData.productRange}</p>
                    <div className={ this.state.redType == '1' ? '' : this.state.redType == '2' ? 'right-bg used-icon' : 'right-bg overdue-icon' }></div>
                </li>
            );
        };
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/redpacket/_.css" />
                </Head>
                <div className="redpacket-box">
                    <Header title="我的优惠券" dmp={ true } dev_id="A12.6-1" eventtype="jump" />
                    <div className="redpacket-container">
                        <div className="code-input">
                            <input type="text" className="dmp-click" dev_id="A12.6-2" eventtype="any_value" dmp_action="write" spellCheck={ false } onFocus={ onFocus() } onBlur={ onBlur('请输入兑换码') } placeholder="请输入兑换码" value={ this.state.redCode } onChange={ this.entryCode }  />
                            <button className="xxd-xl-btn dmp-click" dev_id="A12.6-3" eventtype="jump" disabled={ this.state.redCode.length < 8 ? true : false } onClick={ this.bindRedpacket }>绑定</button>
                        </div>
                        <div className="main-tab">
                            <ul className="tab-wrapper">
                                <li onClick={ this.changeTab('1') } dev_id="A12.6-4" eventtype="to_active" className={ this.state.redType == '1' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A12.6-4" eventtype="to_active">可使用</a></li>
                                <li onClick={ this.changeTab('2') } dev_id="A12.6-5" eventtype="to_active" className={ this.state.redType == '2' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A12.6-5" eventtype="to_active">已使用</a></li>
                                <li onClick={ this.changeTab('3') } dev_id="A12.6-6" eventtype="to_active" className={ this.state.redType == '3' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A12.6-6" eventtype="to_active">已过期</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content-wrapper">
                            <div className="tab-content block">
                                <ul className="red-list">
                                {
                                    this.rData && this.rData.length == 0 ? 
                                    <div className="text-center">
                                        <p>亲，您暂时还没有相关红包哦！</p>
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