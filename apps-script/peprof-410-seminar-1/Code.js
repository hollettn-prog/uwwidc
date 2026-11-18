function doGet(e) {
  const meeting = e.parameter.meeting || "1";
  const view = e.parameter.view || "student";

  const validMeetings = ["1", "2", "3", "4"];

  if (!validMeetings.includes(meeting)) {
    return HtmlService.createHtmlOutput(
      "<h2>Meeting not found.</h2>"
    );
  }

  let fileName;

  if (view === "instructor") {
    fileName = "seminar" + meeting;
  } else {
    fileName = "Meeting" + meeting + "Student";
  }

  return HtmlService
    .createHtmlOutputFromFile(fileName)
    .setTitle("PEPROF 410 | Seminar Meeting " + meeting)
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}