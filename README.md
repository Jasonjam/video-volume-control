# video-volume-control 控制音量
For Tampermonkey 用  

解決影片播放器「焦點卡在控制元件，方向鍵上下變成亂跳進度」等問題。  
改用 Q / W 鍵調整音量，並將焦點拉回播放器本體。
Q: ArrowDown / W: ArrowUp

使用 `@match` 搭配想要啟用的網站  
`@match https://www.example.com/*`

---

## 備註

- 若目標網站本身已有 Q / W 快捷鍵，會被此腳本覆蓋
- 新網站需自行找到「接收鍵盤事件的播放器容器」並加入 selector
