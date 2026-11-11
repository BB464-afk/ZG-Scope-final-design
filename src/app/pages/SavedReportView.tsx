import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Download, ArrowLeft, FileEdit, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { formatDate } from '../components/EnterpriseTable';

interface SavedReportViewProps {
  reportId?: string;
}

interface ReportSnapshot {
  id: string;
  name: string;
  type: 'Manhours' | 'Cost' | 'Quantity';
  periodStart: string;
  periodEnd: string;
  groupBy: string;
  createdBy: string;
  createdDate: string;
  savedAs: 'System' | 'Client';
  parentSnapshotId?: string;
  kpiData: any;
  tableData: any[];
}

export default function SavedReportView() {
  const navigate = useNavigate();
  const { projectId, reportId } = useParams();
  
  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [downloadTooltip, setDownloadTooltip] = useState(false);

  // Mock saved report data - different reports based on reportId
  const mockReports: Record<string, ReportSnapshot> = {
    '1': {
      id: '1',
      name: 'January 2026 Progress - Manhours',
      type: 'Manhours',
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
      groupBy: 'Area',
      createdBy: 'John Smith',
      createdDate: '2026-02-01',
      savedAs: 'System',
      kpiData: {
        totalBudget: '45,280',
        earnedToDate: '32,150',
        actualToDate: '32,800',
        spiToDate: '1.05',
        cpiToDate: '0.98'
      },
      tableData: [
        {
          id: 'area-1',
          name: 'Zone A - Basement Level 1',
          level: 0,
          weighting: 35.5,
          originalBudget: 16076,
          approvedChanges: 450,
          currentBudget: 16526,
          periodEarnedPercent: 12.5,
          periodEarnedValue: 2010,
          periodActualValue: 2050,
          periodSPI: 1.08,
          periodCPI: 0.98,
          toDateEarnedPercent: 78.2,
          toDateEarnedValue: 12571,
          toDateActualValue: 12830,
          toDateToGo: 3955,
          toDateSPI: 1.05,
          toDateCPI: 0.98
        },
        {
          id: 'area-2',
          name: 'Zone B - Ground Floor',
          level: 0,
          weighting: 28.3,
          originalBudget: 12814,
          approvedChanges: 320,
          currentBudget: 13134,
          periodEarnedPercent: 15.2,
          periodEarnedValue: 1948,
          periodActualValue: 1920,
          periodSPI: 1.12,
          periodCPI: 1.01,
          toDateEarnedPercent: 65.8,
          toDateEarnedValue: 8432,
          toDateActualValue: 8650,
          toDateToGo: 4702,
          toDateSPI: 1.02,
          toDateCPI: 0.97
        }
      ]
    },
    '2': {
      id: '2',
      name: 'Q4 2025 Cost Analysis - Client Presentation',
      type: 'Cost',
      periodStart: '2025-10-01',
      periodEnd: '2025-12-31',
      groupBy: 'Area',
      createdBy: 'Sarah Johnson',
      createdDate: '2026-01-05',
      savedAs: 'Client',
      kpiData: {
        totalBudget: '85,500',
        earnedToDate: '68,200',
        spiToDate: '1.12',
        cpiToDate: '1.05'
      },
      tableData: [
        {
          id: 'area-1',
          name: 'Zone A - Basement Level 1',
          level: 0,
          weighting: 40.0,
          originalBudget: 34200,
          approvedChanges: 1200,
          currentBudget: 35400,
          periodEarnedPercent: 18.5,
          periodEarnedValue: 6549,
          periodActualValue: 6200,
          periodSPI: 1.15,
          periodCPI: 1.06,
          toDateEarnedPercent: 82.0,
          toDateEarnedValue: 29028,
          toDateToGo: 6372,
          toDateSPI: 1.12,
          toDateCPI: 1.05
        },
        {
          id: 'area-2',
          name: 'Zone B - Structural',
          level: 0,
          weighting: 35.0,
          originalBudget: 29925,
          approvedChanges: 800,
          currentBudget: 30725,
          periodEarnedPercent: 16.2,
          periodEarnedValue: 4977,
          periodActualValue: 4850,
          periodSPI: 1.08,
          periodCPI: 1.03,
          toDateEarnedPercent: 75.5,
          toDateEarnedValue: 23197,
          toDateToGo: 7528,
          toDateSPI: 1.05,
          toDateCPI: 1.02
        }
      ]
    },
    '3': {
      id: '3',
      name: 'December Quantity Report',
      type: 'Quantity',
      periodStart: '2025-12-01',
      periodEnd: '2025-12-31',
      groupBy: 'Area',
      createdBy: 'Mike Chen',
      createdDate: '2025-12-31',
      savedAs: 'System',
      kpiData: {
        totalQuantity: '12,450',
        installedToDate: '9,680',
        percentComplete: '77.8%',
        toGo: '2,770'
      },
      tableData: [
        {
          id: 'area-a-header',
          name: 'Area A',
          isGroupHeader: true
        },
        {
          id: 'area-a-1',
          name: 'Cable Installation',
          area: 'Area A',
          uom: 'LM',
          totalQuantity: 2100,
          installedPeriod: 310,
          installedToDate: 1500,
          toGo: 600,
          percentComplete: 71
        },
        {
          id: 'area-a-2',
          name: 'Sprinkler Piping',
          area: 'Area A',
          uom: 'LM',
          totalQuantity: 1200,
          installedPeriod: 200,
          installedToDate: 800,
          toGo: 400,
          percentComplete: 67
        },
        {
          id: 'area-a-3',
          name: 'Ceiling Installation',
          area: 'Area A',
          uom: 'm²',
          totalQuantity: 4200,
          installedPeriod: 620,
          installedToDate: 3010,
          toGo: 1190,
          percentComplete: 72
        },
        {
          id: 'area-a-4',
          name: 'Structural Steel',
          area: 'Area A',
          uom: 'MT',
          totalQuantity: 950,
          installedPeriod: 120,
          installedToDate: 600,
          toGo: 350,
          percentComplete: 63
        },
        {
          id: 'area-b-header',
          name: 'Area B',
          isGroupHeader: true
        },
        {
          id: 'area-b-1',
          name: 'Cable Installation',
          area: 'Area B',
          uom: 'LM',
          totalQuantity: 1800,
          installedPeriod: 250,
          installedToDate: 1200,
          toGo: 600,
          percentComplete: 67
        },
        {
          id: 'area-b-2',
          name: 'Sprinkler Piping',
          area: 'Area B',
          uom: 'LM',
          totalQuantity: 900,
          installedPeriod: 150,
          installedToDate: 550,
          toGo: 350,
          percentComplete: 61
        },
        {
          id: 'area-b-3',
          name: 'Ceiling Installation',
          area: 'Area B',
          uom: 'm²',
          totalQuantity: 3800,
          installedPeriod: 560,
          installedToDate: 2720,
          toGo: 1080,
          percentComplete: 72
        },
        {
          id: 'area-b-4',
          name: 'Structural Steel',
          area: 'Area B',
          uom: 'MT',
          totalQuantity: 1000,
          installedPeriod: 1000,
          installedToDate: 1000,
          toGo: 0,
          percentComplete: 100
        }
      ]
    }
  };

  const mockReport = mockReports[reportId || '1'] || mockReports['1'];

  const handleCreateClientView = () => {
    navigate(`/app/projects/${projectId}/reports/${reportId}/client-edit`);
  };

  const toggleRowExpand = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Calculate overall totals for Manhours report
  const calculateManhoursOverall = () => {
    if (mockReport.type !== 'Manhours') return null;
    
    const totalWeighting = mockReport.tableData.reduce((sum, row) => sum + row.weighting, 0);
    const totalOriginalBudget = mockReport.tableData.reduce((sum, row) => sum + row.originalBudget, 0);
    const totalApprovedChanges = mockReport.tableData.reduce((sum, row) => sum + row.approvedChanges, 0);
    const totalCurrentBudget = mockReport.tableData.reduce((sum, row) => sum + row.currentBudget, 0);
    const totalPeriodEarnedValue = mockReport.tableData.reduce((sum, row) => sum + row.periodEarnedValue, 0);
    const totalPeriodActualValue = mockReport.tableData.reduce((sum, row) => sum + row.periodActualValue, 0);
    const totalToDateEarnedValue = mockReport.tableData.reduce((sum, row) => sum + row.toDateEarnedValue, 0);
    const totalToDateActualValue = mockReport.tableData.reduce((sum, row) => sum + row.toDateActualValue, 0);
    const totalToDateToGo = mockReport.tableData.reduce((sum, row) => sum + row.toDateToGo, 0);
    
    const avgPeriodEarnedPercent = totalCurrentBudget > 0 ? (totalPeriodEarnedValue / totalCurrentBudget) * 100 : 0;
    const avgToDateEarnedPercent = totalCurrentBudget > 0 ? (totalToDateEarnedValue / totalCurrentBudget) * 100 : 0;
    const avgPeriodSPI = totalPeriodActualValue > 0 ? totalPeriodEarnedValue / totalPeriodActualValue : 0;
    const avgPeriodCPI = totalPeriodActualValue > 0 ? totalPeriodEarnedValue / totalPeriodActualValue : 0;
    const avgToDateSPI = totalToDateActualValue > 0 ? totalToDateEarnedValue / totalToDateActualValue : 0;
    const avgToDateCPI = totalToDateActualValue > 0 ? totalToDateEarnedValue / totalToDateActualValue : 0;

    return {
      totalWeighting,
      totalOriginalBudget,
      totalApprovedChanges,
      totalCurrentBudget,
      avgPeriodEarnedPercent,
      totalPeriodEarnedValue,
      totalPeriodActualValue,
      avgPeriodSPI,
      avgPeriodCPI,
      avgToDateEarnedPercent,
      totalToDateEarnedValue,
      totalToDateActualValue,
      totalToDateToGo,
      avgToDateSPI,
      avgToDateCPI
    };
  };

  const renderManhoursTable = () => {
    const overall = calculateManhoursOverall();
    
    return (
      <div style={{
        backgroundColor: '#FAFAFA',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{
          width: '100%',
          minWidth: '1800px',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '2px solid #C8D9EE'
            }}>
              <th colSpan={5} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                borderRight: '1px solid #C8D9EE',
                textTransform: 'uppercase'
              }}>
                Budget Summary
              </th>
              <th colSpan={2} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                borderRight: '1px solid #C8D9EE',
                textTransform: 'uppercase'
              }}>
                Period Summary
              </th>
              <th colSpan={3} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                textTransform: 'uppercase'
              }}>
                To-Date Summary
              </th>
            </tr>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>
                {mockReport.groupBy}
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Original Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Approved Changes</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Current Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned Hours</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned Hours</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>To-Go</th>
            </tr>
          </thead>
          <tbody>
            {mockReport.tableData.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                  borderBottom: '1px solid #C8D9EE'
                }}
              >
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  {row.name}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.weighting.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.originalBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.approvedChanges)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  {formatNumber(row.currentBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.periodEarnedPercent.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.periodEarnedValue)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.toDateEarnedPercent.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.toDateEarnedValue)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.toDateToGo)}
                </td>
              </tr>
            ))}
            {/* Overall Row */}
            {overall && (
              <tr style={{
                backgroundColor: '#E4EEF8',
                borderTop: '2px solid #C8D9EE',
                fontWeight: '600'
              }}>
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>
                  Overall
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {overall.totalWeighting.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(overall.totalOriginalBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(overall.totalApprovedChanges)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>
                  {formatNumber(overall.totalCurrentBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {overall.avgPeriodEarnedPercent.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(overall.totalPeriodEarnedValue)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {overall.avgToDateEarnedPercent.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(overall.totalToDateEarnedValue)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(overall.totalToDateToGo)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCostTable = () => {
    return (
      <div style={{
        backgroundColor: '#FAFAFA',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{
          width: '100%',
          minWidth: '1600px',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '2px solid #C8D9EE'
            }}>
              <th colSpan={5} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                borderRight: '1px solid #C8D9EE',
                textTransform: 'uppercase'
              }}>
                Budget Summary
              </th>
              <th colSpan={2} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                borderRight: '1px solid #C8D9EE',
                textTransform: 'uppercase'
              }}>
                Period Summary
              </th>
              <th colSpan={3} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                textTransform: 'uppercase'
              }}>
                To-Date Summary
              </th>
            </tr>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>
                {mockReport.groupBy}
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Original Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Agreed Changes</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Current Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>To-Go Cost</th>
            </tr>
          </thead>
          <tbody>
            {mockReport.tableData.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                  borderBottom: '1px solid #C8D9EE'
                }}
              >
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  {row.name}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.weighting.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.originalBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.approvedChanges)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  {formatNumber(row.currentBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.periodEarnedPercent.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.periodEarnedValue)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.toDateEarnedPercent.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.toDateEarnedValue)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.toDateToGo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderQuantityTable = () => {
    return (
      <div style={{
        backgroundColor: '#FAFAFA',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{
          width: '100%',
          minWidth: '1200px',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>
                Activity / Quantity Descriptor
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '80px' }}>UOM</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Total Planned Qty</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Installed (Period)</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '150px' }}>Installed (To-Date)</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>To Go</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '110px' }}>% Complete</th>
            </tr>
          </thead>
          <tbody>
            {mockReport.tableData.map((row, dataIndex) => {
              if (row.isGroupHeader) {
                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: '#E4EEF8',
                      borderTop: '2px solid #C8D9EE',
                      borderBottom: '1px solid #C8D9EE'
                    }}
                  >
                    <td colSpan={7} style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                      {row.name}
                    </td>
                  </tr>
                );
              } else {
                // Count only data rows before this one for alternating colors
                const dataRowsBefore = mockReport.tableData.slice(0, dataIndex).filter((r: any) => !r.isGroupHeader).length;
                
                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: dataRowsBefore % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                      borderBottom: '1px solid #E2E6ED'
                    }}
                  >
                    <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>
                      {row.uom}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                      {formatNumber(row.totalQuantity)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                      {formatNumber(row.installedPeriod)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                      {formatNumber(row.installedToDate)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                      {formatNumber(row.toGo)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#065F46' }}>
                      {row.percentComplete}%
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Header */}
      <div style={{ padding: '24px' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Saved Reports', path: `/app/projects/${projectId}/reports/saved` },
          { label: 'Report Detail' }
        ]} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          marginTop: '24px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2937',
                margin: '0'
              }}>
                {mockReport.name}
              </h1>
              
              {/* Tag based on savedAs type */}
              {mockReport.savedAs === 'System' ? (
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '4px'
                }}>
                  Saved to System
                </span>
              ) : (
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#E3F2FD',
                  color: '#1565C0',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '4px'
                }}>
                  Client Report
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDownloadModal(true)}
                onMouseEnter={() => setDownloadTooltip(true)}
                onMouseLeave={() => setDownloadTooltip(false)}
                style={{
                  height: '36px',
                  width: '36px',
                  padding: '0',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Download size={18} color="#374151" />
              </button>
              {downloadTooltip && (
                <div style={{
                  position: 'absolute',
                  top: '42px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}>
                  Download Locally
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderBottom: '4px solid #1F2937'
                  }} />
                </div>
              )}
            </div>
            {mockReport.savedAs === 'System' && (
              <button
                onClick={() => !isProjectReadOnly && handleCreateClientView()}
                disabled={isProjectReadOnly}
                title={isProjectReadOnly ? "Create Client View disabled - Project is On Hold" : ""}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: isProjectReadOnly ? '#D1D5DB' : '#FD4314',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isProjectReadOnly ? 0.5 : 1
                }}
                onMouseEnter={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#E63C12')}
                onMouseLeave={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FD4314')}
              >
                <FileEdit size={16} />
                Create Client View
              </button>
            )}
          </div>
        </div>

        {/* Report Info */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '13px',
          color: '#5F6B7A',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E6ED'
        }}>
          <div>
            <span style={{ fontWeight: '500' }}>Type:</span> {mockReport.type}
          </div>
          <div>
            <span style={{ fontWeight: '500' }}>Period:</span> {formatDate(mockReport.periodStart)} to {formatDate(mockReport.periodEnd)}
          </div>
          <div>
            <span style={{ fontWeight: '500' }}>Created:</span> {formatDate(mockReport.createdDate)} by {mockReport.createdBy}
          </div>
        </div>

        {/* Frozen Snapshot Banner */}
        <div style={{
          backgroundColor: '#FEF3C7',
          color: '#272721',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <AlertCircle size={20} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              Snapshot – Data Frozen for Period
            </div>
            <div style={{ fontSize: '12px', color: '#272721', opacity: 0.7, marginTop: '2px' }}>
              Values will not update.
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mockReport.type === 'Quantity' ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {mockReport.type === 'Quantity' ? (
            <>
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#272721',
                  marginBottom: '4px'
                }}>
                  {mockReport.kpiData.totalQuantity}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6B7A'
                }}>
                  Total Quantity
                </div>
              </div>

              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#272721',
                  marginBottom: '4px'
                }}>
                  {mockReport.kpiData.installedToDate}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6B7A'
                }}>
                  Installed (To Date)
                </div>
              </div>

              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#065F46',
                  marginBottom: '4px'
                }}>
                  {mockReport.kpiData.percentComplete}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6B7A'
                }}>
                  % Complete
                </div>
              </div>

              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#272721',
                  marginBottom: '4px'
                }}>
                  {mockReport.kpiData.toGo}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6B7A'
                }}>
                  To-Go
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#272721',
                  marginBottom: '4px'
                }}>
                  {mockReport.kpiData.totalBudget}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6B7A'
                }}>
                  Total Budget {mockReport.type === 'Manhours' ? 'Hours' : mockReport.type === 'Cost' ? 'Cost' : 'Quantity'}
                </div>
              </div>

              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#272721',
                  marginBottom: '4px'
                }}>
                  {mockReport.kpiData.earnedToDate}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6B7A'
                }}>
                  Earned (To Date)
                </div>
              </div>
            </>
          )}
        </div>

        {/* Frozen Report Table */}
        {mockReport.type === 'Manhours' && renderManhoursTable()}
        {mockReport.type === 'Cost' && renderCostTable()}
        {mockReport.type === 'Quantity' && renderQuantityTable()}
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '480px',
              maxWidth: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '24px 24px 16px 24px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Download Snapshot
              </h2>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  File Name
                </label>
                <input
                  type="text"
                  defaultValue={mockReport.name}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Format
                </label>
                <select
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E2E6ED',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '13px',
                color: '#5F6B7A'
              }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Report Type:</strong> {mockReport.type}
                </div>
                <div>
                  <strong>Period:</strong> {formatDate(mockReport.periodStart)} to {formatDate(mockReport.periodEnd)}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: '#F9FAFB'
            }}>
              <button
                onClick={() => setShowDownloadModal(false)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}