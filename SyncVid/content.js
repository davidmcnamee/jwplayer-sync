var debug=false;var mainDomain="http://sync-video.com";function checkForVideoYT(){if(debug){console.log("YT parser");}
var possibru=null;var flashreg=/(?:\?|\&){1}v=([^&]+)/i;var iframereg=/\/embed\/([^&\?]+)/;$("embed,object,video").each(function(){var current=$(this).get(0);if(typeof(current.getVideoUrl)=="function"){possibru=current.getVideoUrl();if(debug){console.log($(this),possibru);}
return false;}})
if(possibru!=null&&possibru.indexOf('youtube.com')>(-1)){var match=flashreg.exec(possibru);if(debug){console.log("FlashReg trim",match);}
if(match.length==2){return match[1];}}
$("iframe").each(function(){var uri=$(this).prop('src');if(uri!=null&&uri.indexOf('youtube.com')>(-1)){possibru=uri;if(debug){console.log($(this),possibru);}
return false;}})
if(possibru!=null){var match=iframereg.exec(possibru);if(debug){console.log("IFrame trim",match);}
if(match.length==2){return match[1];}}
if(document.location.hostname.indexOf('youtube.com')>(-1)){var tmpmeta=$("meta[itemprop='videoId'][content]").prop('content');if(debug){console.log("Meta tag",tmpmeta);}
possibru=tmpmeta;}
return possibru;}
function checkForVideoV(){if(debug){console.log("Vimeo parser");}
var possibru=null;$("iframe[src*='vimeo']").each(function(){var uriid=/vimeo.*\/([0-9]+)/.exec($(this).prop("src"));if(uriid.length==2){possibru=uriid[1];if(debug){console.log($(this),possibru);}
return false;}})
if(possibru!=null)
return possibru;$("embed,object").each(function(){if(typeof($(this).get(0).api_getVideoUrl)!="undefined"){var uritmp=$(this).get(0).api_getVideoUrl();var match=/vimeo\.com\/(.*$)/.exec(uritmp);if(match.length==2){possibru=match[1];if(debug){console.log($(this),"api",possibru);}
return false;}}else{$(this).find("param[name='flashvars'][value*='vimeo']").each(function(){var param=decodeURIComponent($(this).prop("value"));var wynik=/clip\_id\=([0-9]+)/.exec(param);if(wynik.length==2){possibru=wynik[1];if(debug){console.log($(this),wynik,possibru);}
return false;}})}
return true;})
if(possibru!=null)
return possibru;$("video[src*='vimeo']").each(function(){var splited=$(this).prop("src").split("/");possibru=splited[splited.length-1];if(debug){console.log($(this),possibru);}
return false;})
if(possibru!=null)
return possibru;$("meta[itemprop='playpageUrl'][content*='vimeo']").each(function(){var splited=$(this).prop("content").split("/",4);possibru=splited[splited.length-1];if(debug){console.log($(this),possibru);}})
return possibru;}
function checkForVideo(){var checked=checkForVideoYT();if(checked==null){checked=checkForVideoV();if(checked!=null)
return{'id':checked,'player':'v'}}else{return{'id':checked,'player':'y'}}
return null;}
chrome.extension.onMessage.addListener(function(msg,sender,response){if(msg.type=="redirect"){var url=null;if(msg.movie.player=="y"){var test=checkForVideoYT();url="/ext/y/"+(test==null?msg.movie.id:test);}else{var test=checkForVideoV();url="/ext/v/"+(test==null?msg.movie.id:test);}
if(url!=null)
document.location=mainDomain+url;}else if(msg.type=="check"){var checked=checkForVideo();if(checked!=null)
response(checked);else
setTimeout(function(){response(checkForVideo());},1337)}
return true;})