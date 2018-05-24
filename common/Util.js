    const os = require('os')

    import Bank from '../common/bankConfig'
    import bridge from "../static/merge/xxd-jsBridge.esm";
    
    const localItem = function (key, value) {
        if (arguments.length == 1) {
            return localStorage.getItem(key);
        } else {
            return localStorage.setItem(key, value);
        }
    };

    const openApp = function(){
        bridge.open({
            pagename: 'home'
        } , ()=>{
            var ua  = bridge.ua;
            if(ua.isWeChat()) {
                alert("微信里面无法唤醒APP");
            }
            location = "/m/static/html/download/app.html?model=auto";
        })
    }
    
    const removeLocalItem = function (key) {
        if (key) {
            return localStorage.removeItem(key);
        }
        return localStorage.removeItem();
    };
    
    const getQueryString = (name)=> { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return decodeURI(r[2]); return null; 
    } 
    
    const getCookie = function(cookiename){ 
        if (process.browser){
            let cookiestring = document.cookie; 
            let start = cookiestring.indexOf(cookiename + '='); 
            if(start == -1){
                return null; 
            }   //   找不到 
            start += cookiename.length + 1; 
            let end = cookiestring.indexOf("; ",start); 
            if(end == -1){
                return unescape(cookiestring.substring(start));
            }    
            return unescape(cookiestring.substring(start, end)); 
        }
        
    }
    
    const delCookie = (name)=> {
      var exp = new Date();
      exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
      var cval = getCookie(name);
      document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    }

    const clearAllCookie = () => {  
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
        if(keys) {  
            for(var i = keys.length; i--;)  
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
        }  
    }  

    const toUrl = (url, args)=> {
		let formDom = document.createElement('form')
		formDom.method = 'post'
		formDom.action = url

		for(var key in args){
			let inputDom = document.createElement('input')
			inputDom.type = 'hidden'

			inputDom.setAttribute('name', key)
			inputDom.setAttribute('value', args[key])

			formDom.appendChild(inputDom)

		}
		document.body.appendChild(formDom)
		formDom.submit()
		document.body.removeChild(formDom)
    }
    
    // 手机号脱敏
    const phoneSpace = (val) => {
        if(val){
            return val.substr(0,3)+"****"+val.substr(7);
        }else{
            return val
        }
        
    }

    // 姓名脱敏
    const nameSpace = (val) => {
        const nameLength = val.length
        let lastName = val.substring(1).replace(/./g,'*')
        return val.substr(0,1) + lastName
    }

    // 身份证号脱敏
    const desensitization = (val) => {
        val = String(val)
        let star = val.length == 18 ? '*************' : '**********'
        return val.substring(0, 6) + star + val.substr(val.length-1,1)
    }

    // 银行卡号脱敏 每4位一空格
    const spaceJoin = (str) => {
        str = String(str)
        let lastNum = str.substr(str.length - 4, 4)
        let newStr = str.substring(0, str.length-4).replace(/\d/g, '*')
        let result = newStr + lastNum
        return result.replace(/\s/g,'').replace(/(.{4})/g,"$1 ")
    }

    const getLocalIP = (callback) => {
        const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        if (RTCPeerConnection) (function()
        {
            const rtc = new RTCPeerConnection({iceServers: []});
            if (1 || window.mozRTCPeerConnection)
            {
                rtc.createDataChannel('', {reliable: false});
            }
            rtc.onicecandidate = function(evt)
            {
                if (evt.candidate) grepSDP(`a=${evt.candidate.candidate}`);
            };
            rtc.createOffer(function(offerDesc)
            {
                grepSDP(offerDesc.sdp);
                rtc.setLocalDescription(offerDesc);
            }, function(e) {console.warn('offer failed', e);});
            const addrs = Object.create(null);
            addrs['0.0.0.0'] = false;
            function updateDisplay(newAddr)
            {
                if (newAddr in addrs) return;
                addrs[newAddr] = true;
                const displayAddrs = Object.keys(addrs).filter(function(k) {return addrs[k];});
                for (let i = 0; i < displayAddrs.length; i++)
                {
                    if (displayAddrs[i].length > 16)
                    {
                        displayAddrs.splice(i, 1);
                        i--;
                    }
                }
                callback(displayAddrs[0])
            }
            function grepSDP(sdp)
            {
                sdp.split('\r\n').forEach(function(line, index, arr)
                {
                    if (~line.indexOf('a=candidate'))
                    {
                        const parts = line.split(' '),
                            addr = parts[4],
                            type = parts[7];
                        if (type === 'host') updateDisplay(addr);
                    }
                    else if (~line.indexOf('c='))
                    {
                        const parts = line.split(' '),
                            addr = parts[2];
                        updateDisplay(addr);
                    }
                });
            }
        })();
        else
        {
            console.warn('请使用主流浏览器：chrome,firefox,opera,safari');
        }
    }

    const getBankInfo = (id) => {
        for(let i=0; i< Bank.length; i++ ){
            if(Bank[i].bankCardCode == id){
                return Bank[i]
            }
        }
    }

    //  input获取焦点的时候隐藏placeholder
    const onFocus = () => e => {
        e.target.placeholder = ''
    }

    const onBlur = (value) => e => {
        e.target.placeholder = value
    }


    export { 
        localItem,
        removeLocalItem,
        getCookie,
        delCookie, 
        getQueryString, 
        toUrl, 
        desensitization, 
        spaceJoin, 
        nameSpace,
        phoneSpace,
        getLocalIP,
        getBankInfo,
        onFocus,
        onBlur,
        clearAllCookie,
        openApp
    }