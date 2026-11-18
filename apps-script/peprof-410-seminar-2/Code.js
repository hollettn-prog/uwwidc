/** PEPROF 410 — Seminar Meeting 2 collaborative board. */

const BOARD_SECTIONS = {
  checkin: ['win', 'stretch'],
  licensing: ['question', 'source'],
  evidence: ['action', 'impact', 'artifact'],
  next: ['try', 'notice', 'ask']
};

// Run setup() once from the Apps Script editor before deploying.
function setup() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty('BOARD_SHEET_ID');

  if (existingId) return existingId;

  const ss = SpreadsheetApp.create(
    'PEPROF 410 — Seminar 2 responses'
  );

  const sheet = ss.getSheets()[0];
  sheet.setName('Responses');

  sheet.appendRow([
    'Updated at',
    'Section',
    'Participant key',
    'Display name',
    'Response JSON'
  ]);

  sheet.setFrozenRows(1);
  props.setProperty('BOARD_SHEET_ID', ss.getId());

  return ss.getId();
}

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('PEPROF 410 | Midseason Check-In');
}

function sheet_() {
  const id = PropertiesService
    .getScriptProperties()
    .getProperty('BOARD_SHEET_ID');

  if (!id) {
    throw new Error(
      'The instructor needs to run setup() before using the board.'
    );
  }

  return SpreadsheetApp
    .openById(id)
    .getSheetByName('Responses');
}

function identity_(token) {
  if (
    typeof token !== 'string' ||
    !/^[a-f0-9-]{32,64}$/i.test(token)
  ) {
    throw new Error(
      'Your browser ID is missing. Refresh and try again.'
    );
  }

  return Utilities
    .computeDigest(Utilities.DigestAlgorithm.SHA_256, token)
    .map(function (x) {
      return ('0' + (x & 255).toString(16)).slice(-2);
    })
    .join('');
}

function getBoard(token) {
  const who = identity_(token);
  const sheet = sheet_();
  const count = sheet.getLastRow() - 1;

  if (count === 0) {
    return {
      sections: {},
      mine: {}
    };
  }

  const rows = sheet.getRange(2, 1, count, 5).getValues();
  const sections = {};
  const mine = {};

  rows.forEach(function (row) {
    const section = row[1];

    if (!BOARD_SECTIONS[section]) return;

    try {
      const item = {
        name: row[3],
        fields: JSON.parse(row[4]),
        updated: row[0] instanceof Date
          ? row[0].toISOString()
          : String(row[0])
      };

      if (!sections[section]) {
        sections[section] = [];
      }

      sections[section].push(item);

      if (row[2] === who) {
        mine[section] = item.fields;
      }
    } catch (error) {
      // Skip a row if its saved response cannot be read.
    }
  });

  return {
    sections: sections,
    mine: mine
  };
}

function saveResponse(input) {
  if (
    !input ||
    !Object.prototype.hasOwnProperty.call(
      BOARD_SECTIONS,
      input.section
    )
  ) {
    throw new Error('Select an activity and try again.');
  }

  const who = identity_(input.token);
  const name = String(input.name || '')
    .trim()
    .slice(0, 50);

  if (!name) {
    throw new Error('Enter a first name or nickname.');
  }

  const fields = {};

  BOARD_SECTIONS[input.section].forEach(function (key) {
    fields[key] = String(
      (input.fields || {})[key] || ''
    )
      .trim()
      .slice(0, 500);
  });

  const hasResponse = Object.keys(fields).some(function (key) {
    return Boolean(fields[key]);
  });

  if (!hasResponse) {
    throw new Error(
      'Add at least one response before posting.'
    );
  }

  const displayName =
    input.section === 'licensing' && input.anonymous
      ? 'Anonymous'
      : name;

  const payload = JSON.stringify(fields);
  const lock = LockService.getScriptLock();

  lock.waitLock(10000);

  try {
    const sheet = sheet_();
    const count = sheet.getLastRow() - 1;

    const keys = count > 0
      ? sheet.getRange(2, 2, count, 2).getValues()
      : [];

    const index = keys.findIndex(function (row) {
      return (
        row[0] === input.section &&
        row[1] === who
      );
    });

    const record = [
      new Date(),
      input.section,
      who,
      displayName,
      payload
    ];

    if (index >= 0) {
      sheet
        .getRange(index + 2, 1, 1, 5)
        .setValues([record]);
    } else {
      sheet.appendRow(record);
    }
  } finally {
    lock.releaseLock();
  }

  return getBoard(input.token);
}