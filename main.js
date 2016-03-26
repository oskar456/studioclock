/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var diameter = Math.round(0.5 * Math.min(screenWidth, screenHeight));

  chrome.app.window.create('index.html', {
    id: "studioclockID",
    outerBounds: {
      width: diameter,
      height: diameter
    }
  });
});
