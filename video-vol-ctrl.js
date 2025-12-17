// ==UserScript==
// @name         Vedio Vol control
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Q/W = native volume keys (focus player first)
// @author       Jasonjam
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @match        https://myself-bbs.com/*
// @match        https://www.facebook.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    const KEY_UP = 38;   // ArrowUp
    const KEY_DOWN = 40; // ArrowDown

    // 網頁播放器 元素，後續要支援新網站，在此增加元素
    const PLAYER_SELECTORS = [
        '#movie_player',
        '.html5-video-player',
    ]

    function isTypingContext(el) {
        if (!el) return false;
        const tag = el.tagName?.toLowerCase();
        return (
            tag === 'input' ||
            tag === 'textarea' ||
            el.isContentEditable
        );
    }

    // 找尋 網頁播放器 元素
    function findPlayer(){
        for (const sel of PLAYER_SELECTORS) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
        return null;
    }

    function focusPlayer() {
        const player = findPlayer()

        // 先把目前的焦點元件退焦，避免「播放桿被上下鍵控制」
        const active = document.activeElement;
        if (active && active !== document.body && typeof active.blur === 'function') {
            active.blur();
        }

        if (player) {
            if (!player.hasAttribute('tabindex')) player.tabIndex = -1;
            player.focus({ preventScroll: true });
            return player;
        }

        document.body.focus({ preventScroll: true });
        return document.body;
    }

    function dispatchArrow(keyCode) {
        const target = focusPlayer();

        const key = keyCode === KEY_UP ? 'ArrowUp' : 'ArrowDown';
        const code = key;

        // keydown
        const downEvt = new KeyboardEvent('keydown', {
            key,
            code,
            keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true,
        });

        // keyup（有些快捷鍵邏輯會看 keyup）
        const upEvt = new KeyboardEvent('keyup', {
            key,
            code,
            keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true,
        });

        // 優先先丟給播放器，找不到才丟給 document（有時候 YT 是掛在 document 上）
        if (target && target !== document.body) {
            target.dispatchEvent(downEvt);
            target.dispatchEvent(upEvt);
            return
        }
        document.dispatchEvent(downEvt);
        document.dispatchEvent(upEvt);
    }

    window.addEventListener('keydown', (e) => {
        // 避免在搜尋框/留言輸入時搶熱鍵
        if (isTypingContext(document.activeElement)) return;

        // q = 音量下、w = 音量上（你可反過來）
        if (e.key === 'q' || e.key === 'Q') {
            e.preventDefault();
            e.stopPropagation();
            dispatchArrow(KEY_DOWN);
        }
        if (e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            e.stopPropagation();
            dispatchArrow(KEY_UP);
        }
    }, true); // 用 capture 比較能搶在 YT/元件前面處理
})();

