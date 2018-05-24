import React, { Component } from "react";
import Head from "next/head";
import Api from "../../../components/api/purse";
import { getQueryString } from "../../../common/Util";

export default class extends Component {
  static async getInitialProps(ctx) {
    return {
      status: ctx.req.query.status
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      status: this.props.status || "",
      msg: ""
    };
  }
  async componentDidMount() {
    const data = await Api.userInfo();
    this.setState({
      status: getQueryString("status"),
      msg: getQueryString("errorMsg") || "",
      data
    });
  }
  chiooceRoad = () => {
    const { data, status } = this.state;
    if (status == 0) {
      location = "/mypurse/openaccount";
    } else if (status == 1) {
      if (data.riskExamStatus == 1) {
        location = "/financial";
      } else {
        location = "/mypurse/riskrating";
      }
    }
  };
  render() {
    const { data, status } = this.state;
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/mods/mypurse/openaccount/_.css"
          />
        </Head>
        <div className="open-account-box openaccount-result-container">
          <div
            className={
              status == 0
                ? "openaccount-result-top fail-bg"
                : "openaccount-result-top success-bg"
            }
          >
            <div className="manage-organization">
              <p>资金存管机构</p>
              <p>华瑞银行股份有限公司（简称：华瑞银行）</p>
            </div>
            <div className="circle-box">
              <span className="result-txt">
                {status == 0 ? "开户失败" : "开户成功"}
              </span>
            </div>
            <div className="wave-bg" />
          </div>
          <p
            className={
              status == 0
                ? "openaccount-result-txt fail-txt"
                : "openaccount-result-txt success-txt"
            }
          >
            {status == 0 ? "存管账户开通失败!" : "存管账户开通成功!"}
          </p>

          <div className={status == 0 ? "fail-tips block" : "fail-tips"}>
            {this.state.msg}
          </div>

          <div
            className={
              status == 0
                ? "div-btn fail-btn block"
                : "div-btn success-btn block"
            }
          >
            <button
              onClick={this.chiooceRoad}
              className="xxd-xl-btn dmp-click"
              dev_id={
                status == 0
                  ? "D2.2-1"
                  : data && data.riskExamStatus == 1 ? "D2.1-9" : "D2.1-8"
              }
              eventtype="jump"
            >
              {status == 0
                ? "重新开户"
                : data && data.riskExamStatus == 1 ? "立即出借" : "立即评测"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
