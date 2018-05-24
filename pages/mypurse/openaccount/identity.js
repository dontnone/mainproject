import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import { getQueryString, onFocus, onBlur } from '../../../common/Util'
import { ImagePicker, Toast } from 'antd-mobile'
import Api from '../../../components/api/purse'


export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            idCard: '',
            positiveFiles: [],
            negativeFiles: []
        }
    }
    componentDidMount() {
        this.setState({
            userName: getQueryString('userName'),
            idCard: getQueryString('userId')
        })
    }
    change = key => (e) => {
        const reg = /^[a-zA-Z0-9]+$/g
        if(key == 'userName' && e.target.value.length > 20){
            return
        }
        if(key == 'idCard' && !reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        this.setState({
            [key]: e.target.value
        })
    }
    onChange = key => (files, type, index) => {
        if(key == 'positive'){
            if(type == 'add'){
                this.positiveFile = files[0].file
            }else{
                this.positiveFile = ''
            }
            
            this.setState({
                positiveFiles: files
            })
        }
        if(key == 'negative'){
            if(type == 'add'){
                this.negativeFile = files[0].file
            }else{
                this.negativeFile = ''
            }
            
            this.setState({
                negativeFiles: files
            })
        }
    }
    examine = async () => {
        const regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        if(!regIdNo.test(this.state.idCard)){
            Toast.info('请输入正确的身份证号', 2)
            return
        }
        const context = {
            realName: this.state.userName,
            idCardNumber: this.state.idCard,
            cardType: 1,
            positivePic: this.positiveFile,
            negativePic: this.negativeFile
        }
        
        const res = await Api.userExamine(context)
        if(res.code == '0'){
            Toast.info(res.message, 2)
            setTimeout(()=> {
                location = '/mypurse/openaccount/identityresult'
            }, 2000)
        }else{
            Toast.info(res.message, 2)
        }
    }
    render() {
        const { positiveFiles, negativeFiles } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/openaccount/_.css" />
                </Head>
                <div className="identity-review-box ">
                    <Header title="银行存管开户" />
                    <div className="open-account-container identity-review-container">
                        <div className="open-account-main">
                            <div className="div-input-wrapper">
                                <div className="input-left"><span>姓名</span></div>
                                <div className="input-border"><input type="text" className="dmp-click" dev_id="D2.3-1" dmp_action="write" eventtype="any_value" value={ this.state.userName } onChange={ this.change('userName') } onFocus={ onFocus() } onBlur={ onBlur('请输入您身份证上的真实姓名') } placeholder="请输入您身份证上的真实姓名" /></div>
                            </div>
                            <div className="div-input-wrapper">
                                <div className="input-left"><span>身份证号</span></div>
                                <div className="input-border"><input type="text" className="dmp-click" dev_id="D2.3-2" dmp_action="write" eventtype="any_value" value={ this.state.idCard } onChange={ this.change('idCard') } onFocus={ onFocus() } onBlur={ onBlur('请输入您的身份证号') } placeholder="请输入您的身份证号" /></div>
                            </div>
                        </div>
                        <div className="upload-information-wrapper">
                            <p className="upload-tit">上传身份证资料</p>
                            <div className="upload-information">
                                <div className="upload-item fl">
                                    <div className="identity-card">
                                    <ImagePicker
                                        files={positiveFiles}
                                        onChange={this.onChange('positive')}
                                        className="dmp-click"
                                        dev_id="D2.3-3"
                                        eventtype="any_value"
                                        onImageClick={(index, fs) => console.log(index, fs)}
                                        selectable={positiveFiles.length < 1}
                                    />
                                    </div>
                                    <span>{ positiveFiles.length == 0 ? '上传本人手持身份证照片正面' : '照片已上传' }</span>
                                </div>
                                <div className="upload-item pr">
                                    <div className="identity-card">
                                        <ImagePicker
                                            files={negativeFiles}
                                            className="dmp-click"
                                            dev_id="D2.3-4"
                                            eventtype="any_value"
                                            onChange={this.onChange('negative')}
                                            onImageClick={(index, fs) => console.log(index, fs)}
                                            selectable={negativeFiles.length < 1}
                                        />
                                    </div>
                                    <span>{ negativeFiles.length == 0 ? '上传本人手持身份证照片反面' : '照片已上传' }</span>
                                </div>
                            </div>
                            <div className="upload-information-tips">
                                    您的身份证信息认证失败，请确认后重新输入并上传手持身份证正反面照片，提交审核后及时与客服<a href="tel:4000169521" className="dmp-click" dev_id="D2.3-5" eventtype="jump">4000 169 521</a>联系将加快您的审核进度。
                            </div>
                        </div>
                        <div className="div-btn"><button className="xxd-xl-btn dmp-click" dev_id="D2.3-6" eventtype="jump" onClick={ this.examine } disabled={ this.state.idCard != '' && this.state.userName != '' && this.state.positiveFiles.length != 0 && this.state.negativeFiles.length != 0 ? false : true }>提交审核</button></div>
                    </div>
                </div>
            </div>
        )
    }
}