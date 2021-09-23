// https://javascript.plainenglish.io/how-to-detect-a-mobile-device-with-javascript-1c26e0002b31
// http://detectmobilebrowsers.com/

(function() {
    var pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i

    if (!pattern.test(navigator.userAgent)) {
        window.location.href = "./incompatible.html";
    }
})()