/**
 * Activity-Task Report Excel Generators
 *
 * Consolidated  → one sheet, one row per task, step names as generic columns
 * Non-Consolidated → Summary sheet + one sheet per ROC, step names as individual
 *                    column headers with hyperlinks when a drawing link exists
 */

import * as XLSX from 'xlsx';

// ─── Drawing Links mock data (mirrors DrawingLinks.tsx INITIAL_LINKS) ─────────

interface DrawingLink {
  tradePackageCode: string;   // e.g. 'S02'
  rocId: string;              // e.g. 'ROC-002'
  stepNumber: number;
  stepName: string;
  drawingFolderLink: string;
}

const DRAWING_LINKS: DrawingLink[] = [
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 1, stepName: 'Material PO Issued',      drawingFolderLink: 'https://docs.google.com/drive/folders/s01-roc001-step1' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 2, stepName: 'Material Delivered',      drawingFolderLink: 'https://docs.google.com/drive/folders/s01-roc001-step2' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 1, stepName: 'Material PO Issued',      drawingFolderLink: 'https://docs.google.com/drive/folders/s02-roc002-step1' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 2, stepName: 'Material Delivered',      drawingFolderLink: 'https://docs.google.com/drive/folders/s02-roc002-step2' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 3, stepName: 'Equipment Installation',  drawingFolderLink: 'https://docs.google.com/drive/folders/s02-roc002-step3' },
  { tradePackageCode: 'E01', rocId: 'ROC-003', stepNumber: 1, stepName: 'Shop Drawing Approved',   drawingFolderLink: 'https://docs.google.com/drive/folders/e01-roc003-step1' },
  { tradePackageCode: 'A01', rocId: 'ROC-004', stepNumber: 2, stepName: 'Area Released',           drawingFolderLink: 'https://docs.google.com/drive/folders/a01-roc004-step2' },
];

/**
 * Find a drawing link URL for a given ROC + step name combination.
 * Matching is done on rocId + stepName (case-insensitive).
 */
function findDrawingLink(rocId: string, stepName: string): string | null {
  const hit = DRAWING_LINKS.find(
    l => l.rocId === rocId && l.stepName.toLowerCase() === stepName.toLowerCase(),
  );
  return hit ? hit.drawingFolderLink : null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface StepDef {
  name: string;
  weight: number;
}

interface TaskReportRow {
  taskId: string;
  taskName: string;
  taskDetail: string;
  p6Id: string;
  rocId: string;
  activityType: string;
  uom: string;
  quantityDescriptor: string;
  projectScope: string;
  discipline: string;
  tradePackage: string;
  subContractor: string;
  area: string;
  phase: string;
  tranche: string;
  deliveryPackage: string;
  spa: string;
  packageManager: string;
  costType: string;
  costCode: string;
  steps: StepDef[];                  // up to 10
  periodStepProgress: (number | '')[];  // up to 10 – period delta per step (0–1)
  overallStepProgress: (number | '')[];  // up to 10 – cumulative per step (0–1)
  periodPct: number;                  // overall period % complete (0–1)
  overallPct: number;                 // overall % complete (0–1)
  // Manhours
  budgetHours: number;
  approvedChangeHours: number;
  currentBudgetHours: number;
  periodEarnedHours: number;
  tillDateEarnedHours: number;
  remainingHours: number;
  // Cost
  budgetCost: number;
  approvedChangeCost: number;
  currentBudgetCost: number;
  periodEarnedCost: number;
  tillDateEarnedCost: number;
  remainingCost: number;
  // Quantity
  budgetQty: number;
  periodEarnedQty: number;
  tillDateEarnedQty: number;
  remainingQty: number;
}

// ─── Mock task data aligned with app data + drawing links ────────────────────

export function buildMockReportData(): TaskReportRow[] {
  return [
    {
      taskId: 'A01_ARCH_SPA01_001',
      taskName: 'PCW Distribution – B1 – T1 – R1.1',
      taskDetail: 'Process/Chilled Water Distribution – Basement 1',
      p6Id: 'FO-21-001',
      rocId: 'ROC-002',
      activityType: 'Process/Chilled Water Distribution',
      uom: 'LM',
      quantityDescriptor: 'Yes',
      projectScope: 'SCO-002 - Fit-Out',
      discipline: 'DISC-05 - Architectural',
      tradePackage: 'TP-01 - MEP Package 01',
      subContractor: 'SUB-01 - ABC Contractors',
      area: 'Zone A Basement Level 1',
      phase: 'PH1 - Phase 1',
      tranche: 'TR-01 - Tranche 1',
      deliveryPackage: 'DP-01 - Q1 2024 Delivery',
      spa: 'SPA-001 - SPA Package 001',
      packageManager: 'MEP - Project Manager',
      costType: 'CT-01 - Capex',
      costCode: 'BLD-A.SCO-002.DP-01.SPA-001.CT-01',
      steps: [
        { name: 'Material PO Issued', weight: 10 },
        { name: 'Material Delivered', weight: 15 },
        { name: 'Equipment Installation', weight: 35 },
        { name: 'Commissioning', weight: 25 },
        { name: 'Inspection & Handover', weight: 15 },
      ],
      periodStepProgress: [0, 0, 0.25, 0, 0, '', '', '', '', ''],
      overallStepProgress: [1, 1, 0.75, 0, 0, '', '', '', '', ''],
      periodPct: 0.0875,
      overallPct: 0.75,
      budgetHours: 480,
      approvedChangeHours: 0,
      currentBudgetHours: 480,
      periodEarnedHours: 42,
      tillDateEarnedHours: 360,
      remainingHours: 120,
      budgetCost: 38400,
      approvedChangeCost: 0,
      currentBudgetCost: 38400,
      periodEarnedCost: 3360,
      tillDateEarnedCost: 28800,
      remainingCost: 9600,
      budgetQty: 450,
      periodEarnedQty: 39,
      tillDateEarnedQty: 338,
      remainingQty: 112,
    },
    {
      taskId: 'B01_MEC_SPA02_001',
      taskName: 'HVAC Installation – L2 – Zone B',
      taskDetail: 'Mechanical Systems – Level 2 Office Wing',
      p6Id: 'ME-15-001',
      rocId: 'ROC-002',
      activityType: 'Mechanical Systems',
      uom: 'No.',
      quantityDescriptor: 'Yes',
      projectScope: 'SCO-003 - MEP Works',
      discipline: 'DISC-03 - Mechanical',
      tradePackage: 'TP-02 - MEP Package 02',
      subContractor: 'SUB-02 - BuildTech Solutions',
      area: 'Level 2 Office Wing',
      phase: 'PH1 - Phase 1',
      tranche: 'TR-02 - Tranche 2',
      deliveryPackage: 'DP-02 - Q2 2024 Delivery',
      spa: 'SPA-002 - SPA Package 002',
      packageManager: 'MEC - Project Manager',
      costType: 'CT-02 - Opex',
      costCode: 'BLD-B.SCO-003.DP-02.SPA-002.CT-02',
      steps: [
        { name: 'Material PO Issued', weight: 10 },
        { name: 'Material Delivered', weight: 10 },
        { name: 'Equipment Installation', weight: 35 },
        { name: 'Commissioning', weight: 30 },
        { name: 'Pre-start Checks', weight: 15 },
      ],
      periodStepProgress: [0, 0, 0.45, 0, 0, '', '', '', '', ''],
      overallStepProgress: [1, 1, 0.45, 0, 0, '', '', '', '', ''],
      periodPct: 0.1575,
      overallPct: 0.45,
      budgetHours: 320,
      approvedChangeHours: 20,
      currentBudgetHours: 340,
      periodEarnedHours: 53,
      tillDateEarnedHours: 153,
      remainingHours: 187,
      budgetCost: 51200,
      approvedChangeCost: 3200,
      currentBudgetCost: 54400,
      periodEarnedCost: 8568,
      tillDateEarnedCost: 24480,
      remainingCost: 29920,
      budgetQty: 24,
      periodEarnedQty: 4,
      tillDateEarnedQty: 11,
      remainingQty: 13,
    },
    {
      taskId: 'A02_ELEC_SPA03_001',
      taskName: 'Electrical Conduit Routing – Ground Floor',
      taskDetail: 'Power Distribution – Ground Floor Main Lobby',
      p6Id: 'EL-08-001',
      rocId: 'ROC-003',
      activityType: 'Power Distribution',
      uom: 'LM',
      quantityDescriptor: 'Yes',
      projectScope: 'SCO-004 - Core & Shell',
      discipline: 'DISC-04 - Electrical',
      tradePackage: 'TP-03 - Electrical Package 01',
      subContractor: 'SUB-03 - PowerGrid Electric',
      area: 'Ground Floor Main Lobby',
      phase: 'PH1 - Phase 1',
      tranche: 'TR-01 - Tranche 1',
      deliveryPackage: 'DP-03 - Q3 2024 Delivery',
      spa: 'SPA-003 - SPA Package 003',
      packageManager: 'ELEC - Project Manager',
      costType: 'CT-01 - Capex',
      costCode: 'BLD-A.SCO-004.DP-03.SPA-003.CT-01',
      steps: [
        { name: 'Shop Drawing Approved', weight: 10 },
        { name: 'Material Delivered', weight: 15 },
        { name: 'Containment Installed', weight: 50 },
        { name: 'Inspection Complete', weight: 25 },
      ],
      periodStepProgress: [0, 0, 0.1, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 1, 1, 0.9, '', '', '', '', '', ''],
      periodPct: 0.025,
      overallPct: 0.9,
      budgetHours: 560,
      approvedChangeHours: 0,
      currentBudgetHours: 560,
      periodEarnedHours: 14,
      tillDateEarnedHours: 504,
      remainingHours: 56,
      budgetCost: 44800,
      approvedChangeCost: 0,
      currentBudgetCost: 44800,
      periodEarnedCost: 1120,
      tillDateEarnedCost: 40320,
      remainingCost: 4480,
      budgetQty: 820,
      periodEarnedQty: 21,
      tillDateEarnedQty: 738,
      remainingQty: 82,
    },
    {
      taskId: 'C01_ARCH_SPA04_001',
      taskName: 'Drywall Installation – Conference Rooms',
      taskDetail: 'Interior Partitions – Level 3 Meeting Zone',
      p6Id: 'AR-32-001',
      rocId: 'ROC-004',
      activityType: 'Interior Partitions',
      uom: 'm²',
      quantityDescriptor: 'Yes',
      projectScope: 'SCO-002 - Fit-Out',
      discipline: 'DISC-05 - Architectural',
      tradePackage: 'TP-04 - Architectural Package 01',
      subContractor: 'SUB-04 - InteriorPro Ltd',
      area: 'Level 3 Meeting Zone',
      phase: 'PH1 - Phase 1',
      tranche: 'TR-03 - Tranche 3',
      deliveryPackage: 'DP-04 - Q4 2024 Delivery',
      spa: 'SPA-004 - SPA Package 004',
      packageManager: 'ARCH - Project Manager',
      costType: 'CT-01 - Capex',
      costCode: 'BLD-C.SCO-002.DP-04.SPA-004.CT-01',
      steps: [
        { name: 'Material Approved', weight: 10 },
        { name: 'Area Released', weight: 15 },
        { name: 'Finish Applied', weight: 50 },
        { name: 'Snagging Complete', weight: 25 },
      ],
      periodStepProgress: [0, 0.15, 0, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 0.3, 0, 0, '', '', '', '', '', ''],
      periodPct: 0.0225,
      overallPct: 0.3,
      budgetHours: 240,
      approvedChangeHours: 0,
      currentBudgetHours: 240,
      periodEarnedHours: 5,
      tillDateEarnedHours: 72,
      remainingHours: 168,
      budgetCost: 19200,
      approvedChangeCost: 0,
      currentBudgetCost: 19200,
      periodEarnedCost: 432,
      tillDateEarnedCost: 5760,
      remainingCost: 13440,
      budgetQty: 620,
      periodEarnedQty: 14,
      tillDateEarnedQty: 186,
      remainingQty: 434,
    },
    {
      taskId: 'A03_FIRE_SPA05_001',
      taskName: 'Fire Alarm System Testing',
      taskDetail: 'Fire Safety Systems – All Levels',
      p6Id: 'FS-09-001',
      rocId: 'ROC-001',
      activityType: 'Fire Safety Systems',
      uom: 'No.',
      quantityDescriptor: 'Yes',
      projectScope: 'SCO-005 - Testing & Commissioning',
      discipline: 'DISC-06 - Fire Protection',
      tradePackage: 'TP-05 - Fire Safety Package',
      subContractor: 'SUB-05 - SafeGuard Systems',
      area: 'All Levels',
      phase: 'PH1 - Phase 1',
      tranche: 'TR-01 - Tranche 1',
      deliveryPackage: 'DP-01 - Q1 2024 Delivery',
      spa: 'SPA-001 - SPA Package 001',
      packageManager: 'FIRE - Project Manager',
      costType: 'CT-03 - Compliance',
      costCode: 'BLD-A.SCO-005.DP-01.SPA-001.CT-03',
      steps: [
        { name: 'Material PO Issued', weight: 10 },
        { name: 'Material Delivered', weight: 15 },
        { name: 'Installation', weight: 40 },
        { name: 'Testing', weight: 35 },
      ],
      periodStepProgress: [0, 0, 0, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 1, 1, 1, '', '', '', '', '', ''],
      periodPct: 0,
      overallPct: 1,
      budgetHours: 180,
      approvedChangeHours: 0,
      currentBudgetHours: 180,
      periodEarnedHours: 0,
      tillDateEarnedHours: 180,
      remainingHours: 0,
      budgetCost: 72000,
      approvedChangeCost: 0,
      currentBudgetCost: 72000,
      periodEarnedCost: 0,
      tillDateEarnedCost: 72000,
      remainingCost: 0,
      budgetQty: 48,
      periodEarnedQty: 0,
      tillDateEarnedQty: 48,
      remainingQty: 0,
    },
    {
      taskId: 'B02_ARCH_SPA06_001',
      taskName: 'Suspended Ceiling Installation',
      taskDetail: 'Ceiling Systems – Ground Floor Cafeteria',
      p6Id: 'AR-45-001',
      rocId: 'ROC-004',
      activityType: 'Ceiling Systems',
      uom: 'm²',
      quantityDescriptor: 'Yes',
      projectScope: 'SCO-002 - Fit-Out',
      discipline: 'DISC-05 - Architectural',
      tradePackage: 'TP-04 - Architectural Package 01',
      subContractor: 'SUB-06 - CeilingExperts Co',
      area: 'Ground Floor Cafeteria',
      phase: 'PH1 - Phase 1',
      tranche: 'TR-02 - Tranche 2',
      deliveryPackage: 'DP-02 - Q2 2024 Delivery',
      spa: 'SPA-002 - SPA Package 002',
      packageManager: 'ARCH - Project Manager',
      costType: 'CT-01 - Capex',
      costCode: 'BLD-B.SCO-002.DP-02.SPA-002.CT-01',
      steps: [
        { name: 'Material Approved', weight: 10 },
        { name: 'Area Released', weight: 15 },
        { name: 'Finish Applied', weight: 50 },
        { name: 'Snagging Complete', weight: 25 },
      ],
      periodStepProgress: [0, 0, 0.6, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 1, 0.6, 0, '', '', '', '', '', ''],
      periodPct: 0.3,
      overallPct: 0.6,
      budgetHours: 310,
      approvedChangeHours: 0,
      currentBudgetHours: 310,
      periodEarnedHours: 93,
      tillDateEarnedHours: 186,
      remainingHours: 124,
      budgetCost: 24800,
      approvedChangeCost: 0,
      currentBudgetCost: 24800,
      periodEarnedCost: 7440,
      tillDateEarnedCost: 14880,
      remainingCost: 9920,
      budgetQty: 1240,
      periodEarnedQty: 372,
      tillDateEarnedQty: 744,
      remainingQty: 496,
    },
  ];
}

// ─── Main export function ────────────────────────────────────────────────────

export function generateActivityTaskReportExcel(
  startDate: string,
  endDate: string,
  reportView: string = 'Period Progress Only',
  reportType: string = 'Consolidated',
): void {
  const rows = buildMockReportData();

  const aoa: (string | number)[][] = [];

  // ── Row 0: Title ──
  aoa.push(['ACTIVITY-TASK REPORT (CONSOLIDATED)']);

  // ── Row 1: blank ──
  aoa.push([]);

  // ── Row 2–4: meta ──
  const period = startDate && endDate ? `${startDate}  to  ${endDate}` : 'All Periods';
  aoa.push(['Reporting Period:', '', period]);
  aoa.push(['Report View:', '', reportView]);
  aoa.push(['Report Type:', '', reportType]);

  // ── Row 5: blank ──
  aoa.push([]);

  // ── Row 6: Section headers (spanning cells simulated by blank cols) ──
  aoa.push([
    'Task Overview', '', '', '', '', '', '', '',
    'Scope', '', '', '',
    'Coding Dimensions', '', '', '', '', '', '', '',
    'Steps Definition', '', '', '', '', '', '', '', '', '',
    'Period Step level Progress', '', '', '', '', '', '', '', '', '',
    '',
    'Overall Step level Progress', '', '', '', '', '', '', '', '', '',
    '',
    'Manhours Overview', '', '', '', '', '', '',
    'Cost Overview', '', '', '', '', '', '',
    'Quantity Overview', '', '', '',
  ]);

  // ── Row 7: Column headers ──
  const stepNameCols = Array.from({ length: 10 }, (_, i) => `Step ${i + 1} Name (weight)`);
  const periodStepCols = Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`);
  const overallStepCols = Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`);

  aoa.push([
    'Task ID', 'Task Name', 'Task Detail', 'P6 ID', 'RoC ID',
    'Activity Type', 'Unit of Measure', 'Quantity Descriptor',
    'Project Scope', 'Discipline', 'Trade Package', 'Sub-Contractor',
    'AREA', 'PHASE', 'TRANCHE', 'DELIVERY PACKAGE', 'SPA',
    'PACKAGE MANAGER', 'COST TYPE',
    'COST CODE\n(AREA.PHASE.DELIVERY PACKAGE.SPA.COST TYPE)',
    ...stepNameCols,
    ...periodStepCols,
    'Period\n% Complete',
    ...overallStepCols,
    'Overall\n% Complete',
    'Overall Manhours\n% Complete',
    'Budget\nHours', 'Approved\nChange', 'Current Budget\nHours',
    'Period Earned\nHours', 'Till Date Earned\nHours', 'Remaining\nHours',
    'Overall Cost\n% Complete',
    'Budget\nCost', 'Approved\nChange', 'Current Budget\nCost',
    'Period Earned Cost', 'Till Date Earned\nCost', 'Remaining\nCost',
    'Overall Qty\n% Complete',
    'Budget\nQty', 'Period Earned Qty', 'Till Date Earned\nQty', 'Remaining\nQty',
  ]);

  // ── Rows 8+: data ──
  for (const r of rows) {
    // Pad steps to 10
    const steps = [...r.steps];
    while (steps.length < 10) steps.push({ name: '', weight: 0 });

    const stepNameWeightCols = steps.map(s =>
      s.name ? `${s.name} (${s.weight}%)` : '',
    );

    const periodProgress = [...r.periodStepProgress];
    while (periodProgress.length < 10) periodProgress.push('');
    const overallProgress = [...r.overallStepProgress];
    while (overallProgress.length < 10) overallProgress.push('');

    // Manhours % complete
    const mhPct = r.currentBudgetHours > 0
      ? r.tillDateEarnedHours / r.currentBudgetHours
      : 0;
    const costPct = r.currentBudgetCost > 0
      ? r.tillDateEarnedCost / r.currentBudgetCost
      : 0;
    const qtyPct = r.budgetQty > 0
      ? r.tillDateEarnedQty / r.budgetQty
      : 0;

    aoa.push([
      r.taskId, r.taskName, r.taskDetail, r.p6Id, r.rocId,
      r.activityType, r.uom, r.quantityDescriptor,
      r.projectScope, r.discipline, r.tradePackage, r.subContractor,
      r.area, r.phase, r.tranche, r.deliveryPackage, r.spa,
      r.packageManager, r.costType, r.costCode,
      ...stepNameWeightCols,
      ...periodProgress,
      r.periodPct,
      ...overallProgress,
      r.overallPct,
      mhPct,
      r.budgetHours,
      r.approvedChangeHours || '',
      r.currentBudgetHours,
      r.periodEarnedHours,
      r.tillDateEarnedHours,
      r.remainingHours,
      costPct,
      r.budgetCost,
      r.approvedChangeCost || '',
      r.currentBudgetCost,
      r.periodEarnedCost,
      r.tillDateEarnedCost,
      r.remainingCost,
      qtyPct,
      r.budgetQty,
      r.periodEarnedQty,
      r.tillDateEarnedQty,
      r.remainingQty,
    ]);
  }

  // ── Build workbook ──
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // ── Column widths ──
  const colWidths = [
    { wch: 24 }, // Task ID
    { wch: 40 }, // Task Name
    { wch: 36 }, // Task Detail
    { wch: 16 }, // P6 ID
    { wch: 12 }, // RoC ID
    { wch: 32 }, // Activity Type
    { wch: 10 }, // UOM
    { wch: 10 }, // Qty Descriptor
    { wch: 24 }, // Project Scope
    { wch: 24 }, // Discipline
    { wch: 28 }, // Trade Package
    { wch: 28 }, // Sub-Contractor
    { wch: 24 }, // AREA
    { wch: 18 }, // PHASE
    { wch: 16 }, // TRANCHE
    { wch: 24 }, // DELIVERY PACKAGE
    { wch: 20 }, // SPA
    { wch: 22 }, // PACKAGE MANAGER
    { wch: 16 }, // COST TYPE
    { wch: 36 }, // COST CODE
    ...Array(10).fill({ wch: 28 }),  // Step names
    ...Array(10).fill({ wch: 10 }),  // Period step progress
    { wch: 12 },                     // Period % Complete
    ...Array(10).fill({ wch: 10 }),  // Overall step progress
    { wch: 12 },                     // Overall % Complete
    { wch: 14 }, // MH %
    { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, // manhours
    { wch: 14 }, // Cost %
    { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, // cost
    { wch: 14 }, // Qty %
    { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 14 },              // qty
  ];
  ws['!cols'] = colWidths;

  // ── Styling: freeze header rows ──
  ws['!freeze'] = { xSplit: 2, ySplit: 8 };

  XLSX.utils.book_append_sheet(wb, ws, 'Consolidated');

  // ── Trigger download ──
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Activity-Task-Report-Consolidated-${dateStr}.xlsx`);
}


// ─── Non-Consolidated Report ─────────────────────────────────────────────────

/**
 * Encode a 0-based column index to Excel column letter(s): 0→A, 25→Z, 26→AA …
 */
function colLetter(idx: number): string {
  let s = '';
  let n = idx;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

/**
 * Generate the non-consolidated Activity-Task Report.
 *
 * Structure (matches Activity-Tasks_Report_Template_(3).xlsx):
 *   Sheet "Summary"   – title, reporting period, table of ROC IDs + activity types
 *   Sheet per ROC     – rows 0-3: ROC metadata
 *                       row 4-5: blank / section-group headers
 *                       row 6:   column headers (step names as individual columns,
 *                                with an Excel hyperlink on each step header cell
 *                                when a drawing link exists for that step)
 *                       rows 7+: task data rows
 *                       last row: ROC TOTAL
 */
export function generateActivityTaskReportNonConsolidated(
  startDate: string,
  endDate: string,
  reportView: string = 'Period Progress Only',
): void {
  const allTasks = buildMockReportData();
  const dateStr  = new Date().toISOString().slice(0, 10);
  const period   = startDate && endDate ? `${startDate}  to  ${endDate}` : 'All Periods';

  // ── Group tasks by ROC ──
  const rocMap = new Map<string, TaskReportRow[]>();
  for (const t of allTasks) {
    if (!rocMap.has(t.rocId)) rocMap.set(t.rocId, []);
    rocMap.get(t.rocId)!.push(t);
  }

  const wb = XLSX.utils.book_new();

  // ════════════════════════════════════════════════════════════
  // Sheet 1: Summary
  // ════════════════════════════════════════════════════════════
  const summaryAoa: (string | number)[][] = [];
  summaryAoa.push(['ACTIVITY-TASK REPORT', '']);
  summaryAoa.push(['', '']);
  summaryAoa.push(['Reporting Period:', period]);
  summaryAoa.push(['', '']);
  summaryAoa.push(['RoC ID', 'Activity Type']);

  for (const [rocId, tasks] of rocMap) {
    summaryAoa.push([rocId, tasks[0].activityType]);
  }

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryAoa);
  summaryWs['!cols'] = [{ wch: 16 }, { wch: 48 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // ════════════════════════════════════════════════════════════
  // One sheet per ROC
  // ════════════════════════════════════════════════════════════
  for (const [rocId, tasks] of rocMap) {
    const first = tasks[0];

    // Collect the unique ordered set of steps for this ROC
    // (use the longest step list found across all tasks in this ROC)
    let refTask = first;
    for (const t of tasks) {
      if (t.steps.length > refTask.steps.length) refTask = t;
    }
    const steps = refTask.steps;   // StepDef[]
    const nSteps = steps.length;

    // ── Build AOA ──
    const aoa: (string | number | null)[][] = [];

    // R0–R3: ROC metadata
    aoa.push(['RoC ID',             rocId,                   ...Array(28 + nSteps).fill('')]);
    aoa.push(['Activity Type',      first.activityType,      ...Array(28 + nSteps).fill('')]);
    aoa.push(['Unit of Measure',    first.uom,               ...Array(28 + nSteps).fill('')]);
    aoa.push(['Quantity Descriptor',first.quantityDescriptor,...Array(28 + nSteps).fill('')]);

    // R4–R5: blanks
    aoa.push(Array(30 + nSteps).fill(''));

    // R5: section-group header row  (matches template R5/R6 in FIA-17 sheet)
    // Fixed columns: 0-14 (15 cols), then nSteps step columns, then overall, manhours(7), cost(7), qty(5)
    const stepLevelLabel = Array(nSteps).fill('');
    aoa.push([
      'Task Overview', '', '', '', // 0-3
      'Scope', '', '', '',         // 4-7
      'Coding Dimensions', '', '', '', '', '', '', // 8-14
      'Step level Progress', ...stepLevelLabel.slice(1), // 15 … 15+nSteps-1
      'Overall\n% Complete',       // 15+nSteps
      'Manhours Overview', '', '', '', '', '', '',  // +7
      'Cost Overview', '', '', '', '', '', '',      // +7
      'Quantity Overview', '', '', '', '',          // +5
    ]);

    // R6: Column headers
    // Fixed 15 cols: Task ID, Task Name, Task Detail, P6 ID,
    //                Project Scope, Discipline, Trade Package, Sub-Contractor,
    //                AREA, PHASE, TRANCHE, DELIVERY PACKAGE, SPA, PACKAGE MANAGER, COST TYPE
    const fixedHeaders = [
      'Task ID', 'Task Name', 'Task Detail', 'P6 ID',
      'Project Scope', 'Discipline', 'Trade Package', 'Sub-Contractor',
      'AREA', 'PHASE', 'TRANCHE', 'DELIVERY PACKAGE', 'SPA', 'PACKAGE MANAGER', 'COST TYPE',
    ];
    const stepHeaders = steps.map(s => `${s.name} (${s.weight}%)`);
    const tailHeaders = [
      '',
      'Overall Manhours\n% Complete', 'Budget\nHours', 'Approved\nChange',
      'Current Budget\nHours', 'Period Earned\nHours', 'Till Date Earned\nHours', 'Remaining\nHours',
      'Overall Cost\n% Complete', 'Budget\nCost', 'Approved\nChange',
      'Current Budget\nCost', 'Period Earned Cost', 'Till Date Earned\nCost', 'Remaining\nCost',
      'Overall Qty\n% Complete', 'Budget\nQty', 'Period Earned Qty', 'Till Date Earned\nQty', 'Remaining\nQty',
    ];

    const headerRow = [...fixedHeaders, ...stepHeaders, ...tailHeaders];
    aoa.push(headerRow);

    // ── Add worksheet from AOA so far, then add hyperlinks on step header cells ──
    // We'll build the worksheet object and manually set hyperlinks on the step header cells.

    // R7+: task data rows
    const taskRows: (string | number)[][] = [];
    for (const t of tasks) {
      // Pad step progress to nSteps
      const periodProg = [...t.periodStepProgress.slice(0, nSteps)];
      while (periodProg.length < nSteps) periodProg.push('');

      const mhPct   = t.currentBudgetHours > 0 ? t.tillDateEarnedHours / t.currentBudgetHours : 0;
      const costPct = t.currentBudgetCost   > 0 ? t.tillDateEarnedCost  / t.currentBudgetCost  : 0;
      const qtyPct  = t.budgetQty           > 0 ? t.tillDateEarnedQty   / t.budgetQty          : 0;

      taskRows.push([
        t.taskId, t.taskName, t.taskDetail, t.p6Id,
        t.projectScope, t.discipline, t.tradePackage, t.subContractor,
        t.area, t.phase, t.tranche, t.deliveryPackage, t.spa, t.packageManager, t.costType,
        ...periodProg,
        t.periodPct,
        mhPct,
        t.budgetHours, t.approvedChangeHours || '', t.currentBudgetHours,
        t.periodEarnedHours, t.tillDateEarnedHours, t.remainingHours,
        costPct,
        t.budgetCost, t.approvedChangeCost || '', t.currentBudgetCost,
        t.periodEarnedCost, t.tillDateEarnedCost, t.remainingCost,
        qtyPct,
        t.budgetQty, t.periodEarnedQty, t.tillDateEarnedQty, t.remainingQty,
      ]);
    }

    // ROC TOTAL row
    const totPeriodPct  = tasks.reduce((s, t) => s + t.periodPct,  0) / tasks.length;
    const totMhPct      = tasks.reduce((s, t) => s + (t.currentBudgetHours > 0 ? t.tillDateEarnedHours / t.currentBudgetHours : 0), 0) / tasks.length;
    const totCostPct    = tasks.reduce((s, t) => s + (t.currentBudgetCost   > 0 ? t.tillDateEarnedCost  / t.currentBudgetCost  : 0), 0) / tasks.length;
    const totQtyPct     = tasks.reduce((s, t) => s + (t.budgetQty           > 0 ? t.tillDateEarnedQty   / t.budgetQty          : 0), 0) / tasks.length;
    const sum = <K extends keyof TaskReportRow>(key: K) => tasks.reduce((s, t) => s + (t[key] as number), 0);

    const stepTotals = Array.from({ length: nSteps }, (_, si) =>
      tasks.reduce((s, t) => {
        const v = t.periodStepProgress[si];
        return s + (typeof v === 'number' ? v : 0);
      }, 0) / tasks.length,
    );

    taskRows.push([
      'ROC TOTAL', '', '', '',
      '', '', '', '',
      '', '', '', '', '', '', '',
      ...stepTotals,
      totPeriodPct,
      totMhPct,
      sum('budgetHours'), sum('approvedChangeHours'), sum('currentBudgetHours'),
      sum('periodEarnedHours'), sum('tillDateEarnedHours'), sum('remainingHours'),
      totCostPct,
      sum('budgetCost'), sum('approvedChangeCost'), sum('currentBudgetCost'),
      sum('periodEarnedCost'), sum('tillDateEarnedCost'), sum('remainingCost'),
      totQtyPct,
      sum('budgetQty'), sum('periodEarnedQty'), sum('tillDateEarnedQty'), sum('remainingQty'),
    ]);

    // Push task data into AOA
    for (const row of taskRows) aoa.push(row);

    // ── Create worksheet ──
    const ws = XLSX.utils.aoa_to_sheet(aoa as XLSX.CellObject[][]);

    // ── Hyperlinks on step column headers (row index 6 = R6) ──
    // Step columns start at column index 15 (0-based)
    const headerRowIdx = 6; // 0-based row
    for (let si = 0; si < nSteps; si++) {
      const colIdx  = 15 + si;
      const cellRef = `${colLetter(colIdx)}${headerRowIdx + 1}`; // e.g. "P7"
      const link    = findDrawingLink(rocId, steps[si].name);
      if (link && ws[cellRef]) {
        ws[cellRef].l = { Target: link, Tooltip: `Open drawings: ${steps[si].name}` };
      }
    }

    // ── Column widths ──
    const colWidths = [
      { wch: 28 }, // Task ID
      { wch: 48 }, // Task Name
      { wch: 36 }, // Task Detail
      { wch: 16 }, // P6 ID
      { wch: 22 }, // Project Scope
      { wch: 22 }, // Discipline
      { wch: 30 }, // Trade Package
      { wch: 28 }, // Sub-Contractor
      { wch: 22 }, // AREA
      { wch: 16 }, // PHASE
      { wch: 16 }, // TRANCHE
      { wch: 22 }, // DELIVERY PACKAGE
      { wch: 20 }, // SPA
      { wch: 22 }, // PACKAGE MANAGER
      { wch: 18 }, // COST TYPE
      ...Array(nSteps).fill({ wch: 24 }),  // step progress columns
      { wch: 12 }, // Overall % Complete
      { wch: 14 }, // MH % Complete
      { wch: 12 }, { wch: 12 }, { wch: 14 }, // manhours budget cols
      { wch: 14 }, { wch: 16 }, { wch: 14 }, // manhours earned/remaining
      { wch: 14 }, // Cost % Complete
      { wch: 14 }, { wch: 12 }, { wch: 14 }, // cost budget cols
      { wch: 16 }, { wch: 16 }, { wch: 14 }, // cost earned/remaining
      { wch: 14 }, // Qty % Complete
      { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, // qty cols
    ];
    ws['!cols'] = colWidths;

    // ── Freeze panes: freeze row 7 (the column headers) and first 2 columns ──
    ws['!freeze'] = { xSplit: 2, ySplit: 7 };

    // ── Append sheet (sheet name = ROC ID) ──
    XLSX.utils.book_append_sheet(wb, ws, rocId.replace(/[\\\/\?\*\[\]]/g, '-'));
  }

  // ── Trigger download ──
  XLSX.writeFile(wb, `Activity-Task-Report-NonConsolidated-${dateStr}.xlsx`);
}
