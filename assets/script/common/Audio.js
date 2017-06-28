var UserLocalData = require("UserLocalData");

var Audio = {};
Audio.soundPath = "res/raw-assets/resources/audio/sound/";
Audio.musicPath = "res/raw-assets/resources/audio/music/";

//播放指定音乐
Audio.playMusic = function(name){
    var cPath = Audio.musicPath + name;
    if(UserLocalData.getMusicSwitch() === false) return;
    this.musicID = cc.audioEngine.play(cPath, true, 1);
}

//播放指定音效
Audio.playSound = function(name, loop, volumn){
    var languageKind = UserLocalData.getAudioKind();
    var cPath = Audio.soundPath + languageKind +"/" + languageKind + name;
    if(UserLocalData.getSoundSwitch() === false) return;
    this.soundID = cc.audioEngine.play(cPath, loop, volumn);
}

//停止正在播放的所有音频
Audio.stopAll = function(){
    cc.audioEngine.stopAll();
}

//恢复播放所有之前暂停的音频
Audio.resumeAll = function(){
    cc.audioEngine.resumeAll();
}

Audio.pauseMusic = function(){
    if(this.musicID === undefined) return;
    cc.audioEngine.pause(this.musicID);
}

//暂停指定音乐
Audio.stopMusic = function(){
    if(this.musicID === undefined) return;
    cc.audioEngine.stop(this.musicID);
}

//恢复指定音乐
Audio.resumeMusic = function(){
    if(this.musicID === undefined) Audio.playMusic("back.mp3");
    cc.audioEngine.resume(this.musicID);
}

//停止正在播放的指定音效
Audio.stopSound = function(){
    if(this.soundID === undefined) return;
    cc.audioEngine.stop(this.soundID);
}

//恢复播放之前暂停指定的音效
Audio.resumeSound = function(){
    if(this.soundID === undefined) return;
    cc.audioEngine.resume(this.soundID);
}

module.exports = Audio;