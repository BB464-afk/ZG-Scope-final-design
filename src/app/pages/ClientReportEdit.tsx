import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Download, ArrowLeft, Save, Edit3, AlertCircle } from 'lucide-react';

interface ManhoursRow {
  id: string;
  name: string;
  weighting: number;
  originalBudget: number;
  approvedChanges: number;
  currentBudget: number;
  periodEarnedPercent: number;
  periodEarnedValue: number;
  periodActualValue: number;
  periodSPI: number;
  periodCPI: number;
  toDateEarnedPercent: number;
  toDateEarnedValue: number;
  toDateToGo: number;
  toDateSPI: number;
  toDateCPI: number;
}

interface CostRow {
  id: string;
  name: string;
  weighting: number;
  originalBudget: number;
  approvedChanges: number;
  currentBudget: number;
  periodEarnedPercent: number;
  periodEarnedValue: number;
  periodActualValue: number;
  periodSPI: number;
  periodCPI: number;
  toDateEarnedPercent: number;
  toDateEarnedValue: number;
  toDateToGo: number;
  toDateSPI: number;
  toDateCPI: number;
}

interface QuantityRow {
  id: string;
  name: string;
  area?: string;
  uom?: string;
  totalQuantity?: number;
  installedPeriod?: number;
  installedToDate?: number;
  toGo?: number;
  percentComplete?: number;
  isGroupHeader?: boolean;
}

export default function ClientReportEdit() {
  const navigate = useNavigate();
  const { projectId, reportId } = useParams();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Determine report type based on reportId
  const getReportType = () => {
    if (reportId === '1') return 'Manhours';
    if (reportId === '2') return 'Cost';
    if (reportId === '3') return 'Quantity';
    return 'Manhours';
  };

  const reportType = getReportType();

  // Manhours data
  const [manhoursData, setManhoursData] = useState<ManhoursRow[]>([
    {
      id: 'area-1',
      name: 'Zone A - Basement Level 1',
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
      toDateToGo: 3955,
      toDateSPI: 1.05,
      toDateCPI: 0.98
    },
    {
      id: 'area-2',
      name: 'Zone B - Ground Floor',
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
      toDateToGo: 4702,
      toDateSPI: 1.02,
      toDateCPI: 0.97
    }
  ]);

  // Cost data
  const [costData, setCostData] = useState<CostRow[]>([
    {
      id: 'area-1',
      name: 'Zone A - Basement Level 1',
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
  ]);

  // Quantity data
  const [quantityData, setQuantityData] = useState<QuantityRow[]>([
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
      name: 'Structural Steel',
      area: 'Area B',
      uom: 'MT',
      totalQuantity: 1000,
      installedPeriod: 100,
      installedToDate: 1000,
      toGo: 0,
      percentComplete: 100
    }
  ]);

  // Overall editable values for Manhours
  const [overallManhours, setOverallManhours] = useState({
    periodEarnedPercent: 0,
    periodEarnedValue: 0,
    periodActualValue: 0,
    periodSPI: 0,
    periodCPI: 0,
    toDateEarnedPercent: 0,
    toDateEarnedValue: 0,
    toDateToGo: 0,
    toDateSPI: 0,
    toDateCPI: 0
  });

  // Overall editable values for Cost
  const [overallCost, setOverallCost] = useState({
    periodEarnedPercent: 0,
    periodEarnedValue: 0,
    periodActualValue: 0,
    periodSPI: 0,
    periodCPI: 0,
    toDateEarnedPercent: 0,
    toDateEarnedValue: 0,
    toDateToGo: 0,
    toDateSPI: 0,
    toDateCPI: 0
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const handleManhoursEdit = (rowId: string, field: keyof ManhoursRow, value: number) => {
    setManhoursData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleCostEdit = (rowId: string, field: keyof CostRow, value: number) => {
    setCostData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleQuantityEdit = (rowId: string, field: keyof QuantityRow, value: number) => {
    setQuantityData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleOverallManhoursEdit = (field: keyof typeof overallManhours, value: number) => {
    setOverallManhours(prev => ({ ...prev, [field]: value }));
  };

  const handleOverallCostEdit = (field: keyof typeof overallCost, value: number) => {
    setOverallCost(prev => ({ ...prev, [field]: value }));
  };

  const calculateManhoursOverall = () => {
    const totalWeighting = manhoursData.reduce((sum, row) => sum + row.weighting, 0);
    const totalOriginalBudget = manhoursData.reduce((sum, row) => sum + row.originalBudget, 0);
    const totalApprovedChanges = manhoursData.reduce((sum, row) => sum + row.approvedChanges, 0);
    const totalCurrentBudget = manhoursData.reduce((sum, row) => sum + row.currentBudget, 0);
    const totalPeriodEarnedValue = manhoursData.reduce((sum, row) => sum + row.periodEarnedValue, 0);
    const totalPeriodActualValue = manhoursData.reduce((sum, row) => sum + row.periodActualValue, 0);
    const totalToDateEarnedValue = manhoursData.reduce((sum, row) => sum + row.toDateEarnedValue, 0);
    const totalToDateToGo = manhoursData.reduce((sum, row) => sum + row.toDateToGo, 0);
    
    const avgPeriodEarnedPercent = totalCurrentBudget > 0 ? (totalPeriodEarnedValue / totalCurrentBudget) * 100 : 0;
    const avgToDateEarnedPercent = totalCurrentBudget > 0 ? (totalToDateEarnedValue / totalCurrentBudget) * 100 : 0;
    const avgPeriodSPI = totalPeriodActualValue > 0 ? totalPeriodEarnedValue / totalPeriodActualValue : 0;
    const avgPeriodCPI = totalPeriodActualValue > 0 ? totalPeriodEarnedValue / totalPeriodActualValue : 0;
    const avgToDateSPI = manhoursData.length > 0 ? manhoursData.reduce((sum, r) => sum + r.toDateSPI, 0) / manhoursData.length : 0;
    const avgToDateCPI = manhoursData.length > 0 ? manhoursData.reduce((sum, r) => sum + r.toDateCPI, 0) / manhoursData.length : 0;

    return {
      totalWeighting,
      totalOriginalBudget,
      totalApprovedChanges,
      totalCurrentBudget,
      avgPeriodEarnedPercent: overallManhours.periodEarnedPercent || avgPeriodEarnedPercent,
      totalPeriodEarnedValue: overallManhours.periodEarnedValue || totalPeriodEarnedValue,
      totalPeriodActualValue: overallManhours.periodActualValue || totalPeriodActualValue,
      avgPeriodSPI: overallManhours.periodSPI || avgPeriodSPI,
      avgPeriodCPI: overallManhours.periodCPI || avgPeriodCPI,
      avgToDateEarnedPercent: overallManhours.toDateEarnedPercent || avgToDateEarnedPercent,
      totalToDateEarnedValue: overallManhours.toDateEarnedValue || totalToDateEarnedValue,
      totalToDateToGo: overallManhours.toDateToGo || totalToDateToGo,
      avgToDateSPI: overallManhours.toDateSPI || avgToDateSPI,
      avgToDateCPI: overallManhours.toDateCPI || avgToDateCPI
    };
  };

  const calculateCostOverall = () => {
    const totalWeighting = costData.reduce((sum, row) => sum + row.weighting, 0);
    const totalOriginalBudget = costData.reduce((sum, row) => sum + row.originalBudget, 0);
    const totalApprovedChanges = costData.reduce((sum, row) => sum + row.approvedChanges, 0);
    const totalCurrentBudget = costData.reduce((sum, row) => sum + row.currentBudget, 0);
    const totalPeriodEarnedValue = costData.reduce((sum, row) => sum + row.periodEarnedValue, 0);
    const totalPeriodActualValue = costData.reduce((sum, row) => sum + row.periodActualValue, 0);
    const totalToDateEarnedValue = costData.reduce((sum, row) => sum + row.toDateEarnedValue, 0);
    const totalToDateToGo = costData.reduce((sum, row) => sum + row.toDateToGo, 0);
    
    const avgPeriodEarnedPercent = totalCurrentBudget > 0 ? (totalPeriodEarnedValue / totalCurrentBudget) * 100 : 0;
    const avgToDateEarnedPercent = totalCurrentBudget > 0 ? (totalToDateEarnedValue / totalCurrentBudget) * 100 : 0;
    const avgPeriodSPI = totalPeriodActualValue > 0 ? totalPeriodEarnedValue / totalPeriodActualValue : 0;
    const avgPeriodCPI = totalPeriodActualValue > 0 ? totalPeriodEarnedValue / totalPeriodActualValue : 0;
    const avgToDateSPI = costData.length > 0 ? costData.reduce((sum, r) => sum + r.toDateSPI, 0) / costData.length : 0;
    const avgToDateCPI = costData.length > 0 ? costData.reduce((sum, r) => sum + r.toDateCPI, 0) / costData.length : 0;

    return {
      totalWeighting,
      totalOriginalBudget,
      totalApprovedChanges,
      totalCurrentBudget,
      avgPeriodEarnedPercent: overallCost.periodEarnedPercent || avgPeriodEarnedPercent,
      totalPeriodEarnedValue: overallCost.periodEarnedValue || totalPeriodEarnedValue,
      totalPeriodActualValue: overallCost.periodActualValue || totalPeriodActualValue,
      avgPeriodSPI: overallCost.periodSPI || avgPeriodSPI,
      avgPeriodCPI: overallCost.periodCPI || avgPeriodCPI,
      avgToDateEarnedPercent: overallCost.toDateEarnedPercent || avgToDateEarnedPercent,
      totalToDateEarnedValue: overallCost.toDateEarnedValue || totalToDateEarnedValue,
      totalToDateToGo: overallCost.toDateToGo || totalToDateToGo,
      avgToDateSPI: overallCost.toDateSPI || avgToDateSPI,
      avgToDateCPI: overallCost.toDateCPI || avgToDateCPI
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>Area</th>
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
            {manhoursData.map((row, index) => (
              <tr key={row.id} style={{
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                borderBottom: '1px solid #C8D9EE'
              }}>
                {/* Locked Fields */}
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721', backgroundColor: '#F9FAFB' }}>
                  {row.name}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', backgroundColor: '#F9FAFB' }}>
                  {row.weighting.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', backgroundColor: '#F9FAFB' }}>
                  {formatNumber(row.originalBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', backgroundColor: '#F9FAFB' }}>
                  {formatNumber(row.approvedChanges)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#6B7280', backgroundColor: '#F9FAFB' }}>
                  {formatNumber(row.currentBudget)}
                </td>

                {/* Period Summary - Editable */}
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-periodEarnedPercent` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-periodEarnedPercent`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" step="0.1" value={row.periodEarnedPercent}
                    onChange={(e) => handleManhoursEdit(row.id, 'periodEarnedPercent', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-periodEarnedValue` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-periodEarnedValue`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" value={row.periodEarnedValue}
                    onChange={(e) => handleManhoursEdit(row.id, 'periodEarnedValue', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>

                {/* To-Date Summary - Editable */}
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-toDateEarnedPercent` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-toDateEarnedPercent`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" step="0.1" value={row.toDateEarnedPercent}
                    onChange={(e) => handleManhoursEdit(row.id, 'toDateEarnedPercent', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-toDateEarnedValue` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-toDateEarnedValue`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" value={row.toDateEarnedValue}
                    onChange={(e) => handleManhoursEdit(row.id, 'toDateEarnedValue', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
                <td style={{ padding: '8px', backgroundColor: hoveredCell === `${row.id}-toDateToGo` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-toDateToGo`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" value={row.toDateToGo}
                    onChange={(e) => handleManhoursEdit(row.id, 'toDateToGo', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
              </tr>
            ))}
            {/* Overall Row - Editable Period and To-Date values */}
            <tr style={{ backgroundColor: '#E4EEF8', borderTop: '2px solid #C8D9EE', fontWeight: '600' }}>
              <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>Overall</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{overall.totalWeighting.toFixed(1)}%</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.totalOriginalBudget)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.totalApprovedChanges)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>{formatNumber(overall.totalCurrentBudget)}</td>
              
              {/* Period Summary - Editable */}
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-periodEarnedPercent' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-periodEarnedPercent')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" step="0.1" value={overall.avgPeriodEarnedPercent}
                  onChange={(e) => handleOverallManhoursEdit('periodEarnedPercent', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-periodEarnedValue' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-periodEarnedValue')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" value={overall.totalPeriodEarnedValue}
                  onChange={(e) => handleOverallManhoursEdit('periodEarnedValue', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>

              {/* To-Date Summary - Editable */}
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-toDateEarnedPercent' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-toDateEarnedPercent')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" step="0.1" value={overall.avgToDateEarnedPercent}
                  onChange={(e) => handleOverallManhoursEdit('toDateEarnedPercent', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-toDateEarnedValue' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-toDateEarnedValue')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" value={overall.totalToDateEarnedValue}
                  onChange={(e) => handleOverallManhoursEdit('toDateEarnedValue', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
              <td style={{ padding: '8px', backgroundColor: hoveredCell === 'overall-toDateToGo' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-toDateToGo')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" value={overall.totalToDateToGo}
                  onChange={(e) => handleOverallManhoursEdit('toDateToGo', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderCostTable = () => {
    const overall = calculateCostOverall();

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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>Area</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Original Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Agreed Changes</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Current Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Actual Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '80px' }}>SPI</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '80px' }}>CPI</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>To-Go Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '80px' }}>SPI</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '80px' }}>CPI</th>
            </tr>
          </thead>
          <tbody>
            {costData.map((row, index) => (
              <tr key={row.id} style={{
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                borderBottom: '1px solid #C8D9EE'
              }}>
                {/* Locked Fields */}
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721', backgroundColor: '#F9FAFB' }}>{row.name}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', backgroundColor: '#F9FAFB' }}>{row.weighting.toFixed(1)}%</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', backgroundColor: '#F9FAFB' }}>{formatNumber(row.originalBudget)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', backgroundColor: '#F9FAFB' }}>{formatNumber(row.approvedChanges)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#6B7280', backgroundColor: '#F9FAFB' }}>{formatNumber(row.currentBudget)}</td>

                {/* Period Summary - Editable */}
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-periodEarnedPercent` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-periodEarnedPercent`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" step="0.1" value={row.periodEarnedPercent}
                    onChange={(e) => handleCostEdit(row.id, 'periodEarnedPercent', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-periodEarnedValue` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-periodEarnedValue`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" value={row.periodEarnedValue}
                    onChange={(e) => handleCostEdit(row.id, 'periodEarnedValue', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>

                {/* To-Date Summary - Editable */}
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-toDateEarnedPercent` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-toDateEarnedPercent`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" step="0.1" value={row.toDateEarnedPercent}
                    onChange={(e) => handleCostEdit(row.id, 'toDateEarnedPercent', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-toDateEarnedValue` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-toDateEarnedValue`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" value={row.toDateEarnedValue}
                    onChange={(e) => handleCostEdit(row.id, 'toDateEarnedValue', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
                <td style={{ padding: '8px', backgroundColor: hoveredCell === `${row.id}-toDateToGo` ? '#FFF7ED' : 'transparent' }}
                    onMouseEnter={() => setHoveredCell(`${row.id}-toDateToGo`)}
                    onMouseLeave={() => setHoveredCell(null)}>
                  <input type="number" value={row.toDateToGo}
                    onChange={(e) => handleCostEdit(row.id, 'toDateToGo', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                </td>
              </tr>
            ))}
            
            {/* Overall Row - Editable Period and To-Date values */}
            <tr style={{ backgroundColor: '#E4EEF8', borderTop: '2px solid #C8D9EE', fontWeight: '600' }}>
              <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>Overall</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{overall.totalWeighting.toFixed(1)}%</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.totalOriginalBudget)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.totalApprovedChanges)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>{formatNumber(overall.totalCurrentBudget)}</td>
              
              {/* Period Summary - Editable */}
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-periodEarnedPercent' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-periodEarnedPercent')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" step="0.1" value={overall.avgPeriodEarnedPercent}
                  onChange={(e) => handleOverallCostEdit('periodEarnedPercent', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-periodEarnedValue' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-periodEarnedValue')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" value={overall.totalPeriodEarnedValue}
                  onChange={(e) => handleOverallCostEdit('periodEarnedValue', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>

              {/* To-Date Summary - Editable */}
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-toDateEarnedPercent' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-toDateEarnedPercent')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" step="0.1" value={overall.avgToDateEarnedPercent}
                  onChange={(e) => handleOverallCostEdit('toDateEarnedPercent', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
              <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === 'overall-toDateEarnedValue' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-toDateEarnedValue')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" value={overall.totalToDateEarnedValue}
                  onChange={(e) => handleOverallCostEdit('toDateEarnedValue', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
              <td style={{ padding: '8px', backgroundColor: hoveredCell === 'overall-toDateToGo' ? '#FFF7ED' : 'transparent' }}
                  onMouseEnter={() => setHoveredCell('overall-toDateToGo')}
                  onMouseLeave={() => setHoveredCell(null)}>
                <input type="number" value={overall.totalToDateToGo}
                  onChange={(e) => handleOverallCostEdit('toDateToGo', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', backgroundColor: '#FFFFFF', outline: 'none' }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderQuantityTable = () => {
    const formatNumber = (num: number | undefined) => {
      if (num === undefined) return '';
      return num.toLocaleString('en-US');
    };

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
            {quantityData.map((row, dataIndex) => {
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
                const dataRowsBefore = quantityData.slice(0, dataIndex).filter((r: any) => !r.isGroupHeader).length;
                
                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: dataRowsBefore % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                      borderBottom: '1px solid #E2E6ED'
                    }}
                  >
                    {/* Locked Fields */}
                    <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721', backgroundColor: '#F9FAFB' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', fontWeight: '600', backgroundColor: '#F9FAFB' }}>{row.uom}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#6B7280', backgroundColor: '#F9FAFB' }}>{formatNumber(row.totalQuantity)}</td>

                    {/* Editable Fields */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-installedPeriod` ? '#FFF7ED' : 'transparent' }}
                        onMouseEnter={() => setHoveredCell(`${row.id}-installedPeriod`)}
                        onMouseLeave={() => setHoveredCell(null)}>
                      <input type="number" value={row.installedPeriod}
                        onChange={(e) => handleQuantityEdit(row.id, 'installedPeriod', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-installedToDate` ? '#FFF7ED' : 'transparent' }}
                        onMouseEnter={() => setHoveredCell(`${row.id}-installedToDate`)}
                        onMouseLeave={() => setHoveredCell(null)}>
                      <input type="number" value={row.installedToDate}
                        onChange={(e) => handleQuantityEdit(row.id, 'installedToDate', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE', backgroundColor: hoveredCell === `${row.id}-toGo` ? '#FFF7ED' : 'transparent' }}
                        onMouseEnter={() => setHoveredCell(`${row.id}-toGo`)}
                        onMouseLeave={() => setHoveredCell(null)}>
                      <input type="number" value={row.toGo}
                        onChange={(e) => handleQuantityEdit(row.id, 'toGo', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', backgroundColor: '#FFFFFF', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '8px', backgroundColor: hoveredCell === `${row.id}-percentComplete` ? '#FFF7ED' : 'transparent' }}
                        onMouseEnter={() => setHoveredCell(`${row.id}-percentComplete`)}
                        onMouseLeave={() => setHoveredCell(null)}>
                      <input type="number" step="0.1" value={row.percentComplete}
                        onChange={(e) => handleQuantityEdit(row.id, 'percentComplete', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', height: '32px', padding: '0 8px', border: '1px solid #FD4314', borderRadius: '3px', fontSize: '13px', textAlign: 'right', fontWeight: '600', color: '#065F46', backgroundColor: '#FFFFFF', outline: 'none' }} />
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

  const getReportName = () => {
    if (reportType === 'Manhours') return 'January 2026 Progress - Client View (Draft)';
    if (reportType === 'Cost') return 'Q4 2025 Cost Analysis - Client View (Draft)';
    if (reportType === 'Quantity') return 'December Quantity Report - Client View (Draft)';
    return 'Report - Client View (Draft)';
  };

  const getPeriod = () => {
    if (reportType === 'Manhours') return '2026-01-01 to 2026-01-31';
    if (reportType === 'Cost') return '2025-10-01 to 2025-12-31';
    if (reportType === 'Quantity') return '2025-12-01 to 2025-12-31';
    return '2026-01-01 to 2026-01-31';
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <button
              onClick={() => navigate(`/app/projects/${projectId}/reports/${reportId}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#5F6B7A',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1F2937'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#5F6B7A'}
            >
              <ArrowLeft size={16} />
              Back to Report
            </button>

            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 8px 0'
            }}>
              {getReportName()}
            </h1>

            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '13px',
              color: '#5F6B7A'
            }}>
              <div>
                <span style={{ fontWeight: '500' }}>Type:</span> {reportType}
              </div>
              <div>
                <span style={{ fontWeight: '500' }}>Period:</span> {getPeriod()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => navigate(`/app/projects/${projectId}/reports/${reportId}`)}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid #D8DEE8',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              style={{
                height: '36px',
                padding: '0 16px',
                border: 'none',
                backgroundColor: '#FD4314',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E63C12'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              <Save size={16} />
              Save as Client Report
            </button>
          </div>
        </div>

        {/* Editable Table */}
        {reportType === 'Manhours' && renderManhoursTable()}
        {reportType === 'Cost' && renderCostTable()}
        {reportType === 'Quantity' && renderQuantityTable()}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
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
          onClick={() => setShowSaveModal(false)}
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
                Save Client Report
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
                  Report Name
                </label>
                <input
                  type="text"
                  defaultValue={getReportName().replace(' (Draft)', '')}
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

              <div style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E2E6ED',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '13px',
                color: '#5F6B7A'
              }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Report Type:</strong> {reportType}
                </div>
                <div>
                  <strong>Period:</strong> {getPeriod()}
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
                onClick={() => setShowSaveModal(false)}
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
                onClick={() => {
                  setShowSaveModal(false);
                  navigate(`/app/projects/${projectId}/reports?tab=saved`);
                }}
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
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
