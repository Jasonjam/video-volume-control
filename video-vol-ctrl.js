// ==UserScript==
// @name         Vedio Vol control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Jasonjam
// @match        https://www.youtube.com*
// @include      https://www.youtube.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {

    // 音量提示 div style
    let volAlertDivStyle=`
position: absolute;
left: 50%;
top: 80px;
margin-left: -32px;
z-index: 99;
background: #234d6c;
opacity: .5;
min-width: 50px;
padding: 5px;
border-radius: 8px;
color: snow;
text-align:center;
font-size: 20px;
`
    // 喇吧圖示
    //修改在 .ytp-svg-volume-animation-speaker[o].attributes.d.nodeValue
    let speakerImgSmall = `
M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z
`
    let speakerImgBig = `
M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z
`

    // 寫回各項 html tag (aria-value) 需要用到的數值
    function setVolData(pctNum, i){
        // Video bottom panel
        let ytpVolPanel = document.getElementsByClassName('ytp-volume-panel')[i]
        let ytpSlider = document.getElementsByClassName('ytp-volume-slider-handle')[i]
        // 傳到 html tag 的 data
        ytpVolPanel.ariaValuenow = pctNum
        ytpVolPanel.ariaValueText = `${pctNum}% 音量`;
        // 控制音量拉桿CSS ( max:40px )
        let ytpSliderLength = pctNum / 2.5
        ytpSlider.style.left = `${ytpSliderLength}px`

        // 切換喇吧圖示大小
        let speakerImg = document.getElementsByClassName('ytp-svg-volume-animation-speaker')[0]
        if(pctNum <= 50) speakerImg.attributes.d.nodeValue = speakerImgSmall
        if(pctNum > 50) speakerImg.attributes.d.nodeValue = speakerImgBig
    }
	
    // 音量提示 (畫面中間)
    let timeoutRemoveDiv = null
    function volAlert(pctNum){
        let newDiv = document.createElement('div')
        newDiv.id = "volShowDiv"
        newDiv.textContent = `${pctNum} %`
        newDiv.setAttribute('style',volAlertDivStyle)

        // 避免多次按下，上一次的DIV未自然消失，造成CSS重複顯示
        if(document.getElementById('volShowDiv')){
            document.getElementById('volShowDiv').remove()
            clearTimeout(timeoutRemoveDiv)
            timeoutRemoveDiv = null
        }
        // 上面先取消一次後，新增id="volShowDiv"的div
        document.body.appendChild(newDiv)
        // 自然消失
        timeoutRemoveDiv = setTimeout(()=>{
            document.getElementById('volShowDiv').remove()
        },1000)
    }
	
    // videoVolOrig = videoTarget.volume
    function resultVol(videoVolOrig, i){
        // 單位數值轉換(percent = pct)
        function pctNumOrig(videoVolOrig){
            // 音量小數點修正(revise)，預設數值是 0.2xxxxxxxx
            let reviseVol = parseFloat(videoVolOrig.toFixed(2))
            console.log('orig',videoVolOrig,'revise',reviseVol)
            // 轉成 百分數值
            const percentNum = reviseVol * 100
            // 確保回傳是整數
            return parseFloat(percentNum.toFixed(0))
        }
        const pctNum = pctNumOrig(videoVolOrig)

        // 各tag需要用到的data
        setVolData(pctNum,i)
        // 畫面中間音量提示
        volAlert(pctNum)
        console.log(`now vol: ${pctNum} %`)
    }

     function keyPress(e){
        // for迴圈用意: getElementByTagName('video')會有多個結果
        let video = document.getElementsByTagName("video");
        for(let i=0; i<video.length; i++){
            let videoTarget = video[i]
            // vol++
            if(e.code === 'KeyW'){
                if(videoTarget.volume+0.05 > 100){
                    videoTarget.volume = 100
                }else{
                    videoTarget.volume += 0.05
                }
                resultVol(videoTarget.volume,i)
            }

            // vol--
            if(e.code === 'KeyQ'){
                if(videoTarget.volume-0.05 <= 0){
                    videoTarget.volume = 0
                }else{
                    videoTarget.volume -= 0.05
                }
                resultVol(videoTarget.volume,i)
            }

            // b: show detail & test div
			if(e.code === 'KeyB'){
                console.log('keyB',e)
				console.log('vid',video)
				console.log('vid.item no ', video.item(0))
                // 新增測試用 div
                let newTestDiv = document.createElement('div')
                newTestDiv.id = 'testdiv'
                newTestDiv.setAttribute('style',volAlertDivStyle)
                newTestDiv.textContent = 'test'
                document.body.appendChild(newTestDiv)
            }

            // n: remove test div
            if(e.code === 'KeyN'){
                document.getElementById('testdiv').remove()
            }
		}

	}

	window.addEventListener('keydown',keyPress)
})();
