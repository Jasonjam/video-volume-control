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
    //let volNow = document.getElementsByTagName('aria-valuenow');

    let video = document.getElementsByTagName("video");

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
        let volAlertDivCss=[`
position: absolute;
left: 50%;
top: 80px;
margin-left: -32px;
z-index: 99;
background: black;
opacity: .5;
width: 50px;
padding: 5px;
border-radius: 8px;
text-align:center;
font-size: 20px;
`]
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