import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'video-chat-app',
    template: require('./video.chat.component.html'),
    styles: [`${require('./video.chat.component.scss')}`]
})
export class VideoChatComponent implements OnInit {
    peer: any;

    constructor() { }

    ngOnInit() {
        this.peer = new Peer({key: 'msp75ipukl1k0529'});
    }
}