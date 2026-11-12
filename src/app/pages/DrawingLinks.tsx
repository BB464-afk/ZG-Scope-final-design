import React, { useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";
import DrawingLinksImportModal from "../components/DrawingLinksImportModal";

interface DrawingLinkRecord {
  id: number;
  tradePackageCode: string;
  tradePackageName: string;
  rocId: string;
  stepNumber: number;
  stepName: string;
  drawingFolderLink: string;
  updatedBy: string;
  updatedOn: string;
}

interface StepDefinition {
  number: number;
  name: string;
}

interface RocDefinition {
  id: string;
  label: string;
  tradePackageCode: string;
  steps: StepDefinition[];
}

const TRADE_PACKAGES = [
  { value: "S01", label: "S01 — Structural Steel" },
  { value: "S02", label: "S02 — Mechanical Services" },
  { value: "E01", label: "E01 — Electrical Installation" },
  { value: "A01", label: "A01 — Architectural Finishes" },
];

const ROCS: RocDefinition[] = [
  {
    id: "ROC-001",
    label: "ROC-001 — Structural Steel Installation",
    tradePackageCode: "S01",
    steps: [
      { number: 1, name: "Material PO Issued" },
      { number: 2, name: "Material Delivered" },
      { number: 3, name: "Installation" },
      { number: 4, name: "Testing" },
    ],
  },
  {
    id: "ROC-002",
    label: "ROC-002 — Mechanical Equipment",
    tradePackageCode: "S02",
    steps: [
      { number: 1, name: "Material PO Issued" },
      { number: 2, name: "Material Delivered" },
      { number: 3, name: "Equipment Installation" },
      { number: 4, name: "Commissioning" },
    ],
  },
  {
    id: "ROC-003",
    label: "ROC-003 — Electrical Containment",
    tradePackageCode: "E01",
    steps: [
      { number: 1, name: "Shop Drawing Approved" },
      { number: 2, name: "Material Delivered" },
      { number: 3, name: "Containment Installed" },
      { number: 4, name: "Inspection Complete" },
    ],
  },
  {
    id: "ROC-004",
    label: "ROC-004 — Internal Finishes",
    tradePackageCode: "A01",
    steps: [
      { number: 1, name: "Material Approved" },
      { number: 2, name: "Area Released" },
      { number: 3, name: "Finish Applied" },
      { number: 4, name: "Snagging Complete" },
    ],
  },
];

const INITIAL_LINKS: DrawingLinkRecord[] = [
  {
    id: 1,
    tradePackageCode: "S01",
    tradePackageName: "Structural Steel",
    rocId: "ROC-001",
    stepNumber: 1,
    stepName: "Material PO Issued",
    drawingFolderLink: "https://drive.google.com/folders/S01-ROC001-STEP1",
    updatedBy: "Manali Ruchandani",
    updatedOn: "03/11/2026 10:10 AM",
  },
  {
    id: 2,
    tradePackageCode: "S01",
    tradePackageName: "Structural Steel",
    rocId: "ROC-001",
    stepNumber: 2,
    stepName: "Material Delivered",
    drawingFolderLink: "https://drive.google.com/folders/S01-ROC001-STEP2",
    updatedBy: "Bhoomi Barot",
    updatedOn: "03/11/2026 10:11 AM",
  },
  {
    id: 3,
    tradePackageCode: "S01",
    tradePackageName: "Structural Steel",
    rocId: "ROC-001",
    stepNumber: 3,
    stepName: "Installation",
    drawingFolderLink: "https://drive.google.com/folders/S01-ROC001-STEP3",
    updatedBy: "Manali Ruchandani",
    updatedOn: "03/11/2026 10:12 AM",
  },
  {
    id: 4,
    tradePackageCode: "S01",
    tradePackageName: "Structural Steel",
    rocId: "ROC-001",
    stepNumber: 4,
    stepName: "Testing",
    drawingFolderLink: "https://drive.google.com/folders/S01-ROC001-STEP4",
    updatedBy: "Bhoomi Barot",
    updatedOn: "03/11/2026 10:13 AM",
  },
  {
    id: 5,
    tradePackageCode: "S02",
    tradePackageName: "Mechanical Services",
    rocId: "ROC-002",
    stepNumber: 1,
    stepName: "Material PO Issued",
    drawingFolderLink: "https://drive.google.com/folders/S02-ROC002-STEP1",
    updatedBy: "Manali Ruchandani",
    updatedOn: "03/11/2026 10:14 AM",
  },
  {
    id: 6,
    tradePackageCode: "S02",
    tradePackageName: "Mechanical Services",
    rocId: "ROC-002",
    stepNumber: 2,
    stepName: "Material Delivered",
    drawingFolderLink: "https://drive.google.com/folders/S02-ROC002-STEP2",
    updatedBy: "Bhoomi Barot",
    updatedOn: "03/11/2026 10:15 AM",
  },
];

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function SearchableSelect({
  options,
  value,
  placeholder,
  disabled = false,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 12px",
          border: "1px solid #D8DEE8",
          borderRadius: "4px",
          backgroundColor: disabled ? "#F3F4F6" : "#FFFFFF",
          color: selected ? "#1F2937" : "#6B7280",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: 400,
        }}
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown size={16} />
      </button>
      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "44px",
            left: 0,
            right: 0,
            zIndex: 20,
            border: "1px solid #D8DEE8",
            borderRadius: "4px",
            backgroundColor: "#FFFFFF",
            padding: "8px",
          }}
        >
          <div
            style={{
              height: "36px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #D8DEE8",
              borderRadius: "4px",
              padding: "0 10px",
              marginBottom: "6px",
            }}
          >
            <Search size={15} color="#6B7280" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "13px",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div style={{ maxHeight: "160px", overflowY: "auto" }}>
            {filteredOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  width: "100%",
                  minHeight: "36px",
                  border: "none",
                  backgroundColor: option.value === value ? "#E4EEFE" : "#FFFFFF",
                  color: "#1F2937",
                  padding: "8px 10px",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: 400,
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div style={{ padding: "12px", color: "#6B7280", fontSize: "13px" }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DrawingLinks() {
  const { projectId } = useParams();
  const importInputRef = useRef<HTMLInputElement>(null);
  const isProjectReadOnly = projectId === "5";
  const [records, setRecords] = useState(INITIAL_LINKS);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedTradePackage, setSelectedTradePackage] = useState("");
  const [selectedRoc, setSelectedRoc] = useState("");
  const [stepLinks, setStepLinks] = useState<Record<number, string>>({});
  const [searches, setSearches] = useState({
    tradePackage: "",
    rocId: "",
    stepNumber: "",
    stepName: "",
    link: "",
    updatedBy: "",
    updatedOn: "",
  });

  const selectedRocDefinition = ROCS.find((roc) => roc.id === selectedRoc);
  const availableRocs = ROCS.filter(
    (roc) => !selectedTradePackage || roc.tradePackageCode === selectedTradePackage,
  );

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          `${record.tradePackageCode} ${record.tradePackageName}`
            .toLowerCase()
            .includes(searches.tradePackage.toLowerCase()) &&
          record.rocId.toLowerCase().includes(searches.rocId.toLowerCase()) &&
          String(record.stepNumber).includes(searches.stepNumber) &&
          record.stepName.toLowerCase().includes(searches.stepName.toLowerCase()) &&
          record.drawingFolderLink.toLowerCase().includes(searches.link.toLowerCase()) &&
          record.updatedBy.toLowerCase().includes(searches.updatedBy.toLowerCase()) &&
          record.updatedOn.toLowerCase().includes(searches.updatedOn.toLowerCase()),
      ),
    [records, searches],
  );

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setSelectedTradePackage("");
    setSelectedRoc("");
    setStepLinks({});
  };

  const openAddModal = () => {
    if (isProjectReadOnly) return;
    setEditingId(null);
    setSelectedTradePackage("");
    setSelectedRoc("");
    setStepLinks({});
    setShowModal(true);
  };

  const openEditModal = (record: DrawingLinkRecord) => {
    if (isProjectReadOnly) return;
    setEditingId(record.id);
    setSelectedTradePackage(record.tradePackageCode);
    setSelectedRoc(record.rocId);
    setStepLinks({ [record.stepNumber]: record.drawingFolderLink });
    setShowModal(true);
  };

  const existingLinkForStep = (stepNumber: number) =>
    records.find(
      (record) =>
        record.tradePackageCode === selectedTradePackage &&
        record.rocId === selectedRoc &&
        record.stepNumber === stepNumber &&
        record.id !== editingId,
    )?.drawingFolderLink;

  const saveLinks = () => {
    if (!selectedTradePackage || !selectedRoc || !selectedRocDefinition) {
      toast.error("Select a trade package and ROC ID");
      return;
    }

    const enteredSteps = selectedRocDefinition.steps.filter(
      (step) => stepLinks[step.number]?.trim() && !existingLinkForStep(step.number),
    );
    if (enteredSteps.length === 0) {
      toast.error("Add a drawing folder link for at least one available step");
      return;
    }

    if (editingId !== null) {
      const editedStep = enteredSteps[0];
      setRecords((current) =>
        current.map((record) =>
          record.id === editingId
            ? {
                ...record,
                drawingFolderLink: stepLinks[editedStep.number].trim(),
                updatedBy: "Manali Ruchandani",
                updatedOn: "Today, 11:42 AM",
              }
            : record,
        ),
      );
      toast.success("Drawing link updated");
    } else {
      const tradePackage = TRADE_PACKAGES.find(
        (item) => item.value === selectedTradePackage,
      );
      setRecords((current) => [
        ...current,
        ...enteredSteps.map((step, index) => ({
          id: Math.max(0, ...current.map((record) => record.id)) + index + 1,
          tradePackageCode: selectedTradePackage,
          tradePackageName: tradePackage?.label.split(" — ")[1] || "",
          rocId: selectedRoc,
          stepNumber: step.number,
          stepName: step.name,
          drawingFolderLink: stepLinks[step.number].trim(),
          updatedBy: "Manali Ruchandani",
          updatedOn: "Today, 11:42 AM",
        })),
      ]);
      toast.success(
        `${enteredSteps.length} drawing link${enteredSteps.length > 1 ? "s" : ""} added`,
      );
    }
    closeModal();
  };

  const deleteLink = (record: DrawingLinkRecord) => {
    if (isProjectReadOnly) return;
    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success(`Drawing link for ${record.stepName} deleted`);
  };

  const downloadCsv = (filename: string, rows: string[][]) => {
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // Browser-safe xlsx download via base64 → Blob
  const xlsxDownload = async (
    sheets: { name: string; aoa: (string | number)[][]; cols?: { wch: number }[] }[],
    filename: string,
  ) => {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    for (const s of sheets) {
      const ws = XLSX.utils.aoa_to_sheet(s.aoa);
      if (s.cols) ws['!cols'] = s.cols;
      XLSX.utils.book_append_sheet(wb, ws, s.name);
    }
    const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' }) as string;
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    height: "28px",
    border: "1px solid #D1D5DB",
    borderRadius: "3px",
    padding: "0 8px",
    fontSize: "12px",
    outline: "none",
  };

  const actionButtonStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    border: "1px solid #D8DEE8",
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5F6B7A",
    cursor: "pointer",
  };

  const setSearch = (key: keyof typeof searches, value: string) =>
    setSearches((current) => ({ ...current, [key]: value }));

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#F7F9FC",
        padding: "24px 32px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "20px",
              lineHeight: "30px",
              fontWeight: 600,
              color: "#1F2937",
            }}
          >
            Drawing Links
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>
            Manage drawing folder links for project ROC steps
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            title="Download Template"
            onClick={async () => {
              try {
                const dateStr = new Date().toISOString().slice(0, 10);
                await xlsxDownload([
                  {
                    name: 'Instructions',
                    aoa: [
                      [''],
                      ['Drawing Links Import Template – Instructions'],
                      ['Do not modify the sheet name or column headers.'],
                      ['Fill data only in the DrawingLinks_Import sheet.'],
                      ['Fields marked with * are mandatory.'],
                      ['Trade Package Code is required (e.g. S01, E01, A01).'],
                      ['ROC ID is required (e.g. ROC-001).'],
                      ['Step Number is required and must be a positive integer.'],
                      ['Step Name is required (e.g. Material PO Issued).'],
                      ['Drawing Folder Link is required and must be a valid URL.'],
                      ['Duplicate Trade Package Code + ROC ID + Step Number combinations are not allowed.'],
                      ['Import supports new record creation only.'],
                      ['Upload only .xlsx format.'],
                      ['After upload, the system will show row-level preview results.'],
                    ],
                    cols: [{ wch: 80 }],
                  },
                  {
                    name: 'DrawingLinks_Import',
                    aoa: [
                      ['Required. Trade Package Code (e.g. S01).','Required. ROC ID (e.g. ROC-001).','Required. Positive integer (e.g. 1).','Required. Step name (e.g. Material PO Issued).','Required. Full URL to drawing folder.'],
                      ['Trade Package Code*','ROC ID*','Step Number*','Step Name*','Drawing Folder Link*'],
                      ['S01','ROC-001',1,'Material PO Issued','https://drive.google.com/drive/folders/sample-s01-roc001-step1'],
                      ['S01','ROC-001',2,'Material Delivered','https://drive.google.com/drive/folders/sample-s01-roc001-step2'],
                      ['S02','ROC-002',1,'Material PO Issued','https://drive.google.com/drive/folders/sample-s02-roc002-step1'],
                      ['S02','ROC-002',2,'Equipment Installation','https://drive.google.com/drive/folders/sample-s02-roc002-step2'],
                      ['E01','ROC-003',1,'Shop Drawing Approved','https://drive.google.com/drive/folders/sample-e01-roc003-step1'],
                      ['A01','ROC-004',2,'Area Released','https://drive.google.com/drive/folders/sample-a01-roc004-step2'],
                    ],
                    cols: [{ wch: 24 },{ wch: 16 },{ wch: 14 },{ wch: 32 },{ wch: 60 }],
                  },
                ], `Drawing-Links-Import-Template-${dateStr}.xlsx`);
                toast.success("Drawing Links import template downloaded");
              } catch {
                toast.error("Failed to download template");
              }
            }}
            style={actionButtonStyle}
          >
            <Download size={16} />
          </button>
          <button
            title="Import From Excel"
            disabled={isProjectReadOnly}
            onClick={() => !isProjectReadOnly && setShowImportModal(true)}
            style={{
              ...actionButtonStyle,
              opacity: isProjectReadOnly ? 0.5 : 1,
              cursor: isProjectReadOnly ? "not-allowed" : "pointer",
            }}
          >
            <Upload size={16} />
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) toast.success(`${file.name} is ready for import preview`);
              event.target.value = "";
            }}
          />
          <button
            title="Export To Excel"
            onClick={async () => {
              try {
                const dateStr = new Date().toISOString().slice(0, 10);
                await xlsxDownload([
                  {
                    name: 'Drawing Links',
                    aoa: [
                      ['Trade Package Code','ROC ID','Step Number','Step Name','Drawing Folder Link','Updated By','Updated On'],
                      ...records.map(r => [
                        r.tradePackageCode,
                        r.rocId,
                        r.stepNumber,
                        r.stepName,
                        r.drawingFolderLink,
                        r.updatedBy,
                        r.updatedOn,
                      ]),
                    ],
                    cols: [{ wch: 20 },{ wch: 12 },{ wch: 12 },{ wch: 32 },{ wch: 60 },{ wch: 20 },{ wch: 14 }],
                  },
                ], `Drawing-Links-Export-${dateStr}.xlsx`);
                toast.success("Drawing links exported to Excel");
              } catch {
                toast.error("Failed to export");
              }
            }}
            style={{ ...actionButtonStyle, marginRight: "8px" }}
          >
            <FileSpreadsheet size={16} />
          </button>
          <button
            onClick={openAddModal}
            disabled={isProjectReadOnly}
            style={{
              height: "40px",
              padding: "0 20px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: isProjectReadOnly ? "#E5E7EB" : "#FD4314",
              color: isProjectReadOnly ? "#9CA3AF" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: isProjectReadOnly ? "not-allowed" : "pointer",
            }}
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #C8D9EE",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "1080px",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ height: "48px", backgroundColor: "#E4EEFE" }}>
                {[
                  ["Trade Package", "170px"],
                  ["ROC ID", "115px"],
                  ["Step No.", "85px"],
                  ["Step Name", "170px"],
                  ["Drawing Folder Link", "260px"],
                  ["Updated By", "150px"],
                  ["Updated On", "145px"],
                  ["Actions", "105px"],
                ].map(([label, width]) => (
                  <th
                    key={label}
                    style={{
                      width,
                      padding: "0 12px",
                      textAlign: "left",
                      borderBottom: "1px solid #C8D9EE",
                      color: "#272721",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
              <tr style={{ height: "44px", backgroundColor: "#FAFBFC" }}>
                {(
                  [
                    ["tradePackage", "Search Trade Package"],
                    ["rocId", "Search ROC ID"],
                    ["stepNumber", "Search Step"],
                    ["stepName", "Search Step Name"],
                    ["link", "Search Link"],
                    ["updatedBy", "Search User"],
                    ["updatedOn", "Search Date"],
                  ] as [keyof typeof searches, string][]
                ).map(([key, placeholder]) => (
                  <th
                    key={key}
                    style={{ padding: "7px 8px", borderBottom: "1px solid #D8DEE8" }}
                  >
                    <input
                      value={searches[key]}
                      onChange={(event) => setSearch(key, event.target.value)}
                      placeholder={placeholder}
                      style={fieldStyle}
                    />
                  </th>
                ))}
                <th style={{ borderBottom: "1px solid #D8DEE8" }} />
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr
                  key={record.id}
                  style={{
                    height: "52px",
                    backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F4F8FD",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <td style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                    <div style={{ fontWeight: 500 }}>{record.tradePackageCode}</div>
                    <div style={{ color: "#6B7280", fontSize: "11px", marginTop: "2px" }}>
                      {record.tradePackageName}
                    </div>
                  </td>
                  <td style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                    {record.rocId}
                  </td>
                  <td style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                    {record.stepNumber}
                  </td>
                  <td style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                    {record.stepName}
                  </td>
                  <td style={{ padding: "0 12px", fontSize: "13px" }}>
                    <a
                      href={record.drawingFolderLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#2563EB",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {record.drawingFolderLink}
                      </span>
                      <ExternalLink size={13} style={{ flexShrink: 0 }} />
                    </a>
                  </td>
                  <td style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                    {record.updatedBy}
                  </td>
                  <td style={{ padding: "0 12px", fontSize: "12px", color: "#374151" }}>
                    {record.updatedOn}
                  </td>
                  <td style={{ padding: "0 12px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        title="Edit Link"
                        disabled={isProjectReadOnly}
                        onClick={() => openEditModal(record)}
                        style={{
                          ...actionButtonStyle,
                          width: "30px",
                          height: "30px",
                          opacity: isProjectReadOnly ? 0.45 : 1,
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Delete Link"
                        disabled={isProjectReadOnly}
                        onClick={() => deleteLink(record)}
                        style={{
                          ...actionButtonStyle,
                          width: "30px",
                          height: "30px",
                          color: "#DC2626",
                          opacity: isProjectReadOnly ? 0.45 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr style={{ height: "104px" }}>
                  <td colSpan={8} style={{ textAlign: "center", color: "#6B7280", fontSize: "13px" }}>
                    No drawing links match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            height: "52px",
            padding: "0 16px",
            borderTop: "1px solid #D8DEE8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#6B7280",
            fontSize: "13px",
          }}
        >
          <span>
            Showing {filteredRecords.length === 0 ? 0 : 1}–{filteredRecords.length} of{" "}
            {filteredRecords.length} records
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button disabled style={{ ...actionButtonStyle, width: "30px", height: "30px", opacity: 0.45 }}>
              <ChevronLeft size={15} />
            </button>
            <span
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#FD4314",
                color: "#FFFFFF",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
              }}
            >
              1
            </span>
            <button disabled style={{ ...actionButtonStyle, width: "30px", height: "30px", opacity: 0.45 }}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          onMouseDown={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(17, 24, 39, 0.52)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              width: "720px",
              maxHeight: "820px",
              overflow: "visible",
              backgroundColor: "#FFFFFF",
              border: "1px solid #D8DEE8",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                height: "64px",
                padding: "0 24px",
                borderBottom: "1px solid #D8DEE8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#1F2937", fontSize: "18px", fontWeight: 600 }}>
                  {editingId !== null ? "Edit Drawing Link" : "Add Drawing Link"}
                </h2>
                <p style={{ margin: "2px 0 0", color: "#6B7280", fontSize: "12px" }}>
                  Link project drawings to the relevant ROC steps
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#6B7280",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={19} />
              </button>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "8px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#272721",
                      marginBottom: "6px",
                    }}
                  >
                    Trade Package (SCode) <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <SearchableSelect
                    options={TRADE_PACKAGES}
                    value={selectedTradePackage}
                    disabled={editingId !== null}
                    placeholder="Select Trade Package"
                    onChange={(value) => {
                      setSelectedTradePackage(value);
                      setSelectedRoc("");
                      setStepLinks({});
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#272721",
                      marginBottom: "6px",
                    }}
                  >
                    ROC ID <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <SearchableSelect
                    options={availableRocs.map((roc) => ({ value: roc.id, label: roc.label }))}
                    value={selectedRoc}
                    disabled={!selectedTradePackage || editingId !== null}
                    placeholder="Select ROC"
                    onChange={(value) => {
                      setSelectedRoc(value);
                      setStepLinks({});
                    }}
                  />
                </div>
              </div>
              <p style={{ margin: "0 0 18px", fontSize: "12px", color: "#6B7280" }}>
                Only ROCs selected in this project are listed.
              </p>

              <div style={{ marginBottom: "8px" }}>
                <h3 style={{ margin: 0, color: "#1F2937", fontSize: "14px", fontWeight: 600 }}>
                  ROC Steps
                </h3>
                <p style={{ margin: "3px 0 10px", color: "#6B7280", fontSize: "12px" }}>
                  Existing links are read-only. Add links only for available steps.
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #C8D9EE",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "42px",
                    display: "grid",
                    gridTemplateColumns: "90px 190px 1fr",
                    alignItems: "center",
                    backgroundColor: "#E4EEFE",
                    borderBottom: "1px solid #C8D9EE",
                    color: "#272721",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ padding: "0 12px" }}>Step No.</div>
                  <div style={{ padding: "0 12px" }}>Step Name</div>
                  <div style={{ padding: "0 12px" }}>Drawing Folder Link</div>
                </div>
                {!selectedRocDefinition ? (
                  <div
                    style={{
                      height: "104px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6B7280",
                      fontSize: "13px",
                    }}
                  >
                    Select a trade package and ROC ID to view steps.
                  </div>
                ) : (
                  selectedRocDefinition.steps.map((step, index) => {
                    const existingLink = existingLinkForStep(step.number);
                    const isEditable =
                      !existingLink && (editingId === null || stepLinks[step.number] !== undefined);
                    return (
                      <div
                        key={step.number}
                        style={{
                          minHeight: "58px",
                          display: "grid",
                          gridTemplateColumns: "90px 190px 1fr",
                          alignItems: "center",
                          backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F4F8FD",
                          borderBottom:
                            index < selectedRocDefinition.steps.length - 1
                              ? "1px solid #E5E7EB"
                              : "none",
                        }}
                      >
                        <div style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                          {step.number}
                        </div>
                        <div style={{ padding: "0 12px", fontSize: "13px", color: "#1F2937" }}>
                          {step.name}
                        </div>
                        <div style={{ padding: "8px 12px" }}>
                          {isEditable ? (
                            <div style={{ position: "relative" }}>
                              <Link2
                                size={15}
                                style={{
                                  position: "absolute",
                                  left: "10px",
                                  top: "10px",
                                  color: "#6B7280",
                                }}
                              />
                              <input
                                type="url"
                                value={stepLinks[step.number] || ""}
                                onChange={(event) =>
                                  setStepLinks((current) => ({
                                    ...current,
                                    [step.number]: event.target.value,
                                  }))
                                }
                                placeholder="Paste drawing folder URL"
                                style={{
                                  width: "100%",
                                  height: "36px",
                                  border: "1px solid #D8DEE8",
                                  borderRadius: "4px",
                                  padding: "0 10px 0 34px",
                                  fontSize: "13px",
                                  outline: "none",
                                }}
                              />
                            </div>
                          ) : existingLink ? (
                            <a
                              href={existingLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#2563EB",
                                fontSize: "12px",
                                textDecoration: "none",
                              }}
                            >
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {existingLink}
                              </span>
                              <ExternalLink size={13} style={{ flexShrink: 0 }} />
                            </a>
                          ) : (
                            <span style={{ color: "#9CA3AF", fontSize: "12px" }}>
                              Not available for editing
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div
              style={{
                height: "72px",
                padding: "0 24px",
                borderTop: "1px solid #D8DEE8",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  height: "40px",
                  padding: "0 20px",
                  border: "1px solid #D8DEE8",
                  borderRadius: "4px",
                  backgroundColor: "#FFFFFF",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveLinks}
                style={{
                  height: "40px",
                  padding: "0 22px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#FD4314",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {editingId !== null ? "Update Link" : "Add Links"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawing Links Import Modal */}
      <DrawingLinksImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(validRecords) => {
          const nextId = Math.max(0, ...records.map(r => r.id)) + 1;
          const newLinks = validRecords.map((rec, i) => ({
            id: nextId + i,
            tradePackageCode: rec.tradePackageCode,
            tradePackageName: rec.tradePackageCode,
            rocId: rec.rocId,
            stepNumber: Number(rec.stepNumber),
            stepName: rec.stepName,
            drawingFolderLink: rec.drawingFolderLink,
            updatedBy: 'Import',
            updatedOn: new Date().toISOString().slice(0, 10),
          }));
          setRecords(prev => [...prev, ...newLinks]);
          setShowImportModal(false);
        }}
      />
    </div>
  );
}
