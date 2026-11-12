/**
 * Activity-Task Report Excel Generators
 *
 * Consolidated     → one sheet, all tasks, step names as generic columns
 * Non-Consolidated → Summary sheet + one sheet per ROC, step names as headers
 *                    with hyperlinks when a drawing link exists
 *
 * Colour palette (ZG brand)
 *   Header bg       : #1F4B8E  (dark navy)
 *   Header font     : #FFFFFF
 *   Sub-header bg   : #2E6DB4  (mid blue)
 *   Sub-header font : #FFFFFF
 *   Alt row 1       : #FFFFFF
 *   Alt row 2       : #F4F8FD
 *   Total row bg    : #E4EEF8  with bold font
 *   Border colour   : #C8D9EE
 *   Accent / link   : #FD4314  (ZG orange)
 */

import * as XLSX from 'xlsx';

// ─── Types ───────────────────────────────────────────────────────────────────

type ARGBHex = string; // 8-char ARGB e.g. 'FF1F4B8E'

// SheetJS Pro-style cell object helpers (community version ignores styles,
// but we still attach them so the file is style-ready for Pro / LibreOffice)
interface CellStyle {
  fill?: { patternType: 'solid'; fgColor: { rgb: ARGBHex } };
  font?: { bold?: boolean; color?: { rgb: ARGBHex }; sz?: number; name?: string };
  alignment?: { horizontal?: string; vertical?: string; wrapText?: boolean };
  border?: {
    top?: { style: string; color: { rgb: ARGBHex } };
    bottom?: { style: string; color: { rgb: ARGBHex } };
    left?: { style: string; color: { rgb: ARGBHex } };
    right?: { style: string; color: { rgb: ARGBHex } };
  };
}

// ─── Browser-safe file download helper ───────────────────────────────────────

function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' }) as string;
  const byteChars = atob(b64);
  const byteNums = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
  const blob = new Blob([byteNums], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const BORDER_THIN = { style: 'thin', color: { rgb: 'FFC8D9EE' } };
const CELL_BORDER: CellStyle['border'] = { top: BORDER_THIN, bottom: BORDER_THIN, left: BORDER_THIN, right: BORDER_THIN };

function styleCell(ws: XLSX.WorkSheet, ref: string, style: CellStyle): void {
  if (!ws[ref]) return;
  (ws[ref] as any).s = style;
}

/** Apply a style to every cell in a row (0-based rowIdx), columns 0..maxCol */
function styleRow(ws: XLSX.WorkSheet, rowIdx: number, maxCol: number, style: CellStyle): void {
  for (let c = 0; c <= maxCol; c++) {
    const ref = `${colLetter(c)}${rowIdx + 1}`;
    if (!ws[ref]) ws[ref] = { t: 's', v: '' };
    (ws[ref] as any).s = { ...style, border: CELL_BORDER };
  }
}

const STYLE_TITLE: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FF1F4B8E' } },
  font: { bold: true, color: { rgb: 'FFFFFFFF' }, sz: 14, name: 'Calibri' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_META_LABEL: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFF4F8FD' } },
  font: { bold: true, color: { rgb: 'FF1F2937' }, sz: 10, name: 'Calibri' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_META_VALUE: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFFFF' } },
  font: { bold: false, color: { rgb: 'FF374151' }, sz: 10, name: 'Calibri' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_GROUP_HEADER: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FF1F4B8E' } },
  font: { bold: true, color: { rgb: 'FFFFFFFF' }, sz: 10, name: 'Calibri' },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: CELL_BORDER,
};

const STYLE_COL_HEADER: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FF2E6DB4' } },
  font: { bold: true, color: { rgb: 'FFFFFFFF' }, sz: 10, name: 'Calibri' },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: CELL_BORDER,
};

const STYLE_COL_HEADER_LINK: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFFD4314' } },
  font: { bold: true, color: { rgb: 'FFFFFFFF' }, sz: 10, name: 'Calibri', },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: CELL_BORDER,
};

const STYLE_DATA_ODD: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFFFF' } },
  font: { sz: 10, name: 'Calibri', color: { rgb: 'FF272721' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: false },
  border: CELL_BORDER,
};

const STYLE_DATA_EVEN: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFF4F8FD' } },
  font: { sz: 10, name: 'Calibri', color: { rgb: 'FF272721' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: false },
  border: CELL_BORDER,
};

const STYLE_DATA_NUMBER: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFFFF' } },
  font: { sz: 10, name: 'Calibri', color: { rgb: 'FF272721' } },
  alignment: { horizontal: 'right', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_DATA_NUMBER_EVEN: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFF4F8FD' } },
  font: { sz: 10, name: 'Calibri', color: { rgb: 'FF272721' } },
  alignment: { horizontal: 'right', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_TOTAL: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFE4EEF8' } },
  font: { bold: true, sz: 10, name: 'Calibri', color: { rgb: 'FF1F4B8E' } },
  alignment: { horizontal: 'right', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_TOTAL_LABEL: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFE4EEF8' } },
  font: { bold: true, sz: 10, name: 'Calibri', color: { rgb: 'FF1F4B8E' } },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_PCT: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFFFF' } },
  font: { sz: 10, name: 'Calibri', color: { rgb: 'FF059669' } },
  alignment: { horizontal: 'right', vertical: 'center' },
  border: CELL_BORDER,
};

const STYLE_PCT_EVEN: CellStyle = {
  fill: { patternType: 'solid', fgColor: { rgb: 'FFF4F8FD' } },
  font: { sz: 10, name: 'Calibri', color: { rgb: 'FF059669' } },
  alignment: { horizontal: 'right', vertical: 'center' },
  border: CELL_BORDER,
};

// ─── Encode column index → Excel letter(s): 0→A, 25→Z, 26→AA … ──────────────

function colLetter(idx: number): string {
  let s = '';
  let n = idx;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

// ─── Drawing Links data — MUST stay in sync with DrawingLinks.tsx INITIAL_LINKS ─

interface DrawingLink {
  tradePackageCode: string;
  rocId: string;
  stepNumber: number;
  stepName: string;
  drawingFolderLink: string;
}

/** Single source of truth for drawing links used in reports.
 *  Mirrors DrawingLinks.tsx INITIAL_LINKS exactly. */
const DRAWING_LINKS: DrawingLink[] = [
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 1, stepName: 'Material PO Issued',    drawingFolderLink: 'https://drive.google.com/folders/S01-ROC001-STEP1' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 2, stepName: 'Material Delivered',    drawingFolderLink: 'https://drive.google.com/folders/S01-ROC001-STEP2' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 3, stepName: 'Installation',           drawingFolderLink: 'https://drive.google.com/folders/S01-ROC001-STEP3' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 4, stepName: 'Testing',                drawingFolderLink: 'https://drive.google.com/folders/S01-ROC001-STEP4' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 1, stepName: 'Material PO Issued',    drawingFolderLink: 'https://drive.google.com/folders/S02-ROC002-STEP1' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 2, stepName: 'Material Delivered',    drawingFolderLink: 'https://drive.google.com/folders/S02-ROC002-STEP2' },
  // ROC-003 and ROC-004 have no drawing links added yet
];

/** Find a drawing-link URL for a given (rocId, stepName) pair. */
function findDrawingLink(rocId: string, stepName: string): string | null {
  const hit = DRAWING_LINKS.find(
    l => l.rocId === rocId && l.stepName.toLowerCase() === stepName.toLowerCase(),
  );
  return hit ? hit.drawingFolderLink : null;
}

// ─── Task data types ──────────────────────────────────────────────────────────

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
  steps: StepDef[];
  periodStepProgress: (number | '')[];
  overallStepProgress: (number | '')[];
  periodPct: number;
  overallPct: number;
  budgetHours: number;
  approvedChangeHours: number;
  currentBudgetHours: number;
  periodEarnedHours: number;
  tillDateEarnedHours: number;
  remainingHours: number;
  budgetCost: number;
  approvedChangeCost: number;
  currentBudgetCost: number;
  periodEarnedCost: number;
  tillDateEarnedCost: number;
  remainingCost: number;
  budgetQty: number;
  periodEarnedQty: number;
  tillDateEarnedQty: number;
  remainingQty: number;
}

// ─── Mock task data — aligned with TasksListing.tsx MOCK_TASKS_DATA ───────────

export function buildMockReportData(): TaskReportRow[] {
  return [
    {
      taskId: 'A01_ARCH_SPA01_001',
      taskName: 'PCW Distribution – B1 – T1 – R1.1',
      taskDetail: 'Process/Chilled Water Distribution – Basement 1',
      p6Id: 'FO-21-001',
      rocId: 'ROC-002',          // S02 — Mechanical (matches MOCK_TASKS_DATA id:1)
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
        { name: 'Material PO Issued',   weight: 10 },
        { name: 'Material Delivered',   weight: 15 },
        { name: 'Equipment Installation', weight: 35 },
        { name: 'Commissioning',        weight: 25 },
        { name: 'Pre-start Checks',     weight: 15 },
      ],
      periodStepProgress:  [0, 0, 0.25, 0, 0, '', '', '', '', ''],
      overallStepProgress: [1, 1, 0.75, 0, 0, '', '', '', '', ''],
      periodPct: 0.0875,
      overallPct: 0.75,
      budgetHours: 480, approvedChangeHours: 0, currentBudgetHours: 480,
      periodEarnedHours: 42, tillDateEarnedHours: 360, remainingHours: 120,
      budgetCost: 38400, approvedChangeCost: 0, currentBudgetCost: 38400,
      periodEarnedCost: 3360, tillDateEarnedCost: 28800, remainingCost: 9600,
      budgetQty: 450, periodEarnedQty: 39, tillDateEarnedQty: 338, remainingQty: 112,
    },
    {
      taskId: 'B01_MEC_SPA02_001',
      taskName: 'HVAC Installation – L2 – Zone B',
      taskDetail: 'Mechanical Systems – Level 2 Office Wing',
      p6Id: 'ME-15-001',
      rocId: 'ROC-002',          // S02 — Mechanical (matches MOCK_TASKS_DATA id:2)
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
        { name: 'Material PO Issued',   weight: 10 },
        { name: 'Material Delivered',   weight: 10 },
        { name: 'Equipment Installation', weight: 35 },
        { name: 'Commissioning',        weight: 30 },
        { name: 'Pre-start Checks',     weight: 15 },
      ],
      periodStepProgress:  [0, 0, 0.45, 0, 0, '', '', '', '', ''],
      overallStepProgress: [1, 1, 0.45, 0, 0, '', '', '', '', ''],
      periodPct: 0.1575,
      overallPct: 0.45,
      budgetHours: 320, approvedChangeHours: 20, currentBudgetHours: 340,
      periodEarnedHours: 53, tillDateEarnedHours: 153, remainingHours: 187,
      budgetCost: 51200, approvedChangeCost: 3200, currentBudgetCost: 54400,
      periodEarnedCost: 8568, tillDateEarnedCost: 24480, remainingCost: 29920,
      budgetQty: 24, periodEarnedQty: 4, tillDateEarnedQty: 11, remainingQty: 13,
    },
    {
      taskId: 'A02_ELEC_SPA03_001',
      taskName: 'Electrical Conduit Routing – Ground Floor',
      taskDetail: 'Power Distribution – Ground Floor Main Lobby',
      p6Id: 'EL-08-001',
      rocId: 'ROC-003',          // E01 — Electrical (matches MOCK_TASKS_DATA id:3)
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
        { name: 'Material Delivered',    weight: 15 },
        { name: 'Containment Installed', weight: 50 },
        { name: 'Inspection Complete',   weight: 25 },
      ],
      periodStepProgress:  [0, 0, 0.1, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 1, 1,   0.9, '', '', '', '', '', ''],
      periodPct: 0.025,
      overallPct: 0.9,
      budgetHours: 560, approvedChangeHours: 0, currentBudgetHours: 560,
      periodEarnedHours: 14, tillDateEarnedHours: 504, remainingHours: 56,
      budgetCost: 44800, approvedChangeCost: 0, currentBudgetCost: 44800,
      periodEarnedCost: 1120, tillDateEarnedCost: 40320, remainingCost: 4480,
      budgetQty: 820, periodEarnedQty: 21, tillDateEarnedQty: 738, remainingQty: 82,
    },
    {
      taskId: 'C01_ARCH_SPA04_001',
      taskName: 'Drywall Installation – Conference Rooms',
      taskDetail: 'Interior Partitions – Level 3 Meeting Zone',
      p6Id: 'AR-32-001',
      rocId: 'ROC-004',          // A01 — Architectural (matches MOCK_TASKS_DATA id:4)
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
        { name: 'Area Released',     weight: 15 },
        { name: 'Finish Applied',    weight: 50 },
        { name: 'Snagging Complete', weight: 25 },
      ],
      periodStepProgress:  [0, 0.15, 0, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 0.3,  0, 0, '', '', '', '', '', ''],
      periodPct: 0.0225,
      overallPct: 0.3,
      budgetHours: 240, approvedChangeHours: 0, currentBudgetHours: 240,
      periodEarnedHours: 5, tillDateEarnedHours: 72, remainingHours: 168,
      budgetCost: 19200, approvedChangeCost: 0, currentBudgetCost: 19200,
      periodEarnedCost: 432, tillDateEarnedCost: 5760, remainingCost: 13440,
      budgetQty: 620, periodEarnedQty: 14, tillDateEarnedQty: 186, remainingQty: 434,
    },
    {
      taskId: 'A03_FIRE_SPA05_001',
      taskName: 'Fire Alarm System Testing',
      taskDetail: 'Fire Safety Systems – All Levels',
      p6Id: 'FS-09-001',
      rocId: 'ROC-001',          // S01 — Structural Steel (matches MOCK_TASKS_DATA id:5)
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
        { name: 'Installation',       weight: 40 },
        { name: 'Testing',            weight: 35 },
      ],
      periodStepProgress:  [0, 0, 0, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 1, 1, 1, '', '', '', '', '', ''],
      periodPct: 0,
      overallPct: 1,
      budgetHours: 180, approvedChangeHours: 0, currentBudgetHours: 180,
      periodEarnedHours: 0, tillDateEarnedHours: 180, remainingHours: 0,
      budgetCost: 72000, approvedChangeCost: 0, currentBudgetCost: 72000,
      periodEarnedCost: 0, tillDateEarnedCost: 72000, remainingCost: 0,
      budgetQty: 48, periodEarnedQty: 0, tillDateEarnedQty: 48, remainingQty: 0,
    },
    {
      taskId: 'B02_ARCH_SPA06_001',
      taskName: 'Suspended Ceiling Installation',
      taskDetail: 'Ceiling Systems – Ground Floor Cafeteria',
      p6Id: 'AR-45-001',
      rocId: 'ROC-004',          // A01 — Architectural (matches MOCK_TASKS_DATA id:6)
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
        { name: 'Area Released',     weight: 15 },
        { name: 'Finish Applied',    weight: 50 },
        { name: 'Snagging Complete', weight: 25 },
      ],
      periodStepProgress:  [0, 0, 0.6, 0, '', '', '', '', '', ''],
      overallStepProgress: [1, 1, 0.6, 0, '', '', '', '', '', ''],
      periodPct: 0.3,
      overallPct: 0.6,
      budgetHours: 310, approvedChangeHours: 0, currentBudgetHours: 310,
      periodEarnedHours: 93, tillDateEarnedHours: 186, remainingHours: 124,
      budgetCost: 24800, approvedChangeCost: 0, currentBudgetCost: 24800,
      periodEarnedCost: 7440, tillDateEarnedCost: 14880, remainingCost: 9920,
      budgetQty: 1240, periodEarnedQty: 372, tillDateEarnedQty: 744, remainingQty: 496,
    },
  ];
}

// ─── Percentage formatter ─────────────────────────────────────────────────────

function pct(v: number | ''): string {
  if (v === '' || v === null || v === undefined) return '';
  return `${Math.round((v as number) * 100)}%`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSOLIDATED REPORT
// ═══════════════════════════════════════════════════════════════════════════════

export function generateActivityTaskReportExcel(
  startDate: string,
  endDate: string,
  reportView: string = 'All Tasks',
  reportType: string = 'Consolidated',
): void {
  const rows = buildMockReportData();
  const dateStr = new Date().toISOString().slice(0, 10);
  const period = startDate && endDate ? `${startDate}  to  ${endDate}` : 'All Periods';

  const aoa: (string | number)[][] = [];

  // R0: Title
  aoa.push(['ACTIVITY-TASK REPORT (CONSOLIDATED)', '', '', '', '', '', '', '']);
  // R1: blank
  aoa.push([]);
  // R2–R4: meta
  aoa.push(['Reporting Period:', '', period]);
  aoa.push(['Report View:',      '', reportView]);
  aoa.push(['Report Type:',      '', reportType]);
  // R5: blank
  aoa.push([]);

  // R6: Section group headers
  const stepNameCols   = Array.from({ length: 10 }, (_, i) => `Step ${i + 1} Name (weight)`);
  const periodStepCols = Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`);
  const overallStepCols = Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`);

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

  // R7: Column headers
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

  // R8+: data rows
  for (const r of rows) {
    const steps = [...r.steps];
    while (steps.length < 10) steps.push({ name: '', weight: 0 });
    const stepNameWeightCols = steps.map(s => s.name ? `${s.name} (${s.weight}%)` : '');

    const periodProgress = [...r.periodStepProgress];
    while (periodProgress.length < 10) periodProgress.push('');
    const overallProgress = [...r.overallStepProgress];
    while (overallProgress.length < 10) overallProgress.push('');

    const mhPct   = r.currentBudgetHours > 0 ? r.tillDateEarnedHours / r.currentBudgetHours : 0;
    const costPct = r.currentBudgetCost   > 0 ? r.tillDateEarnedCost  / r.currentBudgetCost  : 0;
    const qtyPct  = r.budgetQty           > 0 ? r.tillDateEarnedQty   / r.budgetQty          : 0;

    aoa.push([
      r.taskId, r.taskName, r.taskDetail, r.p6Id, r.rocId,
      r.activityType, r.uom, r.quantityDescriptor,
      r.projectScope, r.discipline, r.tradePackage, r.subContractor,
      r.area, r.phase, r.tranche, r.deliveryPackage, r.spa,
      r.packageManager, r.costType, r.costCode,
      ...stepNameWeightCols,
      ...periodProgress.map(v => pct(v)),
      pct(r.periodPct),
      ...overallProgress.map(v => pct(v)),
      pct(r.overallPct),
      pct(mhPct),
      r.budgetHours, r.approvedChangeHours || '', r.currentBudgetHours,
      r.periodEarnedHours, r.tillDateEarnedHours, r.remainingHours,
      pct(costPct),
      r.budgetCost, r.approvedChangeCost || '', r.currentBudgetCost,
      r.periodEarnedCost, r.tillDateEarnedCost, r.remainingCost,
      pct(qtyPct),
      r.budgetQty, r.periodEarnedQty, r.tillDateEarnedQty, r.remainingQty,
    ]);
  }

  // ── Build workbook ──
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Total number of columns (0-based max)
  const totalCols = 20 + 10 + 10 + 1 + 10 + 1 + 1 + 6 + 1 + 6 + 1 + 4; // = 71
  const maxColIdx = totalCols - 1;

  // ── Apply styles ──
  styleRow(ws, 0, maxColIdx, STYLE_TITLE);
  styleRow(ws, 2, 2, STYLE_META_LABEL); styleCell(ws, 'C3', STYLE_META_VALUE);
  styleRow(ws, 3, 2, STYLE_META_LABEL); styleCell(ws, 'C4', STYLE_META_VALUE);
  styleRow(ws, 4, 2, STYLE_META_LABEL); styleCell(ws, 'C5', STYLE_META_VALUE);
  styleRow(ws, 6, maxColIdx, STYLE_GROUP_HEADER);
  styleRow(ws, 7, maxColIdx, STYLE_COL_HEADER);

  // Step columns in R7: colour those that have a drawing link (rocId per task can't
  // be determined in consolidated, so highlight step name cols with link data orange)
  // Columns 20-29 are step name cols; we highlight all that have ANY drawing link
  const linkedStepNames = new Set(DRAWING_LINKS.map(l => l.stepName.toLowerCase()));
  for (let si = 0; si < 10; si++) {
    const stepNameCol = 20 + si;
    const stepPeriodCol = 30 + si;
    const stepOverallCol = 41 + si;
    const stepNameRef = `${colLetter(stepNameCol)}8`;
    const pRef = `${colLetter(stepPeriodCol)}8`;
    const oRef = `${colLetter(stepOverallCol)}8`;
    // Check if any task has a step at index si with a drawing link
    const anyLinked = rows.some(r => {
      if (si >= r.steps.length) return false;
      return findDrawingLink(r.rocId, r.steps[si].name) !== null;
    });
    if (anyLinked) {
      if (ws[stepNameRef]) (ws[stepNameRef] as any).s = { ...STYLE_COL_HEADER_LINK, border: CELL_BORDER };
      if (ws[pRef]) (ws[pRef] as any).s = { ...STYLE_COL_HEADER_LINK, border: CELL_BORDER };
      if (ws[oRef]) (ws[oRef] as any).s = { ...STYLE_COL_HEADER_LINK, border: CELL_BORDER };
    }
  }

  // Data rows
  for (let ri = 0; ri < rows.length; ri++) {
    const wsRow = 8 + ri;
    const isEven = ri % 2 === 1;
    const baseStyle = isEven ? STYLE_DATA_EVEN : STYLE_DATA_ODD;
    const numStyle = isEven ? STYLE_DATA_NUMBER_EVEN : STYLE_DATA_NUMBER;
    const pctStyle = isEven ? STYLE_PCT_EVEN : STYLE_PCT;
    for (let c = 0; c <= maxColIdx; c++) {
      const ref = `${colLetter(c)}${wsRow + 1}`;
      if (!ws[ref]) ws[ref] = { t: 's', v: '' };
      // Numbers and % cols
      if (c >= 30) {
        (ws[ref] as any).s = { ...(c === 31 || c === 42 || c === 44 || c === 51 || c === 58 || c === 63 ? pctStyle : numStyle), border: CELL_BORDER };
      } else {
        (ws[ref] as any).s = { ...baseStyle, border: CELL_BORDER };
      }
    }

    // Add hyperlinks on step name cols (col 20-29) where drawing link exists
    const r = rows[ri];
    for (let si = 0; si < r.steps.length; si++) {
      const link = findDrawingLink(r.rocId, r.steps[si].name);
      const stepNameColRef = `${colLetter(20 + si)}${wsRow + 1}`;
      if (link && ws[stepNameColRef]) {
        ws[stepNameColRef].l = { Target: link, Tooltip: `Open drawings: ${r.steps[si].name}` };
        (ws[stepNameColRef] as any).s = {
          ...baseStyle,
          font: { ...baseStyle.font, color: { rgb: 'FF2563EB' } },
          border: CELL_BORDER,
        };
      }
    }
  }

  // ── Column widths ──
  ws['!cols'] = [
    { wch: 24 }, { wch: 40 }, { wch: 36 }, { wch: 16 }, { wch: 12 },
    { wch: 32 }, { wch: 10 }, { wch: 10 },
    { wch: 24 }, { wch: 24 }, { wch: 28 }, { wch: 28 },
    { wch: 24 }, { wch: 18 }, { wch: 16 }, { wch: 24 }, { wch: 20 },
    { wch: 22 }, { wch: 16 }, { wch: 36 },
    ...Array(10).fill({ wch: 28 }),  // step names
    ...Array(10).fill({ wch: 10 }),  // period step progress
    { wch: 12 },                     // Period % Complete
    ...Array(10).fill({ wch: 10 }),  // Overall step progress
    { wch: 12 },                     // Overall % Complete
    { wch: 14 },                     // MH %
    { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 },
    { wch: 14 },                     // Cost %
    { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
    { wch: 14 },                     // Qty %
    { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 14 },
  ];

  // ── Freeze ──
  ws['!freeze'] = { xSplit: 2, ySplit: 8 };

  // ── Merges for group header row (R6, 0-based) and title row (R0) ──
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: maxColIdx } },   // Title row
    { s: { r: 6, c: 0  }, e: { r: 6, c: 7  } },          // Task Overview (cols 0-7)
    { s: { r: 6, c: 8  }, e: { r: 6, c: 11 } },          // Scope (cols 8-11)
    { s: { r: 6, c: 12 }, e: { r: 6, c: 19 } },          // Coding Dimensions (cols 12-19)
    { s: { r: 6, c: 20 }, e: { r: 6, c: 29 } },          // Steps Definition (cols 20-29)
    { s: { r: 6, c: 30 }, e: { r: 6, c: 40 } },          // Period Step level Progress (cols 30-40 = 10 steps + Period%)
    { s: { r: 6, c: 41 }, e: { r: 6, c: 51 } },          // Overall Step level Progress (cols 41-51 = 10 steps + Overall%)
    { s: { r: 6, c: 52 }, e: { r: 6, c: 58 } },          // Manhours Overview (cols 52-58)
    { s: { r: 6, c: 59 }, e: { r: 6, c: 65 } },          // Cost Overview (cols 59-65)
    { s: { r: 6, c: 66 }, e: { r: 6, c: maxColIdx } },   // Quantity Overview (cols 66-end)
  ];

  // ── Row heights ──
  ws['!rows'] = [
    { hpx: 32 }, // R0 title
    { hpx: 6  }, // R1 blank
    { hpx: 20 }, // R2 meta
    { hpx: 20 }, // R3 meta
    { hpx: 20 }, // R4 meta
    { hpx: 6  }, // R5 blank
    { hpx: 32 }, // R6 group header
    { hpx: 40 }, // R7 col header
    ...Array(rows.length).fill({ hpx: 24 }),
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Consolidated');
  downloadWorkbook(wb, `Activity-Task-Report-Consolidated-${dateStr}.xlsx`);
}


// ═══════════════════════════════════════════════════════════════════════════════
// NON-CONSOLIDATED REPORT (Activity-wise — one sheet per ROC)
// ═══════════════════════════════════════════════════════════════════════════════

export function generateActivityTaskReportNonConsolidated(
  startDate: string,
  endDate: string,
  reportView: string = 'Period Progress Only',
): void {
  const allTasks = buildMockReportData();
  const dateStr  = new Date().toISOString().slice(0, 10);
  const period   = startDate && endDate ? `${startDate}  to  ${endDate}` : 'All Periods';

  // Group tasks by ROC
  const rocMap = new Map<string, TaskReportRow[]>();
  for (const t of allTasks) {
    if (!rocMap.has(t.rocId)) rocMap.set(t.rocId, []);
    rocMap.get(t.rocId)!.push(t);
  }

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Summary ────────────────────────────────────────────────────────
  const summaryAoa: (string | number)[][] = [
    ['ACTIVITY-TASK REPORT (ACTIVITY-WISE)', ''],
    ['', ''],
    ['Reporting Period:', period],
    ['Report View:', reportView],
    ['', ''],
    ['RoC ID', 'Activity Type', 'No. of Tasks'],
  ];
  for (const [rocId, tasks] of rocMap) {
    summaryAoa.push([rocId, tasks[0].activityType, tasks.length]);
  }

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryAoa);
  summaryWs['!cols'] = [{ wch: 16 }, { wch: 48 }, { wch: 14 }];

  // Style summary
  styleRow(summaryWs, 0, 2, STYLE_TITLE);
  styleRow(summaryWs, 2, 1, STYLE_META_LABEL); styleCell(summaryWs, 'B3', STYLE_META_VALUE);
  styleRow(summaryWs, 3, 1, STYLE_META_LABEL); styleCell(summaryWs, 'B4', STYLE_META_VALUE);
  styleRow(summaryWs, 5, 2, STYLE_COL_HEADER);
  for (let ri = 0; ri < rocMap.size; ri++) {
    const wsRow = 6 + ri;
    const style = ri % 2 === 0 ? STYLE_DATA_ODD : STYLE_DATA_EVEN;
    for (let c = 0; c <= 2; c++) {
      const ref = `${colLetter(c)}${wsRow + 1}`;
      if (!summaryWs[ref]) summaryWs[ref] = { t: 's', v: '' };
      (summaryWs[ref] as any).s = { ...style, border: CELL_BORDER };
    }
  }

  summaryWs['!rows'] = [{ hpx: 32 }, { hpx: 6 }, { hpx: 20 }, { hpx: 20 }, { hpx: 6 }, { hpx: 36 }];
  // Merge title row across all 3 cols
  summaryWs['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
  ];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // ── One sheet per ROC ───────────────────────────────────────────────────────
  for (const [rocId, tasks] of rocMap) {
    // Use the longest step list in this ROC
    let refTask = tasks[0];
    for (const t of tasks) { if (t.steps.length > refTask.steps.length) refTask = t; }
    const steps  = refTask.steps;
    const nSteps = steps.length;

    const aoa: (string | number | null)[][] = [];

    // R0–R3: ROC metadata
    aoa.push(['RoC ID',              rocId,                    ...Array(28 + nSteps).fill('')]);
    aoa.push(['Activity Type',       refTask.activityType,     ...Array(28 + nSteps).fill('')]);
    aoa.push(['Unit of Measure',     refTask.uom,              ...Array(28 + nSteps).fill('')]);
    aoa.push(['Quantity Descriptor', refTask.quantityDescriptor, ...Array(28 + nSteps).fill('')]);

    // R4: blank
    aoa.push(Array(30 + nSteps).fill(''));

    // R5: Section group header row
    const stepSpaces = Array(Math.max(nSteps - 1, 0)).fill('');
    aoa.push([
      'Task Overview', '', '', '',
      'Scope', '', '', '',
      'Coding Dimensions', '', '', '', '', '', '',
      'Step level Progress', ...stepSpaces,
      'Overall\n% Complete',
      'Manhours Overview', '', '', '', '', '', '',
      'Cost Overview', '', '', '', '', '', '',
      'Quantity Overview', '', '', '', '',
    ]);

    // R6: Column headers
    const fixedHeaders = [
      'Task ID', 'Task Name', 'Task Detail', 'P6 ID',
      'Project Scope', 'Discipline', 'Trade Package', 'Sub-Contractor',
      'AREA', 'PHASE', 'TRANCHE', 'DELIVERY PACKAGE', 'SPA', 'PACKAGE MANAGER', 'COST TYPE',
    ];
    const stepHeaders = steps.map(s => `${s.name}\n(${s.weight}%)`);
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

    // R7+: task data rows
    const taskRows: (string | number)[][] = [];
    for (const t of tasks) {
      const periodProg = t.periodStepProgress.slice(0, nSteps);
      while (periodProg.length < nSteps) periodProg.push('');

      const mhPct   = t.currentBudgetHours > 0 ? t.tillDateEarnedHours / t.currentBudgetHours : 0;
      const costPct = t.currentBudgetCost   > 0 ? t.tillDateEarnedCost  / t.currentBudgetCost  : 0;
      const qtyPct  = t.budgetQty           > 0 ? t.tillDateEarnedQty   / t.budgetQty          : 0;

      taskRows.push([
        t.taskId, t.taskName, t.taskDetail, t.p6Id,
        t.projectScope, t.discipline, t.tradePackage, t.subContractor,
        t.area, t.phase, t.tranche, t.deliveryPackage, t.spa, t.packageManager, t.costType,
        ...periodProg.map(v => pct(v)),
        pct(t.periodPct),
        pct(mhPct),
        t.budgetHours, t.approvedChangeHours || '', t.currentBudgetHours,
        t.periodEarnedHours, t.tillDateEarnedHours, t.remainingHours,
        pct(costPct),
        t.budgetCost, t.approvedChangeCost || '', t.currentBudgetCost,
        t.periodEarnedCost, t.tillDateEarnedCost, t.remainingCost,
        pct(qtyPct),
        t.budgetQty, t.periodEarnedQty, t.tillDateEarnedQty, t.remainingQty,
      ]);
    }

    // ROC TOTAL row
    const sumF = <K extends keyof TaskReportRow>(key: K) =>
      tasks.reduce((s, t) => s + (t[key] as number), 0);
    const avgPct = (vals: number[]) => vals.reduce((s, v) => s + v, 0) / (vals.length || 1);

    const stepTotals = Array.from({ length: nSteps }, (_, si) =>
      pct(avgPct(tasks.map(t => typeof t.periodStepProgress[si] === 'number' ? t.periodStepProgress[si] as number : 0)))
    );

    taskRows.push([
      'ROC TOTAL', '', '', '',
      '', '', '', '',
      '', '', '', '', '', '', '',
      ...stepTotals,
      pct(avgPct(tasks.map(t => t.periodPct))),
      pct(avgPct(tasks.map(t => t.currentBudgetHours > 0 ? t.tillDateEarnedHours / t.currentBudgetHours : 0))),
      sumF('budgetHours'), sumF('approvedChangeHours'), sumF('currentBudgetHours'),
      sumF('periodEarnedHours'), sumF('tillDateEarnedHours'), sumF('remainingHours'),
      pct(avgPct(tasks.map(t => t.currentBudgetCost > 0 ? t.tillDateEarnedCost / t.currentBudgetCost : 0))),
      sumF('budgetCost'), sumF('approvedChangeCost'), sumF('currentBudgetCost'),
      sumF('periodEarnedCost'), sumF('tillDateEarnedCost'), sumF('remainingCost'),
      pct(avgPct(tasks.map(t => t.budgetQty > 0 ? t.tillDateEarnedQty / t.budgetQty : 0))),
      sumF('budgetQty'), sumF('periodEarnedQty'), sumF('tillDateEarnedQty'), sumF('remainingQty'),
    ]);

    for (const row of taskRows) aoa.push(row);

    // ── Create worksheet ──
    const ws = XLSX.utils.aoa_to_sheet(aoa as XLSX.CellObject[][]);
    const maxCol = headerRow.length - 1;
    const totalRows = aoa.length;

    // ── Apply styles ──
    // R0–R3: metadata
    for (let ri = 0; ri <= 3; ri++) {
      styleCell(ws, `A${ri + 1}`, STYLE_META_LABEL);
      styleCell(ws, `B${ri + 1}`, STYLE_META_VALUE);
    }

    // R5: group headers
    styleRow(ws, 5, maxCol, STYLE_GROUP_HEADER);

    // R6: column headers — with drawing-link highlighting
    for (let c = 0; c <= maxCol; c++) {
      const ref = `${colLetter(c)}7`;
      if (!ws[ref]) ws[ref] = { t: 's', v: '' };
      // Step columns start at index 15
      if (c >= 15 && c < 15 + nSteps) {
        const stepIdx = c - 15;
        const link = findDrawingLink(rocId, steps[stepIdx].name);
        if (link) {
          ws[ref].l = { Target: link, Tooltip: `Open drawings: ${steps[stepIdx].name}` };
          (ws[ref] as any).s = { ...STYLE_COL_HEADER_LINK, border: CELL_BORDER };
        } else {
          (ws[ref] as any).s = { ...STYLE_COL_HEADER, border: CELL_BORDER };
        }
      } else {
        (ws[ref] as any).s = { ...STYLE_COL_HEADER, border: CELL_BORDER };
      }
    }

    // Data rows (R7 onwards, 0-based row 7 = aoa row 7)
    for (let ri = 0; ri < tasks.length; ri++) {
      const wsRow = 7 + ri; // 0-based
      const isEven = ri % 2 === 1;
      const baseStyle = isEven ? STYLE_DATA_EVEN : STYLE_DATA_ODD;
      const numStyle = isEven ? STYLE_DATA_NUMBER_EVEN : STYLE_DATA_NUMBER;
      const pctStyle = isEven ? STYLE_PCT_EVEN : STYLE_PCT;
      for (let c = 0; c <= maxCol; c++) {
        const ref = `${colLetter(c)}${wsRow + 1}`;
        if (!ws[ref]) ws[ref] = { t: 's', v: '' };
        const isNumOrPct = c >= 15;
        (ws[ref] as any).s = { ...(isNumOrPct ? (c === 15 + nSteps || c === 15 + nSteps + 2 || c === 15 + nSteps + 9 || c === 15 + nSteps + 16 ? pctStyle : numStyle) : baseStyle), border: CELL_BORDER };
      }
    }

    // Total row
    const totalRowIdx = 7 + tasks.length;
    for (let c = 0; c <= maxCol; c++) {
      const ref = `${colLetter(c)}${totalRowIdx + 1}`;
      if (!ws[ref]) ws[ref] = { t: 's', v: '' };
      (ws[ref] as any).s = { ...(c === 0 ? STYLE_TOTAL_LABEL : STYLE_TOTAL), border: CELL_BORDER };
    }

    // ── Hyperlinks on step header cells (R6, 0-based row 6) ──
    // (already done in the loop above with STYLE_COL_HEADER_LINK)

    // ── Column widths ──
    ws['!cols'] = [
      { wch: 28 }, { wch: 48 }, { wch: 36 }, { wch: 16 },
      { wch: 22 }, { wch: 22 }, { wch: 30 }, { wch: 28 },
      { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 22 }, { wch: 20 }, { wch: 22 }, { wch: 18 },
      ...Array(nSteps).fill({ wch: 24 }),
      { wch: 12 }, // Overall % Complete
      { wch: 14 }, // MH % Complete
      { wch: 12 }, { wch: 12 }, { wch: 14 },
      { wch: 14 }, { wch: 16 }, { wch: 14 },
      { wch: 14 }, // Cost % Complete
      { wch: 14 }, { wch: 12 }, { wch: 14 },
      { wch: 16 }, { wch: 16 }, { wch: 14 },
      { wch: 14 }, // Qty % Complete
      { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 14 },
    ];

    // ── Row heights ──
    ws['!rows'] = [
      { hpx: 20 }, { hpx: 20 }, { hpx: 20 }, { hpx: 20 }, // R0-R3 meta
      { hpx: 6  },              // R4 blank
      { hpx: 32 },              // R5 group header
      { hpx: 44 },              // R6 col header
      ...Array(tasks.length).fill({ hpx: 24 }),
      { hpx: 28 },              // total row
    ];

    // ── Freeze panes ──
    ws['!freeze'] = { xSplit: 2, ySplit: 7 };

    // ── Merges for group header row (R5, 0-based) ──
    // Fixed section cols: Task Overview(0-3), Scope(4-7), Coding Dims(8-14)
    // Step level Progress: 15 to 14+nSteps, Overall % Complete: 15+nSteps (single)
    // Manhours(16+nSteps to 22+nSteps), Cost(23+nSteps to 29+nSteps), Qty(30+nSteps to 34+nSteps)
    ws['!merges'] = [
      { s: { r: 5, c: 0 },             e: { r: 5, c: 3 } },                        // Task Overview
      { s: { r: 5, c: 4 },             e: { r: 5, c: 7 } },                        // Scope
      { s: { r: 5, c: 8 },             e: { r: 5, c: 14 } },                       // Coding Dimensions
      { s: { r: 5, c: 15 },            e: { r: 5, c: 14 + nSteps } },              // Step level Progress
      // Overall % Complete is a single cell — no merge needed
      { s: { r: 5, c: 16 + nSteps },   e: { r: 5, c: 22 + nSteps } },             // Manhours Overview
      { s: { r: 5, c: 23 + nSteps },   e: { r: 5, c: 29 + nSteps } },             // Cost Overview
      { s: { r: 5, c: 30 + nSteps },   e: { r: 5, c: 34 + nSteps } },             // Quantity Overview
    ];

    XLSX.utils.book_append_sheet(wb, ws, rocId.replace(/[\\\/\?\*\[\]]/g, '-'));
  }

  downloadWorkbook(wb, `Activity-Task-Report-ActivityWise-${dateStr}.xlsx`);
}
