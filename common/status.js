const status = (status) => {
    const config = [{
        code: '0',
        title: '暂存'
    },{
        code: '1',
        title: '审核中'
    },{
        code : '2',
        title: '招标中'
    },{
        code : '3',
        title: '满标复审'
    },{
        code : '4',
        title: '还款中'
    },{
        code: '5',
        title: '还款结束'
    },{
        code: '-1',
        title: '流标'
    },{
        code: '-2',
        title: '撤销'
    },{
        code: '-3',
        title: '审核失败'
    },{
        code: '-4',
        title: '签约失败'
    },{
        code: '203',
        title: '等待满标'
    },{
        code: '204',
        title: '流标'
    },{
        code: '205',
        title: '收益中'
    },{
        code: '206',
        title: '已完成'
    },{
        code: '207',
        title: '回款中'
    },{
        code: '208',
        title: '已结清'
    },{
        code: '209',
        title: '已转让'
    },{
        code: '210',
        title: '未还款'
    },{
        code: '211',
        title: '已还款'
    },{
        code: '212',
        title: '提前还款'
    },{
        code: '213',
        title: '持有中'
    },{
        code: '214',
        title: '已全部退出'
    },{
        code: '215',
        title: '开放期'
    },{
        code: '216',
        title: '已退出'
    },{
        code: '217',
        title: '已提前退出'
    },{
        code: '218',
        title: '已签约'
    },{
        code: '219',
        title: '待面签'
    },{
        code: '220',
        title: '签约失败'
    },{
        code: '221',
        title: '未垫付'
    },{
        code: '222',
        title: '已垫付'
    },{
        code: '223',
        title: '垫付后还款'
    },{
        code: '224',
        title: '未缴纳罚息或违约金'
    },{
        code: '225',
        title: '已缴纳罚息或违约金'
    },{
        code: '226',
        title: '无需缴纳罚息或违约金'
    },{
        code: '227',
        title: '该用户在新新贷有逾期借款，不可申请'
    },{
        code: '228',
        title: '债权为不可转让类型'
    },{
        code: '229',
        title: '债权可转让'
    },{
        code: '230',
        title: '债权当前不符合转让条件'
    },{
        code: '231',
        title: '债权转让中'
    },{
        code: '232',
        title: '投标中'
    },{
        code: '233',
        title: '还款中'
    },{
        code: '234',
        title: '还款结束'
    },{
        code: '235',
        title: '待发布'
    },{
        code: '236',
        title: '已发布'
    },{
        code: '237',
        title: '销售中'
    },{
        code: '238',
        title: '锁定'
    },{
        code: '239',
        title: '退出'
    },{
        code: '240',
        title: '撤销'
    },{
        code: '241',
        title: '满标复审'
    },{
        code: '242',
        title: '退出中'
    }]
    for(let i=0; i<config.length; i++){
        if(status == config[i].code){
            return config[i].title
        }
    }
}

export { status }