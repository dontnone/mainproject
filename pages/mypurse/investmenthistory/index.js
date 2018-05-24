import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/investment'
import userApi from '../../../components/api/purse'
import FinancialApi from '../../../components/api/financial'
import moment from 'moment'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import { localItem , removeLocalItem, getQueryString, openApp } from '../../../common/Util'
import { status } from '../../../common/status'
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
class Investment extends Component {
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
            investType: '1',
            showSelect: false,
            userId: '',
            sign: '',
            selectList: [],
            proName: '所有产品',         //  1: 当前; 2: 历史
            code: 1,                    //  1: LIST, 2: detail
            productType: '0'            //  0=默认所有,1=日日盈(只有历史),2=步步高升,3=七天大胜(只有历史),4=月进斗金,5=新元宝,6=月月派,7=散标债权,10=新手专属30天,16=新手标
        }
    }
    async componentWillMount() {
        const userId = await userApi.userInfo()
        const sign = await FinancialApi.getSign({userId: userId.userId})
        await this.setState({
            userId: userId.userId,
            sign
        })
    }
    async componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 150) + 'px'
        })
        if(localItem('creditList')){
            removeLocalItem('creditList');
        }
        const liList = {
            page: 1,
            type: this.state.investType,
            code: 1,
            productCode: this.state.productType
        }
        let localItems = ''
        if(localItem('dataList')){
            localItems = JSON.parse(localItem('dataList'))
        }
        if(!localItems || localItems.data.length == 0){
            const list = await Api.myInvestRecord(liList)
            await this.setState({
                selectList: list
            })
            await this.allServer()
        }else{
            this.rData = localItems.data;
            pageIndex = localItems.page
            await this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false,
                selectList: localItems.list,
                investType: localItems.type,
                proName: localItems.name,
                hasMore: localItems.hasMore,
            });
        }
        returnTop(this);
    }
    //返回记录滚动位置三件套2-针对浏览器返回按钮情况：
    componentDidUpdate() {
        returnTop(this);
    }
    allServer = async () => {
        const context = {
            page: 1,
            type: this.state.investType,
            code: 2,
            productCode: this.state.productType
        }
        const res = await Api.myInvestRecord(context)
        this.rData = res.items
        if(res.items.length < 20){
            this.setState({
                hasMore: false
            })
        }
        const cont = {
            page: pageIndex,
            data: this.rData,
            list: this.state.selectList,
            type: this.state.investType,
            name: this.state.proName,
            hasMore: this.state.hasMore
        }
        localItem('dataList', JSON.stringify(cont))
        await this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        });
        Toast.hide()
    }
    onRefresh = async () => {
        pageIndex = 1
        this.setState({ refreshing: true, isLoading: true });
        this.allServer()
    }
    onEndReached = async (event) => {
        this.setState({ isLoading: true });
        const context = {
            page: ++pageIndex,
            type: this.state.investType,
            code: 2,
            productCode: this.state.productType
        }
        const res = await Api.myInvestRecord(context)
        if(res.items && res.items.length == 0 || JSON.stringify(res) == "{}"){
            this.setState({
                hasMore: false
            })
            return
        }
        this.rData = this.rData.concat(res.items);
        const cont = {
            page: pageIndex,
            data: this.rData,
            list: this.state.selectList,
            type: this.state.investType,
            name: this.state.proName,
            hasMore: this.state.hasMore
        }
        localItem('dataList', JSON.stringify(cont))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        });
    };
    
    investType = key => async () =>{
        Toast.loading('加载中……', 0)
        pageIndex = 1
        await this.setState({
            investType: key,
            hasMore: true,
            proName: '所有产品',
            productType: '0',
            showSelect: false
        })
        const liList = {
            page: 1,
            type: this.state.investType,
            code: 1,
            productCode: this.state.productType
        }
        const list = await Api.myInvestRecord(liList)
        await this.setState({
            selectList: list
        })
        await this.allServer() 
        if(this.refs.lv){
            this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scroll = 0
            this.refs.lv.scrollTo(0, 0)
        }
        Toast.hide()
    }
    showSelect = () => {
        this.setState({
            showSelect: !this.state.showSelect
        })
    }
    hideAndSect = (key, name) => async () => {
        Toast.loading('加载中……', 0)
        pageIndex = 1
        await this.setState({
            proName: name,
            productType: key,
            showSelect: false
        })
        await this.allServer()   
        Toast.hide()
    }
    //  债权列表
    credit = (status, id) => () => {
        localItem('scrollPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        if(status){
            location = '/mypurse/investmenthistory/credit?id=' + id
        }
    }
    //  加入记录
    addRecord = (id, type) => () => {
        localItem('scrollPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        location = '/mypurse/investmenthistory/joinrecord?id=' + id + '&type=' + type
    }
    //  退出记录
    exitRecord = id => () => {
        localItem('scrollPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        location = '/mypurse/investmenthistory/exitrecord?borrowId=' + id
    }
    //  查看合同
    contract = row => async () => {
        localItem('scrollPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        let source = ''
        if(row.statusDesc == '流标'){
            source = '2'
        }else{
            source = '4'
        }
        const sessionParam = {
            borrowId: row.productId,
            source: source,
            uid: this.state.userId,
            sign: this.state.sign.resp,
        }
        await sessionStorage.setItem('contract', JSON.stringify(sessionParam))
        location = '/financial/contract?id=' + row.productId 
    }
    changeMoney = (val) => {
        if(val){
            var changeMoney = 0
            const ractMoney = Number(val).toFixed(2)
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
            return changeMoney
        }
    }
    splitNum = (val) => {
        if(val){
            val = String(val)
            if(val.indexOf('.') != -1){
                return val.substr(0, val.indexOf('.')) + val.substr(val.indexOf('.'), 2)
            }else{
                return val
            }
        }
    }
    downApp = () => {
        openApp()
    }
    render() {
        const separator = (sectionID, rowID) => (
            <div
              key={`${sectionID}-${rowID}`}
              
            />
        );
        const row = (rowData, sectionID, rowID) => {
            let productType = rowData.productType || ''
            let historyName = this.state.investType == '1' ? '待收' : '实际'
            if(productType == 6){
                // 月月派
                if(this.state.investType == '1'){
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>已收收益：<span className="income">{this.changeMoney(rowData.realInterest)}元</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                                </div>
                                <div className="column">
                                    <p>{historyName}收益：<span className="income">{this.changeMoney(rowData.interest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.2-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }else{
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                                    <p>提前退出：<span>{moment(Number(rowData.outDate)).format('YYYY-MM-DD')}</span></p>
                                </div>
                                <div className="column">
                                    <p>{historyName}收益：<span className="income">{this.changeMoney(rowData.interest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p className={ rowData.matching ? '' : 'hide' }>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.3-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }
            }else if(productType == 5){
                // 新元宝
                if(this.state.investType == '1'){
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    {
                                        rowData.statusDesc == '已退出' ?
                                        <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p> : ''
                                    }
                                    <p>加入记录：<a className="dmp-click" dev_id={ 'A14.3-1.2-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.addRecord(rowData.joinId, rowData.productType) }>点击查看</a></p>
                                </div>
                                <div className="column">
                                    <p>{historyName}收益：<span className="income">{this.changeMoney(rowData.interest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.2-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }else{
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    {
                                        rowData.statusDesc == '已退出' ?
                                        <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p> : ''
                                    }
                                    <p>加入记录：<a className="dmp-click" onClick={ this.addRecord(rowData.joinId, rowData.productType) } dev_id={ 'A14.3-1.2-' + JSON.stringify(rowData) } eventtype="jump">点击查看</a></p>
                                </div>
                                <div className="column">
                                    {
                                        rowData.statusDesc == '已提前退出' ? 
                                        <p>提前退出：<span>{moment(Number(rowData.outDate)).format('YYYY-MM-DD')}</span></p> : ''
                                    }
                                    <p>{historyName}收益：<span className="income">{this.changeMoney(rowData.interest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p className={ rowData.matching ? '' : 'hide' }>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.3-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }
            }else if(productType == 16){
                return (
                    <li key={ rowID }>
                        <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                        <span className="tip-right">请前往新新贷官网申请退出</span> :
                        ''
                      }</p>
                        <div className="detail dis-flex-row">
                            <div className="column">
                                <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                            </div>
                            <div className="column">
                                <p>{historyName}收益：<span className="income">{ this.changeMoney(rowData.interest) }元</span></p>
                                <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                {
                                    this.state.investType == '1' ? 
                                    <p>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.2-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p> :
                                    <p className={ rowData.matching ? '' : 'hide' }>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.3-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                }
                                
                            </div>
                        </div>
                    </li>
                )
            }else if(productType == 10 || productType == 4){
                // 新手产品30天 || 月进斗金 || 新手标
                return (
                    <li key={ rowID }>
                        <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                        <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                        ''
                      }</p>
                        <div className="detail dis-flex-row">
                            <div className="column">
                                <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                            </div>
                            <div className="column">
                                <p>{historyName}收益：<span className="income">{ this.changeMoney(rowData.interest) }元</span></p>
                                <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                {
                                    this.state.investType == '1' ? 
                                    <p>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.2-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p> :
                                    <p className={ rowData.matching ? '' : 'hide' }>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.3-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                }
                                
                            </div>
                        </div>
                    </li>
                )
            }else if(productType == 2){
                // 步步高升
                if(this.state.investType == '1'){
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>持有金额：<span className="amount">{this.changeMoney(rowData.remaCapital)}元</span></p>
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>计息天数：<span>{rowData.holdingDays}天</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                
                                </div>
                                <div className="column">
                                    <p>{historyName}收益：<span className="income">{this.changeMoney(rowData.interest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p>退出记录：<a className="dmp-click" dev_id={ 'A14.3-1.4-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.exitRecord(rowData.joinId) }>点击查看</a></p>
                                    <p>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.2-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }else{
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>计息天数：<span>{rowData.holdingDays}天</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    <p>全部退出：<span>{moment(Number(rowData.outDate)).format('YYYY-MM-DD')}</span></p>
                                </div>
                                <div className="column">
                                    <p>累计收益：<span className="income">{this.changeMoney(rowData.realInterest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p>退出记录：<a className="dmp-click" dev_id={ 'A14.3-1.4-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.exitRecord(rowData.joinId) }>点击查看</a></p>
                                    <p className={ rowData.matching ? '' : 'hide' }>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.3-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }
            }else if(productType == 7 || productType == 8){
                // 散标债权
                if(this.state.investType == '1'){
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    <p>已收本息：<span className="income">{rowData.receivedPrincipalAndInterest}元</span></p>
                                    <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    {
                                        rowData.statusDesc == '已转让' || rowData.statusDesc == '流标' ? '' :
                                        <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                                    }
                                </div>
                                <div className="column">
                                    <p>{historyName}本息：<span className="income">{this.changeMoney(rowData.dueInPrincipalAndInterest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p>合同：<a className="dmp-click" dev_id={ 'A14.3-1.3-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.contract(rowData) }>点击查看</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }else{
                    return (
                        <li key={ rowID }>
                            <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                            <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                            ''
                          }</p>
                            <div className="detail dis-flex-row">
                                <div className="column">
                                    <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                    {
                                        rowData.statusDesc == '流标' ? <p>退款时间：<span>{moment(Number(rowData.outDate)).format('YYYY-MM-DD')}</span></p> :
                                        <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                    }
                                    {
                                        rowData.statusDesc == '已转让' || rowData.statusDesc == '流标' ? '' :
                                        <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                                    }
                                    {
                                        rowData.statusDesc == '已转让' ?  <p>转让时间：<span>{moment(Number(rowData.outDate)).format('YYYY-MM-DD')}</span></p> : ''
                                    }
                                </div>
                                <div className="column">
                                    <p>实收本息：<span className="income">{this.changeMoney(rowData.actualPrincipalAndInterest)}元</span></p>
                                    <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                    <p>合同：<a className="dmp-click" dev_id={ 'A14.3-1.3-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.contract(rowData) }>点击查看</a></p>
                                </div>
                            </div>
                        </li>
                    )
                }
            }else if(productType == 1){
                //  日日盈
                return (
                    <li key={ rowID }>
                        <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                        <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                        ''
                      }</p>
                        <div className="detail dis-flex-row">
                            <div className="column">
                                <p>累计收益：<span>{this.changeMoney(rowData.realInterest)}元</span></p>
                            </div>
                            <div className="column">
                                <p>全部转出：<span>{moment(Number(rowData.outDate)).format('YYYY-MM-DD')}</span></p>
                            </div>
                        </div>
                    </li>
                )
            }else if(productType == 3){
                //  七天大圣
                return (
                    <li key={ rowID }>
                        <p className="product-name">{ rowData.name } <span className="tips">{rowData.statusDesc}</span>{ rowData.statusDesc == '已到期' ?
                        <span className="tip-right">请前往<a onClick={ this.downApp }>新新贷APP</a>申请退出</span> :
                        ''
                      }</p>
                        <div className="detail dis-flex-row">
                            <div className="column">
                                <p>加入金额：<span className="amount">{this.changeMoney(rowData.investmentAmount)}元</span></p>
                                <p>加入时间：<span>{moment(Number(rowData.addDate)).format('YYYY-MM-DD')}</span></p>
                                <p>到期时间：<span>{moment(Number(rowData.endDate)).format('YYYY-MM-DD')}</span></p>
                            </div>
                            <div className="column">
                                <p>实际收益：<span className="income">{this.changeMoney(rowData.interest)}元</span></p>
                                <p>历史年化：<span>{this.splitNum(rowData.apr)}%</span></p>
                                <p className={ rowData.matching ? '' : 'hide' }>我的债权：<a className={ rowData.matching ? 'dmp-click' : 'doing' } dev_id={ 'A14.3-1.1-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.credit(rowData.matching, rowData.joinId) }>{ rowData.matching ? '点击查看' : '债权匹配中' }</a></p>
                            </div>
                        </div>
                    </li>
                )
            }else{
                return(
                    <li></li>
                )
            }
        };
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="加入记录" dmp={ true } dev_id="A14.1-1" eventtype="jump" url='/mypurse' />
                    <div className="history-container position-a">
                        <ul className="tab-wrapper">
                            <li onClick={ this.investType('1') } dev_id="A14.1-2" eventtype="to_active" className={ this.state.investType == '1' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A14.1-2" eventtype="to_active">当前持有</a></li>
                            <li onClick={ this.investType('2') } dev_id="A14.1-3" eventtype="to_active" className={ this.state.investType == '2' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' }><a className="dmp-click" dev_id="A14.1-3" eventtype="to_active">历史持有</a></li>
                        </ul>
                        <div className="filter-wrapper">
                            <p className="filter-value" onClick={ this.showSelect }>{ this.state.proName }</p>
                            <ul className={ this.state.showSelect ? 'block' : '' }>
                                <li id="0" onClick={ this.hideAndSect(0, '所有产品') }>所有产品</li>
                                {
                                    this.state.selectList.map((ii)=> {
                                        return (
                                            <li key={ ii.id } className="dmp-click" dev_id={"A14.1-4.1-" + JSON.stringify(ii)} eventtype="refresh" id={ ii.id } onClick={ this.hideAndSect(ii.id, ii.name) }>{ ii.name }</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <ul className="content-wrapper">
                            {
                                this.rData && this.rData.length == 0 ? 
                                <div className="text-center">
                                    <p>当前无加入记录</p>
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
                                    initialListSize={ this.rData &&  this.rData.length }
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
        )
    }
}

export default Investment