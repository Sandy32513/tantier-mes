const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PROGRESS_FILE = path.join(ROOT_DIR, 'Project_Progress.md');
const SCAN_EXTENSIONS = new Set(['.js', '.html', '.ejs', '.css', '.md', '.sql', '.json']);
const SKIP_DIRECTORIES = new Set(['node_modules', '.git']);

const PROJECT_OVERVIEW = {
  systemName: 'Operon Operations Platform Suite',
  shortName: 'Operon OPS 1.0',
  version: 'Operon OPS 1.0',
  build: '2026.03',
  company: 'SS Electronics Pvt Ltd',
  techStack: 'Node.js, Express.js, MySQL, HTML, CSS, JavaScript, Chart.js'
};

const PROJECT_STRUCTURE_PATHS = [
  'controllers/',
  'models/',
  'routes/',
  'services/',
  'views/',
  'public/css/',
  'public/js/',
  'public/images/',
  'scripts/',
  'docs/'
];

const DEFAULT_NEXT_TASKS = [
  'Inventory Management module implementation',
  'Work In Process module implementation',
  'Quality Management module implementation',
  'IIoT integration pages and device workflows',
  'CMMS setup and maintenance workflows',
  'Session-based auth guard for protected routes',
  'Route coverage for remaining sidebar placeholders',
  'Stronger form validation consistency across all CRUD modules'
];

const DEFAULT_BUG_FIXES = [
  'Fixed Product Configuration route mismatches by adding legacy alias URLs',
  'Fixed branding inconsistencies across login, dashboard, footer, layout, and document titles',
  'Fixed stale OPS-related role labels in seeded UI data',
  'Fixed Product Configuration lifecycle wording by standardizing on `activate`',
  'Fixed theme inconsistency by centralizing Microsoft-style colors in a shared stylesheet'
];

const MODULE_DEFINITIONS = [
  {
    label: 'Login System',
    check: (snapshot) => snapshot.files.has('views/login.html') && contains(snapshot, 'server.js', "/login")
  },
  {
    label: 'Dashboard',
    check: (snapshot) => snapshot.files.has('views/dashboard.html')
  },
  {
    label: 'General Setup: System Configuration, Organizational Role, Custom Table Setup, Control Number Setup',
    check: (snapshot) => hasFiles(snapshot, [
      'views/systemConfig.html',
      'views/organizationRole.html',
      'views/customTables.html',
      'views/controlNumbers.html'
    ])
  },
  {
    label: 'Master Data: Employees, Customers, Item Categories, Item Subcategories, Item Master',
    check: (snapshot) => hasFiles(snapshot, [
      'views/employees.html',
      'views/customers.html',
      'views/itemCategories.html',
      'views/itemSubcategories.html',
      'views/itemMaster.html'
    ])
  },
  {
    label: 'Factory Setup: Factories, Shifts, Skills, Skillsets, Tool Groups, Tools, Equipment Groups, Equipment, Processes, Production Lines',
    check: (snapshot) => hasFiles(snapshot, [
      'views/factories.html',
      'views/shifts.html',
      'views/skills.html',
      'views/skillsets.html',
      'views/toolGroups.html',
      'views/tools.html',
      'views/equipmentGroups.html',
      'views/equipment.html',
      'views/processes.html',
      'views/productionLines.html'
    ])
  },
  {
    label: 'Factory Uploads: Tool Group Upload, Tool Upload, Equipment Group Upload, Equipment Upload',
    check: (snapshot) => hasFiles(snapshot, [
      'views/toolGroupUpload.html',
      'views/toolUpload.html',
      'views/equipmentGroupUpload.html',
      'views/equipmentUpload.html',
      'routes/uploads.js'
    ])
  },
  {
    label: 'Product Configuration: Manufacturing Route, Bill of Materials, Product Spec, Common Product Spec, Packing Spec',
    check: (snapshot) => hasFiles(snapshot, [
      'views/manufacturingRoute.html',
      'views/billOfMaterials.html',
      'views/productSpec.html',
      'views/commonProductSpec.html',
      'views/packingSpec.html',
      'routes/productConfiguration.js'
    ])
  }
];

const FEATURE_DEFINITIONS = [
  {
    label: 'User authentication with validation, redirect flow, and logout handling',
    check: (snapshot) => contains(snapshot, 'server.js', "/api/login")
  },
  {
    label: 'Shared application shell with top navbar, sidebar navigation, breadcrumbs, and fixed footer',
    check: (snapshot) => hasFiles(snapshot, ['views/layout.html', 'public/js/app.js'])
  },
  {
    label: 'Operon OPS branding refresh across login, dashboard, shared shell, view titles, docs, and startup messaging',
    check: (snapshot) => snapshot.allText.includes('Operon OPS 1.0') && snapshot.allText.includes('Operon Operations Platform Suite')
  },
  {
    label: 'Microsoft-style global theme with centralized color tokens in `public/css/theme.css`',
    check: (snapshot) => snapshot.files.has('public/css/theme.css')
  },
  {
    label: 'Reusable CRUD page renderer with search filters, modals, sorting, tables, pagination, and toasts',
    check: (snapshot) => hasFiles(snapshot, ['public/js/app.js', 'routes/apiRouter.js'])
  },
  {
    label: 'Factory upload framework using `multer` and `xlsx` for Excel/CSV preview, validation, and posting',
    check: (snapshot) => hasFiles(snapshot, [
      'routes/uploads.js',
      'controllers/uploadController.js',
      'services/excelParser.js'
    ])
  },
  {
    label: 'Product configuration revision management with copy, release, activate, archive, export, and default-version control',
    check: (snapshot) => hasFiles(snapshot, [
      'routes/productConfiguration.js',
      'controllers/productConfigController.js',
      'models/createProductConfigModel.js'
    ])
  },
  {
    label: 'Database bootstrap with auto-create, schema extension, seed data, and branding data normalization',
    check: (snapshot) => hasFiles(snapshot, ['database.js', 'scripts/setup-db.sql'])
  },
  {
    label: 'Legacy-style alias page routes preserved for key configuration pages',
    check: (snapshot) => ['ManufacturingRoute', 'BillOfMaterials', 'ProductSpec', 'CommonProductSpec', 'PackingSpec']
      .every((alias) => snapshot.serverSource.includes(`/${alias}`))
  }
];

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function hasFiles(snapshot, relativePaths) {
  return relativePaths.every((relativePath) => snapshot.files.has(relativePath));
}

function contains(snapshot, relativePath, fragment) {
  return (snapshot.contents.get(relativePath) || '').includes(fragment);
}

function walkDirectory(currentDir, results = []) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = normalizePath(path.relative(ROOT_DIR, absolutePath));

    if (entry.isDirectory()) {
      walkDirectory(absolutePath, results);
      continue;
    }

    results.push(relativePath);
  }

  return results;
}

function collectSnapshot() {
  const filePaths = walkDirectory(ROOT_DIR);
  const files = new Set(filePaths);
  const contents = new Map();
  let allText = '';

  for (const relativePath of filePaths) {
    const extension = path.extname(relativePath).toLowerCase();
    if (!SCAN_EXTENSIONS.has(extension)) {
      continue;
    }

    try {
      const content = fs.readFileSync(path.join(ROOT_DIR, relativePath), 'utf8');
      contents.set(relativePath, content);
      allText += `\n${relativePath}\n${content}\n`;
    } catch (error) {
      // Ignore non-UTF8 or transient read issues and continue the project scan.
    }
  }

  return {
    files,
    contents,
    allText,
    serverSource: contents.get('server.js') || ''
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSection(markdown, heading) {
  const pattern = new RegExp(`## ${escapeRegExp(heading)}\\n([\\s\\S]*?)(?=\\n## [^#]|$)`);
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function parseBullets(sectionText) {
  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter((line) => !/<Milestone>|<What was completed>|<Next immediate task>/i.test(line))
    .filter(Boolean);
}

function uniqueLines(lines) {
  const seen = new Set();
  const output = [];

  for (const line of lines) {
    const normalized = line.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    output.push(normalized);
  }

  return output;
}

function formatBulletSection(lines) {
  return uniqueLines(lines).map((line) => `- ${line}`).join('\n');
}

function parseDatedSections(sectionText) {
  const lines = sectionText.split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('### ')) {
      if (current) {
        current.body = current.bodyLines.join('\n').trim();
        delete current.bodyLines;
        sections.push(current);
      }

      current = {
        title: line.slice(4).trim(),
        bodyLines: []
      };
      continue;
    }

    if (current) {
      current.bodyLines.push(line);
    }
  }

  if (current) {
    current.body = current.bodyLines.join('\n').trim();
    delete current.bodyLines;
    sections.push(current);
  }

  return sections.filter((section) => section.title);
}

function formatDatedSections(sections) {
  return sections
    .map((section) => {
      const body = section.body ? `\n${section.body}` : '';
      return `### ${section.title}${body}`;
    })
    .join('\n\n')
    .trim();
}

function sanitizeProgressHistory(historyText) {
  const sections = parseDatedSections(historyText);
  const filtered = sections.filter((section) =>
    !/<Milestone>|<What was completed>|<Next immediate task>/i.test(section.body || '')
  );
  return formatDatedSections(filtered);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${formatDate(date)} ${hours}:${minutes}:${seconds}`;
}

function parseTables(sqlSource) {
  return uniqueLines(
    Array.from(
      sqlSource.matchAll(/CREATE TABLE IF NOT EXISTS\s+`?([a-zA-Z0-9_]+)`?/gi),
      (match) => match[1]
    )
  );
}

function deriveCompletedModules(snapshot) {
  return MODULE_DEFINITIONS.filter((module) => module.check(snapshot)).map((module) => module.label);
}

function deriveImplementedFeatures(snapshot) {
  return FEATURE_DEFINITIONS.filter((feature) => feature.check(snapshot)).map((feature) => feature.label);
}

function deriveProjectStructure() {
  return PROJECT_STRUCTURE_PATHS.filter((relativePath) => fs.existsSync(path.join(ROOT_DIR, relativePath)));
}

function mergeRecentChanges(existingSection, milestoneEntry, currentDate) {
  const sections = parseDatedSections(existingSection);

  if (!milestoneEntry) {
    return formatDatedSections(sections);
  }

  const todayTitle = formatDate(currentDate);
  const todayBullet = `- ${milestoneEntry.title}: ${milestoneEntry.done}`;
  let todaySection = sections.find((section) => section.title === todayTitle);

  if (!todaySection) {
    todaySection = { title: todayTitle, body: todayBullet };
    sections.unshift(todaySection);
    return formatDatedSections(sections);
  }

  const bullets = parseBullets(todaySection.body);
  if (!bullets.includes(`${milestoneEntry.title}: ${milestoneEntry.done}`)) {
    todaySection.body = formatBulletSection([`${milestoneEntry.title}: ${milestoneEntry.done}`, ...bullets]);
  }

  return formatDatedSections(sections);
}

function appendProgressHistory(existingSection, milestoneEntry, currentDate) {
  const trimmedExisting = existingSection.trim();

  if (!milestoneEntry) {
    return trimmedExisting;
  }

  const newBlock = [
    `### ${formatDateTime(currentDate)}`,
    `- Milestone: ${milestoneEntry.title}`,
    `- Done: ${milestoneEntry.done}`,
    `- Next: ${milestoneEntry.next}`
  ].join('\n');

  return trimmedExisting ? `${trimmedExisting}\n\n${newBlock}` : newBlock;
}

function mergeBugFixes(existingSection, milestoneEntry) {
  const existingItems = parseBullets(existingSection);
  const mergedItems = existingItems.length > 0 ? existingItems : DEFAULT_BUG_FIXES;

  if (milestoneEntry && /(bug|fix|issue|error|regression)/i.test(`${milestoneEntry.title} ${milestoneEntry.done}`)) {
    mergedItems.unshift(milestoneEntry.done);
  }

  return formatBulletSection(mergedItems);
}

function buildDocument(snapshot, existingDocument, milestoneEntry, currentDate) {
  const completedModules = deriveCompletedModules(snapshot);
  const implementedFeatures = deriveImplementedFeatures(snapshot);
  const databaseTables = parseTables(snapshot.contents.get('scripts/setup-db.sql') || '');
  const projectStructure = deriveProjectStructure();

  const currentNextTasks = parseBullets(getSection(existingDocument, 'Next Development Tasks'));
  const nextTasks = currentNextTasks.length > 0 ? currentNextTasks : DEFAULT_NEXT_TASKS;

  const recentChanges = mergeRecentChanges(getSection(existingDocument, 'Recent Changes'), milestoneEntry, currentDate);
  const progressHistory = appendProgressHistory(
    sanitizeProgressHistory(getSection(existingDocument, 'Progress History')),
    milestoneEntry,
    currentDate
  );
  const bugFixes = mergeBugFixes(getSection(existingDocument, 'Bug Fixes'), milestoneEntry);

  const sections = [
    '# Project Progress',
    '',
    '## Project Overview',
    `- System Name: ${PROJECT_OVERVIEW.systemName}`,
    `- Short Name: ${PROJECT_OVERVIEW.shortName}`,
    `- Version: ${PROJECT_OVERVIEW.version}`,
    `- Build: ${PROJECT_OVERVIEW.build}`,
    `- Company: ${PROJECT_OVERVIEW.company}`,
    `- Tech Stack: ${PROJECT_OVERVIEW.techStack}`,
    `- Working Path: \`${ROOT_DIR}\``,
    '',
    '## Completed Modules',
    formatBulletSection(completedModules),
    '',
    '## Implemented Features',
    formatBulletSection(implementedFeatures),
    '',
    '## Recent Changes',
    recentChanges || `### ${formatDate(currentDate)}\n- Initial project scan completed`,
    '',
    '## Database Tables',
    '```text',
    databaseTables.join('\n'),
    '```',
    '',
    '## Project Structure',
    '```text',
    projectStructure.join('\n'),
    '```',
    '',
    '## Next Development Tasks',
    formatBulletSection(nextTasks),
    '',
    '## Bug Fixes',
    bugFixes,
    '',
    '## Auto Update Process',
    '- Progress file: `Project_Progress.md`',
    '- Refresh command: `npm run progress:refresh`',
    '- Append milestone command: `npm run progress -- "<Milestone>" "<What was completed>" "<Next immediate task>"`',
    '- `server.js` triggers a silent progress refresh on startup so the summary sections stay aligned with the current repository state.',
    '- Previous history entries are preserved and new milestone entries are appended with the current date and time.',
    '',
    '## Progress History',
    progressHistory || '### No dated entries yet',
    ''
  ];

  return sections.join('\n');
}

function refreshProjectProgress(options = {}) {
  const currentDate = options.currentDate || new Date();
  const existingDocument = fs.existsSync(PROGRESS_FILE)
    ? fs.readFileSync(PROGRESS_FILE, 'utf8')
    : '';

  const snapshot = collectSnapshot();
  const nextDocument = buildDocument(
    snapshot,
    existingDocument,
    options.milestoneEntry || null,
    currentDate
  );

  fs.writeFileSync(PROGRESS_FILE, nextDocument, 'utf8');

  if (!options.silent) {
    console.log(`Project_Progress updated: ${PROGRESS_FILE}`);
  }

  return PROGRESS_FILE;
}

function parseCliArgs(argv) {
  const args = argv.filter((arg) => arg !== '--refresh');

  if (args.length === 0) {
    return { milestoneEntry: null };
  }

  if (args.length !== 3) {
    console.error('Usage: npm run progress -- "<milestone>" "<done>" "<next>"');
    console.error('       npm run progress:refresh');
    process.exit(1);
  }

  const [title, done, next] = args;
  return {
    milestoneEntry: { title, done, next }
  };
}

if (require.main === module) {
  const { milestoneEntry } = parseCliArgs(process.argv.slice(2));
  refreshProjectProgress({ milestoneEntry });
}

module.exports = {
  refreshProjectProgress
};
