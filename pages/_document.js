import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render () {
    return (
      <html>
        <Head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui"/>
            <link rel="shortcut icon" href="//static.xinxindai.com/pc/1.2.4.1/build/css/i/favicon.ico" />
            <link rel="Bookmark" href="//static.xinxindai.com/pc/1.2.4.1/build/css/i/favicon.ico"/>
            <title>【新新贷官网】专业透明的网络借贷平台，P2P网贷平台，网上贷款借款、投融资信息中介平台</title>
            <meta name="keywords" content="新新贷，P2P网贷，P2P理财，投资理财，新新贷理财，网上理财，债权转让，新元宝，月月派，新手专享，投融资，贷款，企业贷款，网上贷款，贷款公司，P2P贷款，无抵押小额贷款，借款" />
            <meta name="description" content="新新贷是中国专业的互联网金融P2P网络借贷信息中介平台，为出借人和借款人提供省心的互联网金融信息服务。资金银行存管、严格的风控体系、信息披露透明等多重安全保障措施。新手专享14%、新元宝，月月派等优质产品任您选择，投融资，投资理财，P2P理财、P2P贷款、无抵押贷款、信用贷款，就上新新贷！" />
            <meta httpEquiv="pragma" content="no-cache"/>    
            <meta name="applicable-device" content="mobile" />
            <meta httpEquiv="Cache-Control" content="no-cache, must-revalidate"/>    
            <meta httpEquiv="expires" content="0"/> 
            <meta name="robots" content="nofollow" />
            <script src="/static/html/base.js?v1"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}