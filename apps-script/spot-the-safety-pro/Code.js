function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Roseman Gym: Spot the Safety Problems')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}