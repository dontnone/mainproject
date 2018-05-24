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
            bidInfo: {
                loanPurpose: {},
                status: {}
            },
            borrowerInfo: {},
            infoDisclosures: {},
            loansInfo: {},
            isLogin: false,
            isTrue: false,
            otherInfo: false,
            joinNum: 0,
            ages: 0
        }
    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)

        const data = await Api.investmentXyd({borrowId: getQueryString('id')})

        const isLogin = await loginApi.isLogin()

        const joinNum = await Api.xydRecord({bidCode: data.bidInfo.bidCode, page: 1})

        if(isLogin){
            this.setState({
                isLogin: true
            })
        }

        this.setState({
            joinNum: joinNum.totalCount,
            bidInfo: data.bidInfo,
            borrowerInfo: data.borrowerInfo,
            infoDisclosures: data.infoDisclosures,
            loansInfo: data.loansInfo
        })

        if(data.infoDisclosures && data.infoDisclosures.pbocInfoList && data.infoDisclosures.pbocInfoList.length != 0){
            this.setState({
                isTrue: true
            })
        }

        if(data.infoDisclosures && data.infoDisclosures.updateDate && data.bidInfo.status.message == '还款中'){
            this.setState({
                otherInfo: true
            })
        }

        this.jsGetAge()
        console.log(data)

        this.canvasInit()

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

        const { bidInfo }  = this.state

        const perciel = (bidInfo.bidAmount - bidInfo.leftTenderAmount) / bidInfo.bidAmount * 100

        purpleCircle(perciel);
        endCircle(perciel);
    }
    goLogin = () => {
        // sessionStorage.setItem('loginType', location.href)
        location = '/login'
    }
    jsGetAge = () => {  
        const { borrowerInfo } = this.state
        var returnAge = '';
        var strBirthday = borrowerInfo.birth;  
        var strBirthdayArr=strBirthday.split("-");  
        var birthYear = strBirthdayArr[0];  
        var birthMonth = strBirthdayArr[1];  
        var birthDay = strBirthdayArr[2];  
        var d = new Date();  
        var nowYear = d.getFullYear();  
        var nowMonth = d.getMonth() + 1;  
        var nowDay = d.getDate();  
        if(nowYear == birthYear){  
            returnAge = 0;//同年 则为0岁  
        } else {  
            var ageDiff = nowYear - birthYear ; //年之差  
            if(ageDiff > 0) {  
                if(nowMonth == birthMonth) {  
                    var dayDiff = nowDay - birthDay;//日之差  
                    if(dayDiff < 0) {  
                        returnAge = ageDiff - 1;  
                    }  else{  
                        returnAge = ageDiff ;  
                    }  
                } else {  
                    var monthDiff = nowMonth - birthMonth;//月之差  
                    if(monthDiff < 0){  
                        returnAge = ageDiff - 1;  
                    } else{  
                        returnAge = ageDiff ;  
                    }  
                }  
            } else{  
                returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
            }  
        } 
        this.setState({
            ages: returnAge
        })
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
    render() {
        const {  bidInfo, borrowerInfo, infoDisclosures, loansInfo }  = this.state
        const incomes = infoDisclosures && infoDisclosures.income
        let income = '', liabilities = ''
        if(incomes == 0 || incomes <= 10000){
            income = '10000以下'
        }else if(incomes > 10000 && incomes <= 20000){
            income = '10001-20000'
        }else if(incomes > 20000 && incomes <= 30000){
            income = '20001-30000'
        }else if(incomes > 30000){
            income = '30000以上'
        }
        //  负债
        if(incomes == 0 || incomes <= 8000){
            liabilities = '8000以下'
        }else if(incomes > 8000 && incomes <= 16000){
            liabilities = '8001-16000'
        }else if(incomes > 16000 && incomes <= 25000){
            liabilities = '16001-25000'
        }else if(incomes > 25000){
            liabilities = '25000以上'
        }

        let xz = '', xw = '', xf = '', xj = '', xt = '', gz = '', gw = '', gf = '', gj = '', gt = '', qz = '', qw = '', qf = '', qj = '', qt = ''
        if(infoDisclosures && infoDisclosures.pbocInfoList && infoDisclosures.pbocInfoList.length != 0){
            const pbocInfoList = infoDisclosures.pbocInfoList
            for(let i = 0; i < pbocInfoList.length; i++){
                if(pbocInfoList[i].creditType == '1'){
                    xz = pbocInfoList[i].accountNum
                    xw = pbocInfoList[i].osAccountNum
                    xf = pbocInfoList[i].overdueAccountNum
                    xj = pbocInfoList[i].overdue90AccountNum
                    xt = pbocInfoList[i].guaranteeNum
                }
                if(pbocInfoList[i].creditType == '2'){
                    gz = pbocInfoList[i].accountNum
                    gw = pbocInfoList[i].osAccountNum
                    gf = pbocInfoList[i].overdueAccountNum
                    gj = pbocInfoList[i].overdue90AccountNum
                    gt = pbocInfoList[i].guaranteeNum
                }
                if(pbocInfoList[i].creditType == '3'){
                    qz = pbocInfoList[i].accountNum
                    qw = pbocInfoList[i].osAccountNum
                    qf = pbocInfoList[i].overdueAccountNum
                    qj = pbocInfoList[i].overdue90AccountNum
                    qt = pbocInfoList[i].guaranteeNum
                }
            }
        }

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
                                                <div className="percent">{ Math.floor((bidInfo.bidAmount - bidInfo.leftTenderAmount) / bidInfo.bidAmount * 100) || 0 }%</div>
                                            </div>
                                            <span className="status-tips">{ bidInfo.status.message }</span>
                                        </div>
                                        <div className="product-detail dis-flex-row">
                                            <div className="detail-li product-earnings">
                                                <p className="count">{bidInfo.plannedAnnualRate ? bidInfo.plannedAnnualRate + '%' : '0%'}</p>
                                                <p className="txt">历史年化收益</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="count">{bidInfo.leastPeriodValue}{bidInfo.leastPeriodType == 'MONTH' ? '个月' : bidInfo.leastPeriodType == 'DAY' ? '天' : bidInfo.leastPeriodType == 'YEAR' ? '年' : '' }</p>
                                                <p className="txt">出借期限</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="count">{bidInfo.tenderAmountDown}元</p>
                                                <p className="txt">起投金额</p>
                                            </div>
                                        </div>
                                        <ul className="xxd-common-list">
                                            <li className="list-item">
                                                <span className="item-txt">起投金额</span>
                                                <span className="item-right-txt">{bidInfo.tenderAmountDown}元</span>
                                            </li>
                                            <li className="list-item">
                                                <span className="item-txt">还款方式</span>
                                                <span className="item-right-txt">{bidInfo.instalmentPlanName}<i className="questiontip dmp-click" dev_id="A14.6-3" eventtype="jump" onClick={ this.questionTip(bidInfo.instalmentPlanName) }>?</i></span>
                                            </li>
                                            <li className="list-item">
                                                <span className="item-txt">预计计息日</span>
                                                <span className="item-right-txt">{bidInfo.plannedValueDate}</span>
                                            </li>
                                            <li className="list-item">
                                                <span className="item-txt">资金用途</span>
                                                <span className="item-right-txt">{ bidInfo.loanPurpose.message }</span>
                                            </li>
                                            {
                                                bidInfo.riskGrade ? 
                                                <li className="list-item">
                                                    <span className="item-txt">风险等级</span>
                                                    <span className="item-right-txt">{ bidInfo.riskGrade }</span>
                                                </li> : ''
                                            }
                                            {
                                                bidInfo.endTime ?  
                                                <li className="list-item">
                                                    <span className="item-txt">募集截止日期</span>
                                                    <span className="item-right-txt">{ moment(Number(bidInfo.endTime)).format('YYYY年MM月DD日') }</span>
                                                </li> : ''
                                            }
                                        </ul>
                                    </div>
                                </li>
                                <li className={  this.state.isLogin ? '' : "checkLogin"  }>
                                    <p className="title"><span className="bold-line"></span>借款详情</p>
                                    <div className="noLogin">
                                        <div className="img_bg"></div>
                                        <p><a onClick={ () => location = "/login" }>登录 </a> 后可查看</p>
                                    </div>
                                    <div>
                                        <div className="content">
                                            <p className="content-tit">借款人信息</p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人主体：</span>
                                                <span className="item-value">自然人</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人姓名：</span>
                                                <span className="item-value">{ borrowerInfo.realname }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">身份证号码：</span>
                                                <span className="item-value">{ borrowerInfo.idCardNo }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">性别：</span>
                                                <span className="item-value">{ borrowerInfo.gender }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">出生年月：</span>
                                                <span className="item-value">{ borrowerInfo.birth }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">所在地：</span>
                                                <span className="item-value">{ borrowerInfo.location }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">所属行业：</span>
                                                <span className="item-value">{ infoDisclosures.industry || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">工作性质：</span>
                                                <span className="item-value">{ infoDisclosures.workType || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">收入情况：</span>
                                                <span className="item-value">{ income || '' }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">负债情况：</span>
                                                <span className="item-value">{ liabilities || '' }</span>
                                            </p>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">借款相关</p>
                                            <p className="list-item">
                                                <span className="item-txt">成功借款次数：</span>
                                                <span className="item-value">{ borrowerInfo.successLoanNum }次</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">逾期次数：</span>
                                                <span className="item-value">{ borrowerInfo.overdueCount }次</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">逾期总金额：</span>
                                                <span className="item-value">{ borrowerInfo.overdueSumAmount }元</span>
                                            </p>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">贷款记录</p>
                                            <p className="list-item">
                                                <span className="item-txt">累计借款：</span>
                                                <span className="item-value">{ loansInfo.sumAmount }元</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">待还金额：</span>
                                                <span className="item-value">{ loansInfo.dueRepaymentAmount }元</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">正常还清：</span>
                                                <span className="item-value">{ loansInfo.normalLoan }次</span>
                                            </p>
                                        </div>
                                        <div className="content">
                                            <p className="content-tit">借款描述</p>
                                            <p>{ borrowerInfo.bidInfo }</p>
                                        </div>
                                        <div className={ this.state.isTrue ? 'content' : 'hide' }>
                                            <p className="content-tit">征信报告</p>
                                            <div>
                                            <table width="100%" cellPadding='0' cellSpacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td rowSpan="4" width="40%">账户数</td>
                                                    </tr>
                                                    <tr>
                                                        <td>信用卡</td>
                                                        <td>{ xz }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>购房贷款</td>
                                                        <td>{ gz}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>其他贷款</td>
                                                        <td width="20%">{ qz }</td>
                                                    </tr>
                                                    <tr>
                                                        <td rowSpan="4" width="40%">未清算/未销户账户数</td>
                                                    </tr>
                                                    <tr>
                                                        <td>信用卡</td>
                                                        <td>{ xw }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>购房贷款</td>
                                                        <td>{ gw }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>其他贷款</td>
                                                        <td width="20%">{ qw }</td>
                                                    </tr>
                                                    <tr>
                                                        <td rowSpan="4" width="40%">发生逾期的账户数</td>
                                                    </tr>
                                                    <tr>
                                                        <td>信用卡</td>
                                                        <td>{ xf }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>购房贷款</td>
                                                        <td>{ gf }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>其他贷款</td>
                                                        <td width="20%">{ qf }</td>
                                                    </tr>
                                                    <tr>
                                                        <td rowSpan="4" width="40%">发生过90天以上逾期的账户数</td>
                                                    </tr>
                                                    <tr>
                                                        <td>信用卡</td>
                                                        <td>{ xj }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>购房贷款</td>
                                                        <td>{ gj }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>其他贷款</td>
                                                        <td width="20%">{ qj }</td>
                                                    </tr>
                                                    <tr>
                                                        <td rowSpan="4" width="40%">为他人担保笔数</td>
                                                    </tr>
                                                    <tr>
                                                        <td>信用卡</td>
                                                        <td>{ xt }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>购房贷款</td>
                                                        <td>{ gt }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>其他贷款</td>
                                                        <td width="20%">{ qt }</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                        <div className={ bidInfo.bidAmount <= 200000 ? 'content' : 'content hide' }>
                                            <p className="content-tit">在其他网络借贷平台借款情况</p>
                                            <p>
                                                该自然人承诺在本平台借款余额未超过人民币20万元，在不同网络借贷信息中介机构平台借款总余额未超过人民币100万元。
                                            </p>
                                        </div>
                                        <div className={ this.state.otherInfo ? 'content' : 'hide' }>
                                            <p className="content-tit">其他相关信息</p>
                                            <p className="list-item">
                                                <span className="item-txt">更新时间：</span>
                                                <span className="item-value">{ moment(Number(infoDisclosures.updateDate)).format('YYYY-MM-DD') }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">资金运用情况：</span>
                                                <span className="item-value">{ infoDisclosures.fundsUse }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人还款能力变化：</span>
                                                <span className="item-value">{ infoDisclosures.repaymentAbilityChange }</span>
                                            </p>
                                            <p className="list-item">
                                                <span className="item-txt">借款人涉诉及受行政处罚情况：</span>
                                                <span className="item-value">{ infoDisclosures.complaintsAdmPenalties }</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <p className="title"><span className="bold-line"></span>资费说明</p>
                                    <div className="content expense" dangerouslySetInnerHTML={{__html: bidInfo.expenseExplanation  }}>
                                    </div>
                                </li>
                            </ul>
                            <ul className="main-list xxd-common-list">
                                <li className="list-item dmp-click" dev_id="A14.6-4" eventtype="jump">
                                    <span className="item-txt dmp-click" dev_id="A14.6-4" eventtype="jump">合同范本</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-4" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-5" eventtype="jump" onClick={ () => location = '/financial/xydpayrecord?borrowId=' + bidInfo.bidCode }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-5" eventtype="jump">还款记录</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-5" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-6" eventtype="jump" onClick={ ()=> location = '/financial/xydrecord?id=' + bidInfo.bidCode }>
                                    <span className="item-txt dmp-click" dev_id="A14.6-6" eventtype="jump">投标记录</span>
                                    <span className="item-right-txt dmp-click" dev_id="A14.6-6" eventtype="jump">{ this.state.joinNum }人</span>
                                    <span className="arrow-right-icon dmp-click" dev_id="A14.6-6" eventtype="jump"></span>
                                </li>
                                <li className="list-item dmp-click" dev_id="A14.6-7" eventtype="jump" onClick={ () => location = '/modal/saferepayment?productId=xyd' }>
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