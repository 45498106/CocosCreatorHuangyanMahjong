var UserLocalData = require("UserLocalData");

var Audio = {};
Audio.soundPath = "res/raw-assets/resources/audio/sound/";
Audio.musicPath = "res/raw-assets/resources/audio/music/";

Audio.playMusic = function(){
    
}

Audio.playSound = function(name, loop, volumn){
    var languageKind = UserLocalData.getAudioKind();
    var cPath = Audio.soundPath + languageKind +"/" + languageKind + name;
    cc.audioEngine.play(cPath, loop, volumn);
}


module.exports = Audio;