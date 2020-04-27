import * as socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8080";

chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(checkReady)
            console.log("We're in the injected content script!")
            const socket = socketIOClient(ENDPOINT);
            socket.on("position_broadcast", data => {
                console.log('socket data: ', data);
            });
        }
    })
})
