/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var radius = Math.round(0.5 * Math.min(screenWidth, screenHeight));

  chrome.app.window.create('index.html', {
    id: "helloWorldID",
    outerBounds: {
      width: radius,
      height: radius,
      //left: Math.round((screenWidth-radius)/2),
      //top: Math.round((screenHeight-radius)/2)
    }
  });
});
