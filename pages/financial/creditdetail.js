import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Api from '../../components/api/financial'
import { Toast, Modal } from 'antd-mobile'
import userApi from '../../components/api/purse'
import loginApi from '../../components/api/home'
import { status } from '../../common/status'
import { getQueryString } from '../../common/Util'
import moment from 'moment'

const alert = Modal.alert
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
            company: false,
            isSource: false,
            isTrue: false,
            otherInfo: false,
            data: {
                totalCount: 0,
                productDetail: {}
            },
            costData: {
                accountCost: {}
            },
            personData: {},
            minXin: {
                data:{
                    bidInfo: {},
                    loanInfo: {}
                }
            }
        }
    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)

        const context = {
            id: getQueryString('id'), 
            type: '7',
        }
        const data = await Api.financialDetail(context)
        const costData = await Api.getCost()
        const personData = await userApi.bidPersonDetail({bidCode: getQueryString('id')})

        await this.setState({
            data,
            costData,
            personData
        })

        this.canvasInit()
        const { userTypeCode } = personData
        if(userTypeCode == '1'){
            await this.setState({
                company: false
            })
        }else{
            await this.setState({
                company: true
            })
        }
        let sessionParam = {
            borrowId: data.productDetail.productId,
            source: '2',
            uid: '',
            sign: ''
        }
        const isLogin = await loginApi.isLogin()
        if(isLogin){
            const minXin = await Api.getLoanInfo({bidCode: data.productDetail.productId})
            console.log(minXin.data)
            const res = await userApi.userInfo()
            const sign = await Api.getSign({userId: res.userId})
            sessionParam = {
                borrowId: data.productDetail.productId,
                source: '4',
                uid: res.userId,
                sign: sign.resp,
            }
            //  判断征信信息以及其他相关信息
            const { bidInfo, loanInfo, loanStatus  } = minXin.data

            if(bidInfo.source == 4){
                //  如果是蜂融的标的
                this.setState({
                    isSource: true
                })
            }else{
                const { overdueLoanNum, overdueLoanMonth, overdueLoanAccount, overdueLoanCardMonth } = loanInfo
                if(loanStatus == 0 || overdueLoanNum == '' && overdueLoanMonth == '' && overdueLoanAccount == '' && overdueLoanCardMonth == ''){
                    this.setState({
                        isTrue: true
                    })
                }
            }
            const { productDetail }  = data
            if(productDetail.borrowStatus == '4'){
                if(loanInfo.updateTime){
                    this.setState({
                        otherInfo: true
                    })
                }else{
                    this.setState({
                        otherInfo: false
                    })
                }
            }else{
                this.setState({
                    otherInfo: false
                })
            }
            this.setState({
                isLogin: true,
                minXin
            })
        }else{
            this.setState({
                isLogin: false
            })
        }
        sessionStorage.setItem('contract', JSON.stringify(sessionParam))
        Toast.hide()
    }
    canvasInit = () => {
        var canvas = document.getElementById('canvas'),  //获取canvas元素
            context = canvas.getContext('2d'),  //获取画图环境，指明为2d
            centerX = canvas.width / 2,   //Canvas中心点x轴坐标
            centerY = canvas.height / 2,  //Canvas中心点y轴坐标
            rad = Math.PI * 2 / 100; //将360度分成100份，那么每一份就是rad度
        //绘制外圈
        function purpleCircle(n) {
            context.save();
            context.lineCap = 'round';
            var g = context.createLinearGradient(canvas.width / 2, canvas.height, 10, canvas.width / 2, 0, 10);   //创建渐变对象  渐变开始点和渐变结束点
            g.addColorStop(0, '#923af5'); //添加颜色点
            g.addColorStop(0.5, '#753bf1'); //添加颜色点
            g.addColorStop(1, '#5b3dee'); //添加颜色点
            context.strokeStyle = g; //设置描边样式
            context.lineWidth = 6; //设置线宽
            context.beginPath(); //路径开始
            context.arc(centerX, centerY, 36, -Math.PI / 2, -Math.PI / 2 - n * rad, true);
            context.stroke(); //绘制
            context.closePath(); //路径结束
            context.restore();
        }

        //绘制内圈
        function whiteCircle() {
            context.save();
            context.strokeStyle = "#f5f5f5"; //设置描边样式
            context.lineWidth = 6; //设置线宽
            context.beginPath();
            context.arc(centerX, centerY, 36, 0, Math.PI * 2, true);
            context.stroke();
            context.closePath();
            context.restore();
        }

        function getCanvasPos(n) {//获取结束点canvas上的坐标
            var hudu = Math.PI / 2 + n * rad;
            // console.log(centerX);
            // console.log(centerY);
            return {
                x: centerX + Math.cos(hudu)*36,
                y: centerY - Math.sin(hudu)*36
            };
        }

        function endCircle(n) {
            var c = getCanvasPos(n);
            // console.log(c.x);
            // console.log(c.y);
            // 同一个圆心，不同大小
            context.save();
            context.fillStyle = "#d6c4fd"; //设置描边样式
            context.beginPath(); //路径开始
            context.arc(c.x, c.y, 10, 0, Math.PI * 2, true);
            context.fill(); //绘制
            context.closePath(); //路径结束
            context.restore();

            context.save();
            context.fillStyle = "#ad6bf8"; //设置描边样式
            context.beginPath(); //路径开始
            context.arc(c.x, c.y, 6, 0, Math.PI * 2, true);
            context.fill(); //绘制
            context.closePath(); //路径结束
            context.restore();

            context.save();
            context.fillStyle = "#f2e7fe"; //设置描边样式
            context.beginPath(); //路径开始
            context.arc(c.x, c.y, 3, 0, Math.PI * 2, true);
            context.fill(); //绘制
            context.closePath(); //路径结束
            context.restore();
        }
        whiteCircle();
        /*传入百分比值*/

        const { productDetail }  = this.state.data

        const perciel = (productDetail.plannedAmount - productDetail.leftAmount) / productDetail.plannedAmount * 100

        purpleCircle(perciel);
        endCircle(perciel);
    }
    goLogin = () => {
        // sessionStorage.setItem('loginType', location.href)
        location = '/login'
    }
    transMoney = (val) => {
        var changeMoney = 0
        if(val > 9999){
            var ractMoney = (val/1e4)
            ractMoney = ractMoney + ''
            if(ractMoney.indexOf('.') != -1){
                if(ractMoney.split(".")[1].length == 1){
                    ractMoney = ractMoney + 0.00 + '万'
                }else{
                    ractMoney = ractMoney.substr(0, ractMoney.indexOf('.') + 3) + '万'
                }
            }else{
                ractMoney = Number(ractMoney).toFixed(2) + '万'
            }
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
        }else{
            val = val + ''
            if(val.indexOf('.') != -1){
                if(val.split(".")[1].length == 1){
                    //51000
                    changeMoney = val + 0.00 + '元'
                }else{
                    //53550.21
                    changeMoney = val.substr(0, val.indexOf('.') + 3) + '元'
                }
            }else{
                //50000
                changeMoney = Number(val).toFixed(2) + '元'
            }
        }
    
        return changeMoney
      }
    changeMoney = (val) => {
        var changeMoney = 0
        const ractMoney = val && val.indexOf('.') != -1 ? val : !val ? '0.00' : val + '.00'
        changeMoney = ractMoney.split('.');
        changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
        changeMoney = changeMoney.join('.');
        return changeMoney
    }
    questionTip = tip => () => {
        let tipMsg = ''
        if(tip == '等额本息'){
            tipMsg = '每月应还本息=[借款金额×年化收益÷12×（1+年化收益÷12）^借款期限]÷[（1+年化收益÷12）^借款期限－1] 。应还总利息为每月应还利息总合。应还本金为借款金额。'
        }else if(tip == '按月付息，到期通过债权转让退出'){
            tipMsg = '每月应还利息=借款金额×年化收益÷12。应还总利息=借款金额×年化收益÷12×借款期限。应还本金为借款金额。'
        }else if(tip == '按季付息，到期通过债权转让退出'){
            tipMsg = '每季应还利息=借款金额×年化收益÷4。应还总利息=借款金额×年化收益÷12×(借款期限÷3)。应还本金为借款金额。'
        }else if(tip == '一次性付息还本'){
            tipMsg = '应还总利息=借款金额×年化收益÷12×借款期限。应还本金为借款金额。'
        }else if(tip == '一次性付息，到期通过债权转让退出'){
            tipMsg = '应还总利息=借款金额×年化收益÷12×借款期限。应还本金为借款金额。'
        }else if(tip == '还本付息'){
            tipMsg = '应还总利息=借款金额×年化收益÷12×借款期限。应还本金为借款金额。'
        }else{
            tipMsg = '无法识别付款方式'
        }
        alert('提示', tipMsg, [
            { text: '确定', onPress: () => {
                console.log('close')
            }},
        ])
    }
    contract = row => () => {
        if(getQueryString('type') != '13'){
            location = '/financial/contract?id=' + row.productId 
        }
    } 
    render() {
        const {  totalCount, productDetail }  = this.state.data
        const personData = this.state.personData
        const { accountCost } = this.state.costData
        const { bidInfo, loanInfo  } = this.state.minXin.data
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="product-box position-a">
                    <Header title="标的详情" dmp={ true } dev_id="A14.6-2" eventtype="jump" />
                    <div className="detail-container position-a">
                            <ul className="intro-list">
                                <li>
                                    <p className="title"><span className="bold-line"></span>个人借款说明</p>
                                    <div className="content description">
                                        <div className="target-status">
                                            <div className="wrapper">
                                                <canvas id="canvas" width="100" height="100" ></canvas>
                                                <div className="percent">{ Math.floor((productDetail.plannedAmount - productDetail.leftAmount) / productDetail.plannedAmount * 100) || 0 }%</div>
                                            </div>
                                            <span className="status-tips">{ status(productDetail.borrowStatus) }</span>
                                        </div>
                                        <div className="product-detail dis-flex-row">
                                            <div className="detail-li product-earnings">
                                                <p className="count">{productDetail.plannedAnnualRate ? productDetail.plannedAnnualRate + '%' : '0%'}{productDetail.floatingRate && productDetail.floatingRate > 0 ? '+' + productDetail.floatingRate + '%' : '' }</p>
                                                <p className="txt">历史年化收益</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="count">{productDetail.leastPeriod}{productDetail.leastPeriodUnit}</p>
                                                <p className="txt">出借期限</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="count">{productDetail.leastInvestAmount}元</p>
                                                <p className="txt">起投金额</p>
                                            </div>
                                        </div>
                                        <ul className="xxd-common-list">
                                            <li className="list-item">
                                                <span className="item-txt">起投金额</span>
                                                <span className="item-right-txt">{productDetail.leastInvestAmount}元</span>
                                            </li>
                                            <li className="list-item">
                                                <span className="item-txt">还款方式</span>
                                                <span className="item-right-txt">{productDetail.repaymentMethod}<i className="questiontip dmp-click" dev_id="A14.6-3" eventtype="jump" onClick={ this.questionTip(productDetail.repaymentMethod) }>?</i></span>
                                            </li>
                                            <li className="list-item">
                                                <span className="item-txt">预计计息日</span>
                                                <span className="item-right-txt">{productDetail.startCalInterestDate}</span>
                                            </li>
                                            <li className="list-item">
                                                <span className="item-txt">资金用途</span>
                                                <span className="item-right-txt">{ productDetail.use }</span>
                                            </li>
                                            {
                                                productDetail.riskGrade ? 
                                                <li className="list-item">
                                                <span className="item-txt">风险等级</span>
                                                <span className="item-right-txt">{ productDetail.riskGrade }</span>
                                            </li> : ''
                                            }
                                            {
                                                productDetail.endTime ? 
                                                <li className="list-item">
                                                <span className="item-txt">募集截止日期</span>
                                                <span className="item-right-txt">{ moment(Number(productDetail.endTime)).format('YYYY年MM月DD日') }</span>
                                            </li> : ''
                                            }
                                        </ul>
                                    </div>
                                </li>
                                <li className={ this.state.isLogin ? '' : "checkLogin" }>
                                    <p className="title"><span className="bold-line"></span>借款详情</p>
                                    
                                    <div className="noLogin">
                                        <div className="img_bg"></div>
                                        <p><a onClick={ () => location = "/login" }>登录 </a> 后可查看</p>
                                    </div>

                                    <div className={ this.state.isLogin && this.state.company ? 'hide' : '' }>
                                        <div className="content">
                                            <p className="content-tit">借款人信息</p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人主体：</span>
                                                <span className="item-value">自然人</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">发布者：</span>
                                                <span className="item-value">{ personData.mobilePhone || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人姓名：</span>
                                                <span className="item-value">{ personData.name || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">身份证号码：</span>
                                                <span className="item-value">{ personData.idNo || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">性别：</span>
                                                <span className="item-value">{ personData.gender || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">年龄：</span>
                                                <span className="item-value">{ bidInfo.age || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">所在地：</span>
                                                <span className="item-value">{ (personData.resideProvince || '') + (personData.resideCity || '') + (personData.resideAddress || '') }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">所属行业：</span>
                                                <span className="item-value">{ bidInfo.companyIndustry }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">工作性质：</span>
                                                <span className="item-value">{ bidInfo.occupation }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">收入情况：</span>
                                                <span className="item-value">{ loanInfo.income  || '未知' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">负债情况：</span>
                                                <span className="item-value">{ loanInfo.liabilities || '未知' }</span>
                                            </p>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">借款相关</p>
                                            <p className="list-item">
                                                <span className="item-txt">信用等级：</span>
                                                <span className="item-value">{ personData.creditRating }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">成功借款次数：</span>
                                                <span className="item-value">{ personData.borrowCount }次</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">逾期次数：</span>
                                                <span className="item-value">{ personData.overdue }次</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">逾期总金额：</span>
                                                <span className="item-value">{ this.changeMoney(personData.overdueAccount) || 0 }元</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">住房条件：</span>
                                                <span className="item-value">{ personData.resideType }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">是否购车：</span>
                                                <span className="item-value">{ personData.ownCar }</span>
                                            </p>
                                        </div>
                                        <div className={ this.state.isTrue ? 'hide' : 'content' }>
                                            <p className="content-tit">征信报告</p>
                                            <p className={ this.state.isSource ? '' : 'hide' }>借款人未授权获取</p>
                                            <div className={ this.state.isSource ? 'hide' : '' }>
                                                <p className="list-item">
                                                    <span className="item-txt">贷款逾期笔数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanNum }</span>
                                                </p>
                                                <p className="list-item">
                                                    <span className="item-txt">贷款最长逾期月数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanMonth }</span>
                                                </p>
                                                <p className="list-item">
                                                    <span className="item-txt">贷记卡逾期账户数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanAccount }</span>
                                                </p>
                                                <p className="list-item">
                                                    <span className="item-txt">贷记卡最长逾期月数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanCardMonth }</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">贷款记录</p>
                                            <p className="list-item">
                                                <span className="item-txt">累计借款：</span>
                                                <span className="item-value">{ this.changeMoney(personData.loanSum) || 0 }元</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">待还金额：</span>
                                                <span className="item-value">{ this.changeMoney(personData.repaymentSum) || 0 }元</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">正常还清：</span>
                                                <span className="item-value">{ personData.accountNomalPay }次</span>
                                            </p>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">借款描述</p>
                                            <p dangerouslySetInnerHTML={{__html: productDetail.description  }}></p>
                                        </div>
                                        <div className={ productDetail.plannedAmount <= 200000 ? 'content' : 'content hide' }>
                                            <p className="content-tit">在其他网络借贷平台借款情况</p>
                                            <p>
                                                该自然人承诺在本平台借款余额未超过人民币20万元，在不同网络借贷信息中介机构平台借款总余额未超过人民币100万元。
                                            </p>
                                        </div>
                                        <div className={ this.state.otherInfo ? 'content' : 'hide' }>
                                            <p className="content-tit">其他相关信息</p>
                                            <p className="list-item">
                                                <span className="item-txt">更新时间：</span>
                                                <span className="item-value">{ String(loanInfo.updateTime).substr(0, 10) }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">资金运用情况：</span>
                                                <span className="item-value">{ productDetail.use }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人还款能力变化：</span>
                                                <span className="item-value">{ loanInfo.repaymentCapacity }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人涉诉及受行政处罚情况：</span>
                                                <span className="item-value">{ loanInfo.punish }</span>
                                            </p>
                                        </div>
                                    </div>



                                    <div className={ this.state.isLogin && this.state.company ? '' : 'hide' }>
                                        <div className="content">
                                            <p className="content-tit">借款人信息</p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人主体：</span>
                                                <span className="item-value">法人</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">企业名称：</span>
                                                <span className="item-value">{personData.companyInfoCompanyName}</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">注册资本：</span>
                                                <span className="item-value">{ personData.companyInfoRegisterCapital }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">注册地址：</span>
                                                <span className="item-value">{personData.companyInfoRegisterAddress}</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">成立时间：</span>
                                                <span className="item-value">{personData.companyInfoRegistrationTime}</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">法定代表人：</span>
                                                <span className="item-value">{personData.companyInfoComRegPersonName}</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">所属行业：</span>
                                                <span className="item-value">{ bidInfo.companyIndustry }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">收入情况：</span>
                                                <span className="item-value">{ loanInfo.income  || '未知' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">负债情况：</span>
                                                <span className="item-value">{ loanInfo.liabilities || '未知' }</span>
                                            </p>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">借款描述</p>
                                            <p dangerouslySetInnerHTML={{__html: productDetail.description  }}></p>
                                        </div>
                                        <div className={ this.state.isTrue ? 'content hide' : 'content' }>
                                            <p className="content-tit">征信报告</p>
                                            <p className={ this.state.isSource ? '' : 'hide' }>借款人未授权获取</p>
                                            <div className={ this.state.isSource ? 'hide' : '' }>
                                                <p className="list-item">
                                                    <span className="item-txt">贷款逾期笔数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanNum }</span>
                                                </p>
                                                <p className="list-item">
                                                    <span className="item-txt">贷款最长逾期月数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanMonth }</span>
                                                </p>
                                                <p className="list-item">
                                                    <span className="item-txt">贷记卡逾期账户数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanAccount }</span>
                                                </p>
                                                <p className="list-item">
                                                    <span className="item-txt">贷记卡最长逾期月数：</span>
                                                    <span className="item-value">{ loanInfo.overdueLoanCardMonth }</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className={ productDetail.plannedAmount <= 1000000 ? 'content' : 'content hide' }>
                                            <p className="content-tit">在其他网络借贷平台借款情况</p>
                                            <p>
                                                该法人或其他组织承诺在本平台借款余额未超过人民币100万，在不通网络借贷信息中介机构平台借款总余额未超过人民币500万元。
                                            </p>
                                        </div>
                                        
                                        <div className={ this.state.otherInfo ? 'content' : 'content hide' }>
                                            <p className="content-tit">其他相关信息</p>
                                            <p className="list-item">
                                                <span className="item-txt">更新时间：</span>
                                                <span className="item-value">{ String(loanInfo.updateTime).substr(0, 10) }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">资金运用情况：</span>
                                                <span className="item-value">{ productDetail.use }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人逾期情况：</span>
                                                <span className="item-value">{ loanInfo.overdueLoanInfo }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人还款能力变化：</span>
                                                <span className="item-value">{ loanInfo.repaymentCapacity }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人经营状况及财务状况：</span>
                                                <span className="item-value">{ loanInfo.operationStatus }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人涉诉及受行政处罚情况：</span>
                                                <span className="item-value">{ loanInfo.punish }</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <p className="title"><span className="bold-line"></span>资费说明</p>
                                    <div className="content">
                                        <p className="list-item">
                                            <span className="item-txt">充值费：</span>
                                            <span className="item-value">{ this.changeMoney(String(accountCost.rechargeFee)) || 0 }元</span>
                                        </p>
                                        <p className="list-item">
                                            <span className="item-txt">提现费：</span>
                                            <span className="item-value">0.00元</span>
                                        </p>
                                        <p className="list-item">
                                            <span className="item-txt">收益管理费：</span>
                                            <span className="item-value">应收利息的{ accountCost.revenueManagementFee * 100 }%</span>
                                        </p>
                                        <p className="list-item">
                                            <span className="item-txt">债权转让手续费：</span>
                                            <span className="item-value">转让手续费为本金的{ accountCost.tradeRequestFee * 100 }%；已绑定专属财富顾问的用户可享受优惠待遇，手续费可降至为本金的{ accountCost.tradeRequestVipFee * 100 }%，最低为人民币{ accountCost.tradeRequestMinFee }元</span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <ul className="main-list xxd-common-list">
                                <li className="list-item dmp-click" dev_id="A14.6-4" eventtype="jump" onClick={ this.contract(productDetail) }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-4" eventtype="jump">合同范本</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-4" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-5" eventtype="jump" onClick={ () => location = '/mypurse/investmenthistory/payment?borrowId=' + productDetail.productId + '&type=' + productDetail.productType }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-5" eventtype="jump">还款记录</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-5" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-6" eventtype="jump" onClick={ ()=> location = '/financial/joinrecord?id=' + productDetail.productId + '&type=' + productDetail.productType  }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-6" eventtype="jump">投标记录</span>
                                    <span className="item-right-txt dmp-click" dev_id="A14.6-6" eventtype="jump">{ totalCount }人</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-6" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-7" eventtype="jump" onClick={ () => location = '/modal/saferepayment?productId=' + productDetail.productId + '&productCode=' + productDetail.productType + '&clientTime=' + (new Date()).getTime() }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-7" eventtype="jump">安全保障</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-7" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-8" eventtype="jump" onClick={ () => location = '/modal/risk' }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-8" eventtype="jump">项目风险提示</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-8" eventtype="jump"></span>
                                </li>
                            </ul>
                        </div>
                </div>
            </div>
        )
    }
}