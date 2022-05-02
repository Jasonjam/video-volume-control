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



    // set 各項 html tag 需要用到的data
    function setTargetVolData(targetVol){
        // Video bottom panel
        let ytpPanel = document.querySelector('.ytp-volume-panel')
        let ytpSlider = document.querySelector('.ytp-volume-slider-handle')
        // 轉成 %數值，並傳到 html tag 的 data
        let percentNum = targetVol * 100
        ytpPanel.ariaValuenow = percentNum
        ytpPanel.ariaValuetext = `${percentNum}% 音量`;
        // 控制音量拉桿 ( max:40px )
        let ytpSliderLength = percentNum / 2.5
        ytpSlider.style.left = `${ytpSliderLength}px`

        return `${percentNum}%`
    }
    // 畫面中間音量提示
    function volAlert(percentNum){
      
        let newDiv = document.createElement('div')
        newDiv.id = "volNowDiv"
        newDiv.textContent = percentNum
        newDiv.setAttribute('style',volAlertDivCss.pop())
        let speedCtrl = document.querySelector('.html5-video-container')
        speedCtrl.appendChild(newDiv)

        setTimeout(()=>{
            speedCtrl.querySelector('#volNowDiv').remove()
        },500)
    }

    function keyPress(e){
        for(let i=0; i<video.length; i++){
            let videoTarget = video[i]
            // vol++
            if(e.code === 'KeyW'){
                if( (videoTarget.volume+0.1) >= 1 ){
                    videoTarget.volume = 1
                }else{
                    videoTarget.volume+= 0.1
                }
                let targetVol = parseFloat(videoTarget.volume.toFixed(1))

                // 各tag需要用到的data
                setTargetVolData(targetVol)
                // 畫面中間音量提示
                volAlert(setTargetVolData(targetVol))
                console.log(`the vol is: ${setTargetVolData(targetVol)}`)
            }
            // vol--
            if(e.code === 'KeyQ'){
                if( (videoTarget.volume-0.1) <= 0 ){
                    videoTarget.volume = 0
                }else{
                    videoTarget.volume-= 0.1
                }
                let targetVol = parseFloat(videoTarget.volume.toFixed(1))

                // 各tag需要用到的data
                setTargetVolData(targetVol)
                // 畫面中間音量提示
                volAlert(setTargetVolData(targetVol))
                console.log(`the vol is: ${setTargetVolData(targetVol)}`)
            }

            // b
            if(e.code==='KeyB'){
                console.log('keyB',e)
                console.log('vid',video)
                console.log('vid.item no ', video.item(0))
                console.log('vid.item',videoTarget)
            }
        }

    }

    window.addEventListener('keydown',keyPress)
})();
