import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'student-profile-app',
    template: require('./student.profile.component.html'),
    styles: [`${require('./student.profile.component.scss')}`]
})
export class VideoChatComponent implements OnInit {
    peer: any;
    mypeerid: any;
    anotherid: any;

    @ViewChild('myvideo') myVideo: any;

    constructor() { }

    ngOnInit() {
        let video = this.myVideo.nativeElement;

        this.peer = new Peer({
            host: location.hostname
        });

        setTimeout(() => {
            this.mypeerid = this.peer.id;
        }, 3000);

        this.peer.on('connection', function (conn: any) {
            console.log('Connection opening');
            conn.on('open', function () {
                console.log('Connection is open');
                conn.on('data', function (data: any) {
                    console.log(data);
                });
            });
        });

        const $this = this;
        const n = <any>navigator;
        n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia );

        this.peer.on('call', function (call: any) {
            n.getUserMedia({video: true, audio: true}, function(stream: any) {
                call.answer(stream);
                call.on('stream', function(remotestream: any){
                    video.src = URL.createObjectURL(remotestream);
                    video.play();
                })
            }, function(err: any) {
                console.log('Failed to get stream', err);
            })
        });
    }

    connect() {
        const conn = this.peer.connect(this.anotherid);
        console.log(conn);
        conn.on('open', function(){
            console.log(conn);
            conn.send('hi!');
        });
    }

    videoconnect(){
        let video = this.myVideo.nativeElement;
        var localvar = this.peer;
        var fname = this.anotherid;

        const n = <any>navigator;
        const $this = this;

        n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );

        n.getUserMedia({video: true, audio: true}, function(stream: any) {
            var call = $this.peer.call($this.anotherid, stream);
            call.on('stream', function(remotestream: any) {
                video.src = URL.createObjectURL(remotestream);
                video.play();
            })
        }, function(err: any){
            console.log('Failed to get stream', err);
        })
    }
}