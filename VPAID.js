(function(){

    class Vpaid {
        constructor() {
            this.started = false;
            this.video = null;
            this.listeners = {};
        }

        notifyAbout(event) {
            console.log('[notifyAbout]', event);
            if (typeof this.listeners[event] === "function") {
                this.listeners[event]();
            }
        }

        /* Interface methods */
        handshakeVersion() { return '2.0'; }
        initAd(width, height, viewMode, bitrate, AdParameters, videoOpts) {
            console.log('[initAd]');
            this.video = videoOpts.videoSlot;
            // this.video.parentElement.removeChild(this.video);
            window.setTimeout(() => {
                this.notifyAbout('AdLoaded');
            }, 500);
        }
        startAd() {
            console.log('[startAd]');
            const video = this.video;
            video.src = '';
            video.load();

            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('type', 'video/mp4');

            video.addEventListener('canplaythrough', () => {
                if (this.started) { return; }
                this.started = true;
                this.notifyAbout('AdStarted');
                this.notifyAbout('AdVideoStart');
                this.resumeAd();
            });
            video.addEventListener('playing', () => {
                this.notifyAbout('AdPlaying');
            });
            video.addEventListener('pause', () => {
                this.notifyAbout('AdPaused');
            });
            video.addEventListener('ended', () => {
                this.notifyAbout('AdVideoComplete');
            });

            // video.addEventListener('canplaythrough', resumeAd);
            video.src = 'https://banners.adfox.ru/160205/adfox/455939/1560945_1.mp4';
            video.load();
        }
        stopAd() {
            console.log('[stopAd]');
            this.pauseAd();
            this.video.src = '';
            this.video.load();
            this.notifyAbout('AdStopped');
        }
        resizeAd() {}
        pauseAd() { this.video.pause(); }
        resumeAd() { this.video.play(); }
        expandAd() {}
        collapseAd() {}
        skipAd() {}
        subscribe(handler, event) {
            // console.log('[subscribe]', event);
            this.listeners[event] = handler;
        }
        unsubscribe(handler, event) {
            if (this.listeners[event]) {
                this.listeners[event] = null;
            }
        }
        getAdLinear() {}
        getAdWidth() {}
        getAdHeight() {}
        getAdExpanded() {}
        getAdSkippableState() {}

        getAdRemainingTime() { return this.video.duration - this.video.currentTime; }
        getAdDuration() { return this.video.duration; }
        getAdVolume() { return this.video.volume; }
        setAdVolume(v) { this.video.volume = v; }
    }

    let vpaid = null;
    function getVpaid() {
        return vpaid || (vpaid = new Vpaid());
    }
    window.getVPAIDAd = getVpaid;
})();