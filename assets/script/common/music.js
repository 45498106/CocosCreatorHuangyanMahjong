var log = require("utils").log
var Music = {
    isInit: false,
    lastMusicPath: "",
    
    init : function(){
        //music  is enable
        this.musicEnable  = true
        //effect is enable
        this.effectEnable = true
        this.setMusicSwitch(this.musicEnable);
        this.setEffectSwitch(this.effectEnable);
    },
    
    setMusicSwitch : function(value){
        this.musicEnable = value;
        if(false === value){
            this.stopMusic();
        }else{
           this.resumeMusic();
        }
    },
    
    setEffectSwitch : function(value){ 
        this.effectEnable = value;
    },

    
    stopAll : function(){
        this.stopMusic();
        this.stopEffects();
    },
    
    stopMusic : function(){
        this.stopAudio(this.lastMusicPath);
    },

    resumeMusic : function() {
       this.resumeAudio(this.lastMusicPath);
    },
    
    stopEffects : function(){
        this.stopAudio(this.lastEffectPath);
    },

    stopAudio : function(lastPath) {
        if(!lastPath) {return};
        cc.audioEngine.stop(lastPath);
    },

    resumeAudio : function(lastPath) {
        if(!lastPath) {return};
        cc.audioEngine.stop(lastPath);
    },
    
    playMusic : function(path){
        if(path === this.lastMusicPath) return;
        if(!this.musicEnable || path === undefined) return; //如果设置中没有播放音乐则不播放
        this.stopAudio(this.lastMusicPath, path);
        this.lastMusicPath = path;
        cc.audioEngine.play(path,true, 1);
    },
    
    playEffect : function(path,loop,volumn){
        //if(false === this.effectEnable)  return;
        loop = loop || false;
        volumn = volumn ||  1;
        if(!this.effectEnable || path === undefined) return; //如果设置中没有播放音效则不播放
        this.stopAudio(this.lastEffectPath, path);
        this.lastEffectPath = path;
        cc.audioEngine.play(path,loop,volumn);
    },
    
};




module.exports = Music;