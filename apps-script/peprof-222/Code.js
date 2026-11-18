function doGet(e) {

  const parameters = e && e.parameter ? e.parameter : {};

  const skill = parameters.skill || "";
  const deck = parameters.deck || "";
  const assessment = parameters.assessment || "";

  const skillPages = {
    "1": "Skill1",
    "2": "Skill2",
    "3": "Skill3",
    "4": "Skill4",
    "5": "Skill5",
    "6": "Skill6"
  };

  const deckPages = {
    "course-launch": "DeckCourseLaunch",
    "positive-environment": "DeckPositiveEnvironment",
    "practice-proficiency": "DeckPracticeProficiency",
    "skill-1": "DeckSkill1",
    "skill-2": "DeckSkill2",
    "skill-3": "DeckSkill3",
    "skill-4": "DeckSkill4",
    "skill-5": "DeckSkill5",
    "skill-6": "DeckSkill6",
    "midterm-prep": "DeckMidtermPrep",
    "midterm-performance": "DeckMidtermPerformance",
    "final-prep": "DeckFinalPrep",
    "final-performance": "DeckFinalPerformance"
  };

  const assessmentPages = {
    "midterm": "AssessmentMidterm",
    "final": "AssessmentFinal"
  };

  let fileName = "DeckCourseLaunch";
  let pageTitle = "PEPROF 222";

  if (assessment && assessmentPages[assessment]) {
    fileName = assessmentPages[assessment];
    pageTitle =
      assessment === "midterm"
        ? "PEPROF 222 Midterm OSCE Mission Builder"
        : "PEPROF 222 Final OSCE Mission Builder";

  } else if (deck && deckPages[deck]) {
    fileName = deckPages[deck];
    pageTitle = "PEPROF 222 Presentation";

  } else if (skill && skillPages[skill]) {
    fileName = skillPages[skill];
    pageTitle = "PEPROF 222 Skill " + skill;
  }

  return HtmlService
    .createHtmlOutputFromFile(fileName)
    .setTitle(pageTitle)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}