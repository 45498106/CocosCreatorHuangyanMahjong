var UserLocalData = require("UserLocalData");

var Audio = {};
Audio.soundPath = "res/raw-assets/resources/audio/sound/";
Audio.musicPath = "res/raw-assets/resources/audio/music/";

//播放音乐
Audio.playMusic = function(name){
    cc.log("-----  Audio.playMusic  -----")
    var cPath = Audio.musicPath + name;
    this.lastMusicPath = cPath;
    if(UserLocalData.getMusicSwitch() === false || cPath === undefined) return;
    cc.audioEngine.play(cPath, true, 1);
}

//播放音效
Audio.playSound = function(name, loop, volumn){
    cc.log("-----  Audio.playSound  -----")
    var languageKind = UserLocalData.getAudioKind();
    var cPath = Audio.soundPath + languageKind +"/" + languageKind + name;
    this.lastSoundPath = cPath;
    if(UserLocalData.getSoundSwitch() === false || cPath === undefined) return;
    cc.audioEngine.play(cPath, loop, volumn);
}

//暂停所有音效和音乐
Audio.stopAll = function(){
    if (this.lastSoundPath === undefined || this.lastMusicPath === undefined) return;
    cc.audioEngine.stop(this.lastMusicPath);
    cc.audioEngine.stop(this.lastSoundPath);
}

//恢复所有音乐和音效
Audio.resumeAll = function(){
    if (this.lastSoundPath === undefined || this.lastMusicPath === undefined) return;
    cc.audioEngine.resume(this.lastMusicPath);
    cc.audioEngine.resume(this.lastSoundPath);
}

//暂停音乐
Audio.stopMusic = function(){
    cc.log("-----  Audio.stopMusic  -----")
    cc.log("-----  ", this.lastMusicPath)
    if(this.lastMusicPath === undefined) return;
    cc.audioEngine.stop(this.lastMusicPath);
}

//恢复音乐
Audio.resumeMusic = function(){
    cc.log("-----  Audio.resumeMusic  -----")
    if(this.lastMusicPath === undefined) return;
    cc.audioEngine.resume(this.lastMusicPath);
}

//暂停音效
Audio.stopSound = function(){
    cc.log("-----  Audio.stopSound  -----")
    if(this.lastSoundPath === undefined) return;
    cc.audioEngine.stop(this.lastSoundPath);
}

//恢复音效
Audio.resumeSound = function(){
    cc.log("-----  Audio.resumeSound  -----")
    if(this.lastSoundPath === undefined) return;
    cc.audioEngine.resume(this.lastSoundPath);
}

module.exports = Audio;