/**
 * =========================================================
 * PRE-STUDENT TEACHING TOOLKIT
 * MASTER APPS SCRIPT
 * =========================================================
 */


/* =========================================================
   WEB APP
   ========================================================= */

function doGet() {

  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Pre-Student Teaching Toolkit')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


/* =========================================================
   HTML HELPERS
   ========================================================= */

function include(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}


function getPartial(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}


/* =========================================================
   TOOLKIT SETUP
   ========================================================= */

function setupToolkit() {

  var rootFolder =
    getOrCreateRootFolder_(
      'Pre-Student Teaching Toolkit'
    );


  var health445 =
    getOrCreateChildFolder_(
      rootFolder,
      'HEALTHED 445'
    );


  var peprof437 =
    getOrCreateChildFolder_(
      rootFolder,
      'PEPROF 437'
    );


  var peprof447 =
    getOrCreateChildFolder_(
      rootFolder,
      'PEPROF 447'
    );


  var peprof475 =
    getOrCreateChildFolder_(
      rootFolder,
      'PEPROF 475'
    );


  var peprof437M1 =
    getOrCreateChildFolder_(
      peprof437,
      'M1 Foundations of Elementary PE'
    );


  var peprof437M2 =
    getOrCreateChildFolder_(
      peprof437,
      'M2 Understanding Elementary Learners'
    );


  var peprof437M3 =
    getOrCreateChildFolder_(
      peprof437,
      'M3 Curriculum & Planning'
    );


  var properties =
    PropertiesService
      .getUserProperties();


  properties.setProperties({

    toolkitRootId:
      rootFolder.getId(),

    health445Id:
      health445.getId(),

    peprof437Id:
      peprof437.getId(),

    peprof447Id:
      peprof447.getId(),

    peprof475Id:
      peprof475.getId(),

    peprof437M1Id:
      peprof437M1.getId(),

    peprof437M2Id:
      peprof437M2.getId(),

    peprof437M3Id:
      peprof437M3.getId()

  });


  return {

    connected: true,

    folderName:
      rootFolder.getName(),

    folderId:
      rootFolder.getId(),

    folderUrl:
      rootFolder.getUrl()

  };

}


/* =========================================================
   TOOLKIT STATUS
   ========================================================= */

function getToolkitStatus() {

  var properties =
    PropertiesService
      .getUserProperties();


  var folderId =
    properties.getProperty(
      'toolkitRootId'
    );


  if (!folderId) {

    return {
      connected: false
    };

  }


  try {

    var folder =
      DriveApp.getFolderById(
        folderId
      );


    return {

      connected: true,

      folderName:
        folder.getName(),

      folderId:
        folder.getId(),

      folderUrl:
        folder.getUrl()

    };

  }

  catch(error) {

    properties.deleteProperty(
      'toolkitRootId'
    );


    return {
      connected: false
    };

  }

}


/* =========================================================
   FOLDER HELPERS
   ========================================================= */

function getOrCreateRootFolder_(
  folderName
) {

  var folders =
    DriveApp.getFoldersByName(
      folderName
    );


  if (folders.hasNext()) {

    return folders.next();

  }


  return DriveApp.createFolder(
    folderName
  );

}


function getOrCreateChildFolder_(
  parentFolder,
  folderName
) {

  var folders =
    parentFolder.getFoldersByName(
      folderName
    );


  if (folders.hasNext()) {

    return folders.next();

  }


  return parentFolder.createFolder(
    folderName
  );

}


/* =========================================================
   MODULE 1
   PHILOSOPHY
   ========================================================= */

function saveM1Philosophy(data) {

  if (!data) {

    throw new Error(
      'No philosophy information was received.'
    );

  }


  var properties =
    PropertiesService
      .getUserProperties();


  var folderId =
    properties.getProperty(
      'peprof437M1Id'
    );


  if (!folderId) {

    throw new Error(
      'Please set up your Pre-Student Teaching Toolkit before saving your philosophy.'
    );

  }


  var folder =
    DriveApp.getFolderById(
      folderId
    );


  var studentName =
    cleanText_(
      data.studentName
    ) || 'Student';


  var documentTitle =
    'Elementary PE Philosophy - ' +
    studentName;


  var existingDocId =
    properties.getProperty(
      'peprof437M1DocumentId'
    );


  var doc;
  var file;


  if (existingDocId) {

    try {

      doc =
        DocumentApp.openById(
          existingDocId
        );


      file =
        DriveApp.getFileById(
          existingDocId
        );


      doc.getBody().clear();


      file.setName(
        documentTitle
      );

    }

    catch(error) {

      existingDocId = null;

    }

  }


  if (!existingDocId) {

    doc =
      DocumentApp.create(
        documentTitle
      );


    file =
      DriveApp.getFileById(
        doc.getId()
      );


    file.moveTo(
      folder
    );


    properties.setProperty(
      'peprof437M1DocumentId',
      doc.getId()
    );

  }


  buildM1Document_(
    doc,
    data
  );


  doc.saveAndClose();


  return {

    success: true,

    documentId:
      doc.getId(),

    documentName:
      documentTitle,

    documentUrl:
      doc.getUrl(),

    folderUrl:
      folder.getUrl()

  };

}


/* =========================================================
   BUILD M1 DOCUMENT
   ========================================================= */

function buildM1Document_(
  doc,
  data
) {

  var body =
    doc.getBody();


  body.setMarginTop(54);
  body.setMarginBottom(54);
  body.setMarginLeft(60);
  body.setMarginRight(60);


  var title =
    body.appendParagraph(
      'My Philosophy of Elementary Physical Education'
    );


  title.setHeading(
    DocumentApp.ParagraphHeading.TITLE
  );


  title.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  title.editAsText()
    .setForegroundColor('#501D82')
    .setBold(true);


  var student =
    body.appendParagraph(
      cleanText_(
        data.studentName
      )
    );


  student.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  student.editAsText()
    .setFontSize(11)
    .setForegroundColor('#666666');


  body.appendParagraph('');


  var philosophy =
    body.appendParagraph(
      cleanText_(
        data.philosophy
      )
    );


  philosophy.editAsText()
    .setFontSize(11);


  body.appendPageBreak();


  appendM1SectionHeading_(
    body,
    'What Guides My Teaching'
  );


  var intro =
    body.appendParagraph(
      'The following beliefs represent ideas I want to carry ' +
      'into my teaching. The examples show how those beliefs ' +
      'could influence decisions I make in elementary PE.'
    );


  intro.editAsText()
    .setFontSize(10);


  body.appendParagraph('');


  var table =
    body.appendTable();


  var header =
    table.appendTableRow();


  var beliefHeader =
    header.appendTableCell(
      'What I Believe'
    );


  beliefHeader.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82')
    .setFontSize(10);


  var practiceHeader =
    header.appendTableCell(
      'What This Could Look Like in My Teaching'
    );


  practiceHeader.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82')
    .setFontSize(10);


  var beliefs =
    data.beliefs || [];


  for (
    var i = 0;
    i < beliefs.length;
    i++
  ) {

    var row =
      table.appendTableRow();


    var beliefCell =
      row.appendTableCell(
        cleanText_(
          beliefs[i].belief
        )
      );


    beliefCell.editAsText()
      .setFontSize(10);


    var practiceCell =
      row.appendTableCell(
        cleanText_(
          beliefs[i].practice
        )
      );


    practiceCell.editAsText()
      .setFontSize(10);

  }


  body.appendParagraph('');


  appendM1SectionHeading_(
    body,
    'Thinking It Through'
  );


  var scenarioPrompt =
    body.appendParagraph(
      'With limited instructional time, how would I balance ' +
      'student learning, physical activity, and enjoyment?'
    );


  scenarioPrompt.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82');


  body.appendParagraph(
    cleanText_(
      data.scenario
    )
  )
  .editAsText()
  .setFontSize(10);


  body.appendParagraph('');


  appendM1SectionHeading_(
    body,
    'Starting Point'
  );


  var purposePrompt =
    body.appendParagraph(
      'What I believe good elementary PE should do for students'
    );


  purposePrompt.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82');


  body.appendParagraph(
    cleanText_(
      data.purpose
    )
  )
  .editAsText()
  .setFontSize(10);


  setToolkitFooter_(
    doc
  );

}


function appendM1SectionHeading_(
  body,
  text
) {

  var heading =
    body.appendParagraph(
      text
    );


  heading.setHeading(
    DocumentApp.ParagraphHeading.HEADING1
  );


  heading.editAsText()
    .setForegroundColor('#501D82')
    .setBold(true);

}


function exportM1PhilosophyWord() {

  var properties =
    PropertiesService
      .getUserProperties();


  var documentId =
    properties.getProperty(
      'peprof437M1DocumentId'
    );


  if (!documentId) {

    throw new Error(
      'Please save your philosophy to your Toolkit before downloading a Word copy.'
    );

  }


  return exportGoogleDocAsWord_(
    documentId
  );

}


/* =========================================================
   MODULE 2
   CHILD DEVELOPMENT QUICK REFERENCE GUIDE
   ========================================================= */

function saveM2ChildDevelopmentGuide(
  data
) {

  if (!data) {

    throw new Error(
      'No guide information was received.'
    );

  }


  var properties =
    PropertiesService
      .getUserProperties();


  var folderId =
    properties.getProperty(
      'peprof437M2Id'
    );


  if (!folderId) {

    throw new Error(
      'Please set up your Pre-Student Teaching Toolkit before saving your guide.'
    );

  }


  var folder =
    DriveApp.getFolderById(
      folderId
    );


  var studentName =
    cleanText_(
      data.studentName
    ) || 'Student';


  var documentTitle =
    'Child Development Quick Reference Guide - ' +
    studentName;


  var existingDocId =
    properties.getProperty(
      'peprof437M2DocumentId'
    );


  var doc;
  var file;


  if (existingDocId) {

    try {

      doc =
        DocumentApp.openById(
          existingDocId
        );


      file =
        DriveApp.getFileById(
          existingDocId
        );


      doc.getBody().clear();


      file.setName(
        documentTitle
      );

    }

    catch(error) {

      existingDocId = null;

    }

  }


  if (!existingDocId) {

    doc =
      DocumentApp.create(
        documentTitle
      );


    file =
      DriveApp.getFileById(
        doc.getId()
      );


    file.moveTo(
      folder
    );


    properties.setProperty(
      'peprof437M2DocumentId',
      doc.getId()
    );

  }


  buildM2Document_(
    doc,
    data
  );


  doc.saveAndClose();


  return {

    success: true,

    documentId:
      doc.getId(),

    documentName:
      documentTitle,

    documentUrl:
      doc.getUrl(),

    folderUrl:
      folder.getUrl()

  };

}


/* =========================================================
   BUILD REVISED M2 DOCUMENT
   ========================================================= */

function buildM2Document_(
  doc,
  data
) {

  var body =
    doc.getBody();


  body.setMarginTop(45);
  body.setMarginBottom(45);
  body.setMarginLeft(55);
  body.setMarginRight(55);


  /* TITLE */

  var title =
    body.appendParagraph(
      'Child Development Quick Reference Guide'
    );


  title.setHeading(
    DocumentApp.ParagraphHeading.TITLE
  );


  title.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  title.editAsText()
    .setForegroundColor('#501D82')
    .setBold(true);


  var subtitle =
    body.appendParagraph(
      'Elementary Physical Education'
    );


  subtitle.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  subtitle.editAsText()
    .setFontSize(12)
    .setForegroundColor('#555555');


  var student =
    body.appendParagraph(
      cleanText_(
        data.studentName
      )
    );


  student.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  student.editAsText()
    .setFontSize(10)
    .setForegroundColor('#666666');


  body.appendParagraph('');


  var intro =
    body.appendParagraph(
      'Use this guide as a quick reference when planning for ' +
      'elementary learners. Developmental characteristics describe ' +
      'general patterns rather than expectations for every child.'
    );


  intro.editAsText()
    .setFontSize(10);


  body.appendParagraph('');


  /* K-1 */

  appendM2GradeBand_(
    body,
    'Kindergarten & Grade 1',
    data.k1
  );


  /* GRADES 2-3 */

  appendM2GradeBand_(
    body,
    'Grades 2 & 3',
    data.g23
  );


  /* GRADES 4-5 */

  appendM2GradeBand_(
    body,
    'Grades 4 & 5',
    data.g45
  );


  /* APPLICATION */

  body.appendPageBreak();


  appendM2SectionHeading_(
    body,
    'Applying Developmental Knowledge'
  );


  var scenarioHeading =
    body.appendParagraph(
      'Third-Grade Throwing and Catching'
    );


  scenarioHeading.setHeading(
    DocumentApp.ParagraphHeading.HEADING2
  );


  scenarioHeading.editAsText()
    .setForegroundColor('#501D82');


  var scenario =
    body.appendParagraph(
      'A third-grade class of 24 students has a wide range ' +
      'of skill levels. Several students are becoming frustrated ' +
      'when they repeatedly drop the ball. A few highly skilled ' +
      'students are beginning to dominate partner activities, ' +
      'and some students are becoming more aware of how their ' +
      'performance compares with their classmates.'
    );


  scenario.editAsText()
    .setFontSize(10);


  body.appendParagraph('');


  var decisions =
    data.decisions || [];


  for (
    var i = 0;
    i < decisions.length;
    i++
  ) {

    var decisionHeading =
      body.appendParagraph(
        'Decision ' +
        (i + 1)
      );


    decisionHeading.editAsText()
      .setBold(true)
      .setForegroundColor('#501D82');


    body.appendParagraph(
      cleanText_(
        decisions[i]
      )
    )
    .editAsText()
    .setFontSize(10);


    body.appendParagraph('');

  }


  /* INDIVIDUAL DIFFERENCES */

  appendM2SectionHeading_(
    body,
    'Individual Differences'
  );


  body.appendParagraph(
    cleanText_(
      data.individualDifferences
    )
  )
  .editAsText()
  .setFontSize(10);


  setToolkitFooter_(
    doc
  );

}


/* =========================================================
   M2 GRADE BAND
   ========================================================= */

function appendM2GradeBand_(
  body,
  gradeBand,
  data
) {

  appendM2SectionHeading_(
    body,
    gradeBand
  );


  var table =
    body.appendTable();


  var rows = [

    [
      'Physical',
      data.physical
    ],

    [
      'Cognitive',
      data.cognitive
    ],

    [
      'Social',
      data.social
    ],

    [
      'Emotional',
      data.emotional
    ]

  ];


  rows.forEach(
    function(item) {

      var row =
        table.appendTableRow();


      var labelCell =
        row.appendTableCell(
          item[0]
        );


      labelCell.editAsText()
        .setBold(true)
        .setForegroundColor('#501D82')
        .setFontSize(9);


      var responseCell =
        row.appendTableCell(
          cleanText_(
            item[1]
          )
        );


      responseCell.editAsText()
        .setFontSize(9);

    }
  );


  body.appendParagraph('');


  var teachingHeading =
    body.appendParagraph(
      'Teaching this age group'
    );


  teachingHeading.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82');


  body.appendParagraph(
    cleanText_(
      data.teaching
    )
  )
  .editAsText()
  .setFontSize(10);


  body.appendParagraph('');

}


/* =========================================================
   M2 HELPERS
   ========================================================= */

function appendM2SectionHeading_(
  body,
  text
) {

  var heading =
    body.appendParagraph(
      text
    );


  heading.setHeading(
    DocumentApp.ParagraphHeading.HEADING1
  );


  heading.editAsText()
    .setForegroundColor('#501D82')
    .setBold(true);

}


function exportM2ChildDevelopmentWord() {

  var properties =
    PropertiesService
      .getUserProperties();


  var documentId =
    properties.getProperty(
      'peprof437M2DocumentId'
    );


  if (!documentId) {

    throw new Error(
      'Please save your guide to your Toolkit before downloading a Word copy.'
    );

  }


  return exportGoogleDocAsWord_(
    documentId
  );

}


/* =========================================================
   MODULE 3
   CURRICULUM PLANNING RESOURCE
   ========================================================= */

function saveM3CurriculumMap(
  data
) {

  if (!data) {

    throw new Error(
      'No curriculum information was received.'
    );

  }


  var properties =
    PropertiesService
      .getUserProperties();


  var folderId =
    properties.getProperty(
      'peprof437M3Id'
    );


  if (!folderId) {

    throw new Error(
      'Please set up your Pre-Student Teaching Toolkit before saving your curriculum resource.'
    );

  }


  var folder =
    DriveApp.getFolderById(
      folderId
    );


  var studentName =
    cleanText_(
      data.studentName
    ) || 'Student';


  var documentTitle =
    'Curriculum Planning Resource - ' +
    studentName;


  var existingDocId =
    properties.getProperty(
      'peprof437M3DocumentId'
    );


  var doc;
  var file;


  if (existingDocId) {

    try {

      doc =
        DocumentApp.openById(
          existingDocId
        );


      file =
        DriveApp.getFileById(
          existingDocId
        );


      doc.getBody().clear();


      file.setName(
        documentTitle
      );

    }

    catch(error) {

      existingDocId = null;

    }

  }


  if (!existingDocId) {

    doc =
      DocumentApp.create(
        documentTitle
      );


    file =
      DriveApp.getFileById(
        doc.getId()
      );


    file.moveTo(
      folder
    );


    properties.setProperty(
      'peprof437M3DocumentId',
      doc.getId()
    );

  }


  buildM3Document_(
    doc,
    data
  );


  doc.saveAndClose();


  return {

    success: true,

    documentId:
      doc.getId(),

    documentName:
      documentTitle,

    documentUrl:
      doc.getUrl(),

    folderUrl:
      folder.getUrl()

  };

}


/* =========================================================
   BUILD M3 DOCUMENT
   ========================================================= */

function buildM3Document_(
  doc,
  data
) {

  var body =
    doc.getBody();


  body.setMarginTop(45);
  body.setMarginBottom(45);
  body.setMarginLeft(55);
  body.setMarginRight(55);


  var title =
    body.appendParagraph(
      'Elementary PE Curriculum Planning Resource'
    );


  title.setHeading(
    DocumentApp.ParagraphHeading.TITLE
  );


  title.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  title.editAsText()
    .setForegroundColor('#501D82')
    .setBold(true);


  var subtitle =
    body.appendParagraph(
      'Year-at-a-Glance Curriculum Map'
    );


  subtitle.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  subtitle.editAsText()
    .setFontSize(12)
    .setForegroundColor('#555555');


  var student =
    body.appendParagraph(
      cleanText_(
        data.studentName
      )
    );


  student.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  student.editAsText()
    .setFontSize(10)
    .setForegroundColor('#666666');


  body.appendParagraph('');


  /* PRIORITIES */

  appendM3Heading_(
    body,
    'Curriculum Priorities'
  );


  body.appendParagraph(
    (data.priorities || [])
      .join(' • ')
  )
  .editAsText()
  .setFontSize(10)
  .setBold(true);


  if (
    cleanText_(
      data.priorityReason
    )
  ) {

    body.appendParagraph('');


    appendM3Response_(
      body,
      'What guided my priorities',
      data.priorityReason
    );

  }


  /* YEAR MAP */

  appendM3Heading_(
    body,
    'Year-at-a-Glance'
  );


  var table =
    body.appendTable();


  var header =
    table.appendTableRow();


  var monthHeader =
    header.appendTableCell(
      'Month'
    );


  monthHeader.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82');


  var learningHeader =
    header.appendTableCell(
      'What We\'re Learning'
    );


  learningHeader.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82');


  var months =
    data.months || [];


  months.forEach(
    function(item) {

      var row =
        table.appendTableRow();


      var monthCell =
        row.appendTableCell(
          cleanText_(
            item.month
          )
        );


      monthCell.editAsText()
        .setBold(true)
        .setFontSize(10);


      var learning =
        [
          cleanText_(item.first),
          cleanText_(item.second)
        ]
        .filter(
          function(value) {
            return value;
          }
        )
        .join(' • ');


      row.appendTableCell(
        learning
      )
      .editAsText()
      .setFontSize(10);

    }
  );


  body.appendParagraph('');


  /* DECISIONS */

  appendM3Heading_(
    body,
    'Curriculum Decisions'
  );


  appendM3Response_(
    body,
    'Sequence',
    data.decisions.sequence
  );


  appendM3Response_(
    body,
    'Instructional Time',
    data.decisions.time
  );


  appendM3Response_(
    body,
    'Timing',
    data.decisions.timing
  );


  /* CURVEBALL */

  appendM3Heading_(
    body,
    'Adapting the Curriculum'
  );


  var situation =
    body.appendParagraph(
      'Situation: The gym is unavailable for three weeks because of testing and school events.'
    );


  situation.editAsText()
    .setFontSize(10)
    .setItalic(true);


  body.appendParagraph('');


  if (
    data.curveball.options &&
    data.curveball.options.length
  ) {

    appendM3Response_(
      body,
      'Options I considered',
      data.curveball.options.join(', ')
    );

  }


  appendM3Response_(
    body,
    'What I would change',
    data.curveball.change
  );


  appendM3Response_(
    body,
    'Why I would make this change',
    data.curveball.why
  );


  if (
    cleanText_(
      data.readiness
    )
  ) {

    appendM3Heading_(
      body,
      'Looking Ahead'
    );


    body.appendParagraph(
      cleanText_(
        data.readiness
      )
    )
    .editAsText()
    .setFontSize(10);

  }


  setToolkitFooter_(
    doc
  );

}


/* =========================================================
   M3 HELPERS
   ========================================================= */

function appendM3Heading_(
  body,
  text
) {

  var heading =
    body.appendParagraph(
      text
    );


  heading.setHeading(
    DocumentApp.ParagraphHeading.HEADING1
  );


  heading.editAsText()
    .setForegroundColor('#501D82')
    .setBold(true);

}


function appendM3Response_(
  body,
  label,
  response
) {

  var labelParagraph =
    body.appendParagraph(
      label
    );


  labelParagraph.editAsText()
    .setBold(true)
    .setForegroundColor('#501D82');


  body.appendParagraph(
    cleanText_(
      response
    )
  )
  .editAsText()
  .setFontSize(10);


  body.appendParagraph('');

}


function exportM3CurriculumWord() {

  var properties =
    PropertiesService
      .getUserProperties();


  var documentId =
    properties.getProperty(
      'peprof437M3DocumentId'
    );


  if (!documentId) {

    throw new Error(
      'Please save your Curriculum Planning Resource to your Toolkit before downloading a Word copy.'
    );

  }


  return exportGoogleDocAsWord_(
    documentId
  );

}


/* =========================================================
   SHARED TOOLKIT FOOTER
   ========================================================= */

function setToolkitFooter_(
  doc
) {

  var footer =
    doc.getFooter();


  if (!footer) {

    footer =
      doc.addFooter();

  }


  footer.clear();


  var footerText =
    footer.appendParagraph(
      'PEPROF 437 • Pre-Student Teaching Toolkit'
    );


  footerText.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  footerText.editAsText()
    .setFontSize(8)
    .setForegroundColor('#777777');

}


/* =========================================================
   SHARED WORD EXPORT
   ========================================================= */

function exportGoogleDocAsWord_(
  documentId
) {

  var file =
    DriveApp.getFileById(
      documentId
    );


  var exportUrl =
    'https://www.googleapis.com/drive/v3/files/' +
    documentId +
    '/export?mimeType=' +
    encodeURIComponent(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );


  var response =
    UrlFetchApp.fetch(
      exportUrl,
      {
        headers: {

          Authorization:
            'Bearer ' +
            ScriptApp.getOAuthToken()

        }
      }
    );


  var blob =
    response.getBlob();


  var wordFileName =
    file.getName() +
    '.docx';


  blob.setName(
    wordFileName
  );


  return {

    fileName:
      wordFileName,

    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    base64:
      Utilities.base64Encode(
        blob.getBytes()
      )

  };

}


/* =========================================================
   SHARED TEXT HELPER
   ========================================================= */

function cleanText_(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }


  return String(
    value
  ).trim();

}

/* HEALTHED 445 M1 pilot: student-owned Drive draft and submission */
function health445M1Folder_() {
  var props=PropertiesService.getUserProperties();
  var id=props.getProperty('health445Id');
  var course;
  if(id){try{course=DriveApp.getFolderById(id);course.getName();}catch(e){course=null;}}
  if(!course){var root=getOrCreateRootFolder_('Pre-Student Teaching Toolkit');course=getOrCreateChildFolder_(root,'HEALTHED 445');props.setProperty('health445Id',course.getId());}
  return getOrCreateChildFolder_(course,'M1 Lesson Diagnosis & Redesign');
}
function health445M1Fields_(){return [
  ['goal','Intended learning'],
  ['diagnosis','What students do and what their work reveals'],
  ['gap','What is missing from the lesson'],
  ['revision','Redesigned lesson segment and directions'],
  ['evidence','Individual evidence task and success criteria'],
  ['rationale','Why the revision supports skill application']
];}
function health445M1GetDraft(){
  var id=PropertiesService.getUserProperties().getProperty('health445M1DocId');
  if(!id)return {exists:false,fields:{}};
  try{
    var file=DriveApp.getFileById(id);file.getName();
    var doc=DocumentApp.openById(id), body=doc.getBody();
    var marker='HEALTHED445_M1_DATA:';
    var raw=body.getText();var line=raw.split('\n').filter(function(s){return s.indexOf(marker)===0;})[0];
    var fields={};
    if(line){try{fields=JSON.parse(Utilities.newBlob(Utilities.base64Decode(line.slice(marker.length))).getDataAsString());}catch(e){}}
    return {exists:true,fields:fields,url:file.getUrl(),name:file.getName()};
  }catch(e){return {exists:false,fields:{},error:'Saved draft could not be opened. Check the Google account used to create it.'};}
}
function health445M1SaveDraft(data){
  if(!data||typeof data!=='object')throw Error('No responses received.');
  var clean={};health445M1Fields_().forEach(function(f){clean[f[0]]=String(data[f[0]]||'').slice(0,25000);});
  var props=PropertiesService.getUserProperties();var id=props.getProperty('health445M1DocId');
  var doc;
  if(id){try{doc=DocumentApp.openById(id);}catch(e){doc=null;}}
  if(!doc){
    doc=DocumentApp.create('HEALTHED 445 - M1 Lesson Diagnosis & Redesign');
    var file=DriveApp.getFileById(doc.getId());file.moveTo(health445M1Folder_());
    props.setProperty('health445M1DocId',doc.getId());
  }
  var body=doc.getBody();body.clear();
  body.appendParagraph('HEALTHED 445 | M1 Lesson Diagnosis & Redesign').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Teaching Toolkit | Student working document');
  health445M1Fields_().forEach(function(f){body.appendParagraph(f[1]).setHeading(DocumentApp.ParagraphHeading.HEADING2);body.appendParagraph(clean[f[0]]||'(Not yet completed)');});
  // Structured data is kept in the student's own document to support reopening in the app.
  var encoded=Utilities.base64Encode(Utilities.newBlob(JSON.stringify(clean)).getBytes());
  var hidden=body.appendParagraph('HEALTHED445_M1_DATA:'+encoded);hidden.setFontSize(1).setForegroundColor('#ffffff');
  doc.saveAndClose();return {ok:true,url:DriveApp.getFileById(doc.getId()).getUrl()};
}
function health445M1PrepareSubmission(data,email){
  email=String(email||'').trim().toLowerCase();
  if(!/^[a-z0-9._%+\-]+@uww\.edu$/.test(email))throw Error('Enter a valid instructor @uww.edu email.');
  var required=health445M1Fields_();
  required.forEach(function(f){if(!String((data||{})[f[0]]||'').trim())throw Error('Complete all assignment sections before preparing your submission.');});
  var result=health445M1SaveDraft(data);
  var id=PropertiesService.getUserProperties().getProperty('health445M1DocId');
  var file=DriveApp.getFileById(id);
  file.addViewer(email);
  var access=file.getViewers().some(function(u){return u.getEmail().toLowerCase()===email;}) || file.getEditors().some(function(u){return u.getEmail().toLowerCase()===email;});
  if(!access)throw Error('Sharing could not be verified. Check university Drive restrictions and try again.');
  PropertiesService.getUserProperties().setProperty('health445M1Instructor',email);
  return {ok:true,url:result.url,instructor:email};
}
function health445M1Instructor(){return PropertiesService.getUserProperties().getProperty('health445M1Instructor')||'';}

var HEALTH445_MODULE_DATA_ = [{"title": "Lesson Diagnosis & Redesign", "fields": [{"id": "goal", "label": "Intended learning"}, {"id": "diagnosis", "label": "Lesson diagnosis"}, {"id": "gap", "label": "Missing evidence"}, {"id": "revision", "label": "Redesigned segment"}, {"id": "evidence", "label": "Individual evidence"}, {"id": "rationale", "label": "Reason for the change"}]}, {"title": "Needs-to-Evidence Plan", "fields": [{"id": "need", "label": "Learner need and evidence"}, {"id": "skill", "label": "Standard and health skill"}, {"id": "goal", "label": "Observable learning goal"}, {"id": "assessment", "label": "Assessment task and criteria"}, {"id": "preparation", "label": "Preparation and access"}, {"id": "revision", "label": "Alignment check and revision"}]}, {"title": "Health Skill Teaching & Practice Guide", "fields": [{"id": "model", "label": "Case A teacher model"}, {"id": "guided", "label": "Case B guided practice"}, {"id": "feedback", "label": "Feedback and revision"}, {"id": "independent", "label": "Case C individual application"}, {"id": "rationale", "label": "Method and access rationale"}, {"id": "revision", "label": "Revision note"}]}, {"title": "Classroom Management Decision Plan", "fields": [{"id": "routines", "label": "Opening and participation routines"}, {"id": "comment", "label": "Responding to a harmful comment"}, {"id": "participation", "label": "Participation without disclosure"}, {"id": "private", "label": "Private request and professional boundaries"}, {"id": "evidence", "label": "Check participation and learning"}, {"id": "revision", "label": "Management revision"}]}, {"title": "Complete Health Lesson Plan", "fields": [{"id": "goal", "label": "Lesson goal and context"}, {"id": "sequence", "label": "Lesson sequence and timing"}, {"id": "materials", "label": "Teacher and student materials"}, {"id": "assessment", "label": "Individual assessment and criteria"}, {"id": "access", "label": "Access and routines"}, {"id": "contingency", "label": "Time contingency and rationale"}]}, {"title": "Teaching Response Guide", "fields": [{"id": "observations", "label": "What the responses show"}, {"id": "checks", "label": "What you would check"}, {"id": "responses", "label": "Teaching response for A, B, and C"}, {"id": "timing", "label": "Remaining teaching time"}, {"id": "recheck", "label": "Individual recheck"}, {"id": "update", "label": "Six-minute update"}]}, {"title": "Health Skills Assessment & Revision Guide", "fields": [{"id": "criteria", "label": "Assessment criteria"}, {"id": "individual", "label": "Interpret individual work"}, {"id": "patterns", "label": "Class evidence"}, {"id": "feedback", "label": "Actionable feedback"}, {"id": "revision", "label": "Instructional revision"}, {"id": "followup", "label": "Follow-up evidence"}]}, {"title": "Reusable Health Unit Planning Template", "fields": [{"id": "goal", "label": "Unit focus and goal"}, {"id": "map", "label": "Unit sequence"}, {"id": "lesson", "label": "Revise the M5 lesson"}, {"id": "other", "label": "Connected lesson outlines"}, {"id": "evidence", "label": "Assessment and access"}, {"id": "rationale", "label": "Progression and revision rationale"}]}, {"title": "Toolkit Synthesis & Professional Reflection", "fields": [{"id": "index", "label": "Artifact index"}, {"id": "claim", "label": "Supported professional claim"}, {"id": "evidence", "label": "Evidence of revision"}, {"id": "limits", "label": "What the evidence cannot show"}, {"id": "next", "label": "Professional next step"}, {"id": "synthesis", "label": "Final synthesis"}]}];

/* HEALTHED 445 shared module workspaces: student-owned Drive files. */
function health445ModuleConfig_(module){
  var all=JSON.parse(HEALTH445_MODULE_DATA_);
  var m=Number(module);
  if(!Number.isInteger(m)||m<1||m>all.length)throw Error('Invalid module.');
  return all[m-1];
}
function health445ModuleFolder_(module){
  var props=PropertiesService.getUserProperties();
  var id=props.getProperty('health445Id');var course=null;
  if(id){try{course=DriveApp.getFolderById(id);course.getName();}catch(e){}}
  if(!course){var root=getOrCreateRootFolder_('Pre-Student Teaching Toolkit');course=getOrCreateChildFolder_(root,'HEALTHED 445');props.setProperty('health445Id',course.getId());}
  return getOrCreateChildFolder_(course,'M'+module+' '+health445ModuleConfig_(module).title);
}
function health445ModuleGetDraft(module){
  var m=Number(module);health445ModuleConfig_(m);
  if(m===1)return health445M1GetDraft();
  var props=PropertiesService.getUserProperties(),id=props.getProperty('health445M'+m+'DocId');
  if(!id)return {exists:false,fields:{}};
  try{
    var file=DriveApp.getFileById(id);file.getName();var text=DocumentApp.openById(id).getBody().getText();
    var marker='HEALTHED445_M'+m+'_DATA:';
    var line=text.split('\n').filter(function(s){return s.indexOf(marker)===0;})[0];
    var fields={};if(line){fields=JSON.parse(Utilities.newBlob(Utilities.base64Decode(line.slice(marker.length))).getDataAsString());}
    return {exists:true,fields:fields,url:file.getUrl()};
  }catch(e){throw Error('Could not reopen your saved document. Check the Google account used to save it. '+e.message);}
}
function health445ModuleSaveDraft(module,data){
  var m=Number(module),cfg=health445ModuleConfig_(m);
  if(m===1)return health445M1SaveDraft(data);
  if(!data||typeof data!=='object')throw Error('No responses received.');
  var clean={};cfg.fields.forEach(function(f){clean[f.id]=String(data[f.id]||'').slice(0,25000);});
  var props=PropertiesService.getUserProperties(),key='health445M'+m+'DocId',id=props.getProperty(key),doc=null;
  if(id){try{doc=DocumentApp.openById(id);}catch(e){throw Error('Existing draft cannot be opened. Check your Google account before saving to avoid creating a duplicate.');}}
  if(!doc){doc=DocumentApp.create('HEALTHED 445 - M'+m+' '+cfg.title);DriveApp.getFileById(doc.getId()).moveTo(health445ModuleFolder_(m));props.setProperty(key,doc.getId());}
  var body=doc.getBody();body.clear();
  body.appendParagraph('HEALTHED 445 | Module '+m+' | '+cfg.title).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Teaching Toolkit | Student working document');
  cfg.fields.forEach(function(f){body.appendParagraph(f.label).setHeading(DocumentApp.ParagraphHeading.HEADING2);body.appendParagraph(clean[f.id]||'(Not yet completed)');});
  var encoded=Utilities.base64Encode(Utilities.newBlob(JSON.stringify(clean)).getBytes());
  body.appendParagraph('HEALTHED445_M'+m+'_DATA:'+encoded).setFontSize(1).setForegroundColor('#ffffff');
  doc.saveAndClose();return {ok:true,url:DriveApp.getFileById(doc.getId()).getUrl()};
}
function health445ModulePrepareSubmission(module,data,email){
  var m=Number(module),cfg=health445ModuleConfig_(m);
  if(m===1)return health445M1PrepareSubmission(data,email);
  email=String(email||'').trim().toLowerCase();
  if(!/^[a-z0-9._%+\-]+@uww\.edu$/.test(email))throw Error('Enter a valid instructor @uww.edu email.');
  cfg.fields.forEach(function(f){if(!String((data||{})[f.id]||'').trim())throw Error('Complete the section: '+f.label);});
  var saved=health445ModuleSaveDraft(m,data);
  var id=PropertiesService.getUserProperties().getProperty('health445M'+m+'DocId'),file=DriveApp.getFileById(id);
  file.addViewer(email);
  var verified=file.getViewers().some(function(u){return u.getEmail().toLowerCase()===email;})||file.getEditors().some(function(u){return u.getEmail().toLowerCase()===email;});
  if(!verified)throw Error('Could not verify instructor access. Check university sharing restrictions.');
  PropertiesService.getUserProperties().setProperty('health445Instructor',email);
  return {ok:true,url:saved.url,instructor:email};
}
function health445ModuleInstructor(){
  return PropertiesService.getUserProperties().getProperty('health445Instructor')||health445M1Instructor();
}
