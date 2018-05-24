import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/redpacket'
import { PullToRefresh, ListView, Button, Toast, Icon } from 'antd-mobile'
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
            redType: '1',
            typeCode: 1,
            selectHide: true,
            navHide: false,                 //  判断是否需要全部隐藏nav
            selectUse: false,               //  判断如果新手红包为空，则select不显示
            newRed: true,                   //  新手红包是否展示
            redPack: false,                  //  红包是否展示
            coupon: false,                  //  加息券是否展示
        }
    }
    async componentDidMount() {
        // const res = await Api.redpacketList({status: 0, page: 1})
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 165) + 'px'
        })

        //  请求红包个数
        const num = await Api.redpacketNum()
        let res = null
        this.rData = []
        if(num.beginnerRedEnvelopeCount != '0' || num.rateCouponCount != '0' || num.redEnvelopCount != '0'){
            //  新手红包个数不为0
            if(num.beginnerRedEnvelopeCount != '0'){
                res = await Api.newRedpacketList({ page: 1})
                this.rData = res.items
                this.setState({
                    selectUse: false,
                    redType: '1',
                    newRed: true
                })
            }else{
                this.setState({
                    selectUse: true,
                    newRed: false
                })
            }
            //  红包个数不为0
            if(num.redEnvelopCount != '0'){
                if(num.beginnerRedEnvelopeCount == '0'){
                    res = await Api.redpacketList({
                        type: 2,
                        status: 1,
                        page: 1
                    })
                    this.rData = res.items
                    this.setState({
                        redType: '2',
                    })
                }
                this.setState({
                    redPack: true
                })
            }else{
                this.setState({
                    redPack: false
                })
            }

            //  加息券个数不为0
            if(num.rateCouponCount != '0'){
                if(num.beginnerRedEnvelopeCount == '0' && num.redEnvelopCount == '0'){
                    res = await Api.redpacketList({
                        type: 3,
                        status: 1,
                        page: 1
                    })
                    this.rData = res.items
                    this.setState({
                        redType: '3',
                    })
                }
                this.setState({
                    coupon: true
                })
            }else{
                this.setState({
                    coupon: false
                })
            }

            this.setState({
                navHide: false
            })
        }else{
            this.setState({
                navHide: true
            })
        }

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
        let res = null
        console.log(type)
        if(type == '1'){
            res = await Api.newRedpacketList({page: 1})
        }else if(type == '2'){
            res = await Api.redpacketList({
                type: 2,
                status: this.state.typeCode,
                page: 1
            })
            console.log(res)
        }else if(type == '3'){
            res = await Api.redpacketList({
                type: 3,
                status: this.state.typeCode,
                page: 1
            })
        }
        if(type == '1'){
            if(res && res.items.length <= 20){
                this.setState({
                    hasMore: false
                })
            }
        }else{
            if(res && res.couponList.length <= 20){
                this.setState({
                    hasMore: false
                })
            }
        }
        return res
    }
    onRefresh = async () => {
        pageIndex = 1
        this.setState({ refreshing: true, isLoading: true });
        switch (this.state.redType){
            case '1':
                const res = await Api.newRedpacketList({page: 1})
                this.rData = res.items
                break;
            case '2':
                const res1 = await Api.redpacketList({type: 2, status: this.state.typeCode, page: 1})
                this.rData = res1.couponList
                break;
            case '3':
                const res2 = await Api.redpacketList({type: 3, status: this.state.typeCode, page: 1})
                this.rData = res2.couponList
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
                res = await Api.newRedpacketList({ page: ++pageIndex})
                break;
            case "2":
                res = await Api.redpacketList({type: 2, status: this.state.typeCode, page: ++pageIndex})
                break;
            case "3":
                res = await Api.redpacketList({type: 3, status: this.state.typeCode, page: ++pageIndex})
                break;
            default:
        }
        if(this.state.redType == '1'){
            if(res.totalCount == 0){
                this.setState({
                    hasMore: false
                })
                return
            }
            this.rData = this.rData.concat(res.items);
        }else{
            if(res.couponList.length == 0){
                this.setState({
                    hasMore: false
                })
                return
            }
            this.rData = this.rData.concat(res.couponList);
        }
        
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
            const resRed = await this.getServer('1', 1)
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
        await this.setState({typeCode: '1'})
        const res = await this.getServer(key, 1)
        if(key == '1'){
            if(res.totalCount == 0){
                this.rData = []
            }else{
                this.rData = res.items
            }
        }else{
            if(res.totalSize == 0){
                this.rData = []
            }else{
                this.rData = res.couponList
            }
        }
        

        if(key != '1'){
            this.setState({
                selectUse: true
            })
        }else{
            this.setState({
                selectUse: false
            })
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
            typeCode: 1,
            redType: key
        })
        if(this.refs.lv){
            this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop = 0
        }
    }
    changeType = (key) => async () => {
        await this.setState({
            typeCode: key,
            selectHide: true
        })
        this.onRefresh()
    }
    showHide = () => {
        this.setState({
            selectHide: !this.state.selectHide
        })
    }
    render() {
        const productType = [
            {'type': 2, 'value': "步步高升"},
            {'type': 3, 'value': "七天大胜"},
            {'type': 4, 'value': "月进斗金"},
            {'type': 5, 'value': "新元宝"},
            {'type': 6, 'value': "月月派"},
            {'type': 7, 'value': "散标"},
            {'type': 8, 'value': "债权"}
        ];
        const separator = (sectionID, rowID) => (
            <div
              key={`${sectionID}-${rowID}`}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            return (
                <li className={rowData.status == '1' ? 'red-list-item' : rowData.status == '2' ? 'red-list-item used-list-wrapper' : 'red-list-item overdue-red-list-wrapper'} key = {rowID}>
                    <div className="dis-flex-row">
                        <div className="item-left red-detail">
                            <p className="red-name">{rowData.title}</p>
                            <p className="expiration-date">有效日期至：{moment(Number(rowData.validDate)).format('YYYY-MM-DD HH:mm:ss')}</p>
                            <p className="expiration-date">{ rowData.status == 0 ? <span className="redfont">(剩余{ parseInt((rowData.validDate - new Date().getTime())/(24 * 60 * 60 * 1000))}天过期)</span> : '' }</p>
                            <p className="expiration-date">使用平台：{rowData.platform.join('，')}</p>
                        </div>
                        <div className="item-right red-amount">
                            <p className="red-packet">{rowData.amount}元</p>
                            <p className="reduction-range">满{rowData.amountLimit}使用</p>
                        </div>
                    </div>
                    <p className="red-range">适用范围：{rowData.productRange}</p>
                    <div className={ rowData.status == '1' ? '' : rowData.status == '2' ? 'right-bg used-icon' : 'right-bg overdue-icon' }></div>
                </li>
            );
        };
        const rows = (rowData, sectionID, rowID) => {
            let productRange = []
            for(let i =0; i<productType.length; i++){
                for(let j=0; j<rowData.productScope.length; j++){
                    if(productType[i].type == rowData.productScope[j].productType){
                        if(rowData.productScope[j].productType == '5'){
                            productRange.push(productType[i].value + rowData.productScope[j].termsList.join('/') + '个月')
                        }else{
                            productRange.push(productType[i].value)
                        }
                        
                    }
                }
            }
            return (
                <li className={rowData.statusDescribe == '已使用' ? 'red-list-item used-list-wrapper' : rowData.statusDescribe == '已过期' ?  'red-list-item overdue-red-list-wrapper' : 'red-list-item' } key = {rowID}>
                    <div className="dis-flex-row">
                        <div className="item-left red-detail">
                            <p className="red-name">{rowData.name}{ this.state.redType == "2" ? '' : <span>（加息{rowData.numRaiseDays}天）</span> }</p>
                            <p className="expiration-date">有效日期至：{moment(Number(rowData.effectiveEndTime)).format('YYYY-MM-DD HH:mm:ss')}</p>
                            <p className="expiration-date">{ rowData.statusDescribe != '已使用' && rowData.statusDescribe != '已过期' ? <span className="redfont">({rowData.statusDescribe})</span> : '' }</p>
                            <p className="expiration-date">使用平台：{rowData.platform.join('，')}</p>
                        </div>
                        <div className="item-right red-amount">
                            <p className="red-packet">{rowData.amount}元</p>
                            <p className="reduction-range">{ this.state.redType == '2' ? <span>满 {rowData.quota} 元使用</span> : <span>投资{rowData.minInvest} - { rowData.maxInvest }可用</span> }</p>
                        </div>
                    </div>
                    <p className="red-range">适用范围：{  productRange.join('，') }</p>
                    <div className={ rowData.statusDescribe == '已使用' ? 'right-bg used-icon' : rowData.statusDescribe == '已过期' ? 'right-bg overdue-icon' : '' }></div>
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
                            <button className="xxd-xl-btn dmp-click" dev_id="A12.6-3" eventtype="jump" disabled={ this.state.redCode.length < 8 ? true : false } onClick={ this.bindRedpacket }>兑换</button>
                        </div>
                        <div className="main-tab">
                            <ul className={ this.state.navHide ? 'redpacket-wrapper hide' : 'redpacket-wrapper' }>
                                <li onClick={ this.changeTab('1') } dev_id="A12.6-4" eventtype="to_active" className={ this.state.newRed ? this.state.redType == '1'  ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' : 'hide' }><a className="dmp-click" dev_id="A12.6-4" eventtype="to_active">新手红包</a></li>
                                <li onClick={ this.changeTab('2') } dev_id="A12.6-5" eventtype="to_active" className={ this.state.redPack ? this.state.redType == '2' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' : 'hide' }><a className="dmp-click" dev_id="A12.6-5" eventtype="to_active">红包</a></li>
                                <li onClick={ this.changeTab('3') } dev_id="A12.6-6" eventtype="to_active" className={ this.state.coupon ?  this.state.redType == '3' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' : 'hide' }><a className="dmp-click" dev_id="A12.6-6" eventtype="to_active">加息券</a></li>
                                <li className={ this.state.selectUse ? 'tab-link tab-link-act' : 'tab-link tab-link-act hide' }>
                                    <div onClick={ this.showHide }>{ this.state.typeCode == 1 ? '可使用' : this.state.typeCode == 2 ? '已使用' : '已过期' }<Icon type="down" size="xxs" /></div>
                                    <div className={ this.state.selectHide ? 'redtype hide' : 'redtype' }>
                                        <ul>
                                            <li onClick={ this.changeType('1') }>可使用</li>
                                            <li onClick={ this.changeType('2') }>已使用</li>
                                            <li onClick={ this.changeType('3') }>已过期</li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content-wrapper">
                            <div className="tab-content block">
                                <ul className="red-list">
                                {
                                    this.rData && this.rData.length == 0 ? 
                                    <div className="text-center">
                                        <p>{ this.state.redType == '1' || this.state.redType == '2' ? '亲，您暂时还没有相关红包哦！' : '亲，您暂时还没有相关优惠券哦！' }</p>
                                    </div>
                                    :
                                    <ListView
                                        key={this.state.useBodyScroll ? '0' : '1'}
                                        ref="lv"
                                        dataSource={this.state.dataSource}
                                        renderFooter={() => (<div style={{ padding: '10px 0 30px', textAlign: 'center' }}>
                                        {this.state.hasMore ? '加载中...' : '已全部加载'}
                                        </div>)}
                                        renderRow={ this.state.redType == '1' ? row : rows}
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