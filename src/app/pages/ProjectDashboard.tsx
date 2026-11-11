import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Lock,
  Unlock,
  DollarSign,
  Users,
  Eye,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Resizable } from 're-resizable';
import { SubmissionStatusBadge } from '../components/SubmissionStatusBadge';
import { LockSubmissionsModal, UnlockSubmissionsModal } from '../components/SubmissionControlModals';
import StandardDropdown from '../components/StandardDropdown';

interface KPIData {
  budgeted: number;
  earned: number;
  remaining: number;
  percentComplete: number;
}

interface QuantityItem {
  id: string;
  descriptor: string;
  uom: string;
  totalPlanned: number;
  installedPeriod: number;
  installedToDate: number;
  toGo: number;
  percentComplete: number;
}

interface PerformanceData {
  name: string;
  budget: number;
  earned: number;
}

interface ActivityItem {
  id: string;
  icon: 'progress' | 'approval' | 'change' | 'document';
  title: string;
  description: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Approved' | 'New';
  taskName?: string;
  user?: string;
}

// Activity options from TasksListing
const ACTIVITIES_DATA = [
  { value: 'FO-01', label: 'FO-01 - Whitewash', budget: 2800, earned: 1950 },
  { value: 'FO-64', label: 'FO-64 - Door sets', budget: 2200, earned: 1680 },
  { value: 'FO-21', label: 'FO-21 - Process/Chilled Water Distribution', budget: 3500, earned: 2450 },
  { value: 'FO-12', label: 'FO-12 - Ceilings', budget: 1800, earned: 1200 },
  { value: 'ME-15', label: 'ME-15 - Mechanical Systems', budget: 4200, earned: 3100 },
  { value: 'EL-08', label: 'EL-08 - Power Distribution', budget: 3800, earned: 2800 }
];

// Disciplines from DisciplineList
const DISCIPLINES_DATA = [
  { value: 'DISC-001', label: 'Architectural', budget: 3500, earned: 2450 },
  { value: 'DISC-002', label: 'Structural', budget: 3100, earned: 2200 },
  { value: 'DISC-003', label: 'Mechanical', budget: 4200, earned: 3100 },
  { value: 'DISC-004', label: 'Electrical', budget: 3800, earned: 2800 },
  { value: 'DISC-005', label: 'Civil', budget: 2900, earned: 2100 },
  { value: 'DISC-006', label: 'Fire Protection', budget: 1500, earned: 1200 }
];

// Trade Packages from TasksListing
const TRADE_PACKAGES_DATA = [
  { value: 'TP-MEP-001', label: 'TP-MEP-001', budget: 3500, earned: 2450 },
  { value: 'TP-MEP-002', label: 'TP-MEP-002', budget: 2800, earned: 2100 },
  { value: 'TP-ELE-001', label: 'TP-ELE-001', budget: 2200, earned: 1680 },
  { value: 'TP-ARC-001', label: 'TP-ARC-001', budget: 1800, earned: 1200 },
  { value: 'TP-FS-001', label: 'TP-FS-001', budget: 1500, earned: 1100 }
];

// Subcontractors from TasksListing
const SUBCONTRACTORS_DATA = [
  { value: 'SC-001', label: 'ABC Contractors', budget: 4500, earned: 3200 },
  { value: 'SC-002', label: 'BuildTech Solutions', budget: 3800, earned: 2900 },
  { value: 'SC-003', label: 'PowerGrid Electric', budget: 3200, earned: 2100 },
  { value: 'SC-004', label: 'InteriorPro Ltd', budget: 2500, earned: 1900 },
  { value: 'SC-005', label: 'SafeGuard Systems', budget: 1800, earned: 1400 }
];

// Scope/Phases data
const SCOPE_DATA = [
  { value: 'SCOPE-001', label: 'Design & Engineering', budget: 3500, earned: 2800 },
  { value: 'SCOPE-002', label: 'Procurement', budget: 2800, earned: 2100 },
  { value: 'SCOPE-003', label: 'Construction', budget: 5200, earned: 3400 },
  { value: 'SCOPE-004', label: 'Testing & Commissioning', budget: 2200, earned: 1450 },
  { value: 'SCOPE-005', label: 'Handover', budget: 1500, earned: 750 }
];

// Area values
const AREA_DATA = [
  { value: 'A01', label: 'North Wing', budget: 4200, earned: 3100 },
  { value: 'A02', label: 'South Wing', budget: 3800, earned: 2850 },
  { value: 'A03', label: 'East Wing', budget: 3300, earned: 2400 },
  { value: 'A05', label: 'Central Tower', budget: 2900, earned: 2100 },
  { value: 'A06', label: 'Basement Level', budget: 2200, earned: 1600 }
];

// Work Package values
const WORK_PACKAGE_DATA = [
  { value: 'WP01', label: 'Civil & Structural', budget: 4500, earned: 3200 },
  { value: 'WP02', label: 'Electrical Systems', budget: 3900, earned: 2900 },
  { value: 'WP03', label: 'HVAC Systems', budget: 3400, earned: 2500 },
  { value: 'WP04', label: 'Plumbing & Drainage', budget: 2800, earned: 2000 }
];

// SPA values
const SPA_DATA = [
  { value: 'SPA01', label: 'Design Phase', budget: 3800, earned: 3200 },
  { value: 'SPA02', label: 'Construction Phase', budget: 5500, earned: 3800 },
  { value: 'SPA03', label: 'Testing Phase', budget: 2400, earned: 1600 },
  { value: 'SPA04', label: 'Commissioning Phase', budget: 1900, earned: 1200 }
];

// Cost Type values
const COST_TYPE_DATA = [
  { value: 'CT01', label: 'Direct Costs', budget: 6200, earned: 4400 },
  { value: 'CT02', label: 'Indirect Costs', budget: 3800, earned: 2700 },
  { value: 'CT03', label: 'Contingency', budget: 2100, earned: 1400 }
];

const MOCK_QUANTITY_DATA: QuantityItem[] = [
  {
    id: '1',
    descriptor: 'Concrete Slabs',
    uom: 'm³',
    totalPlanned: 2500,
    installedPeriod: 180,
    installedToDate: 1650,
    toGo: 850,
    percentComplete: 66
  },
  {
    id: '2',
    descriptor: 'Steel Beams',
    uom: 'Tons',
    totalPlanned: 450,
    installedPeriod: 35,
    installedToDate: 310,
    toGo: 140,
    percentComplete: 69
  },
  {
    id: '3',
    descriptor: 'Electrical Conduit',
    uom: 'm',
    totalPlanned: 8500,
    installedPeriod: 620,
    installedToDate: 6800,
    toGo: 1700,
    percentComplete: 80
  },
  {
    id: '4',
    descriptor: 'HVAC Ductwork',
    uom: 'm²',
    totalPlanned: 1200,
    installedPeriod: 85,
    installedToDate: 720,
    toGo: 480,
    percentComplete: 60
  },
  {
    id: '5',
    descriptor: 'Plumbing Pipes',
    uom: 'm',
    totalPlanned: 4200,
    installedPeriod: 310,
    installedToDate: 2940,
    toGo: 1260,
    percentComplete: 70
  },
  {
    id: '6',
    descriptor: 'Fire Sprinkler Heads',
    uom: 'No',
    totalPlanned: 850,
    installedPeriod: 45,
    installedToDate: 340,
    toGo: 510,
    percentComplete: 40
  },
  {
    id: '7',
    descriptor: 'Lighting Fixtures',
    uom: 'No',
    totalPlanned: 650,
    installedPeriod: 55,
    installedToDate: 520,
    toGo: 130,
    percentComplete: 80
  },
  {
    id: '8',
    descriptor: 'Drywall Sheets',
    uom: 'm²',
    totalPlanned: 9500,
    installedPeriod: 580,
    installedToDate: 4750,
    toGo: 4750,
    percentComplete: 50
  }
];

export default function ProjectDashboard() {
  const { projectId } = useParams();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('Discipline');

  // Date States - Direct inputs
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-23');

  // Other States
  const [chartViewType, setChartViewType] = useState<'manhours' | 'cost'>('manhours');
  const [isProgressLocked, setIsProgressLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Chart visibility states - Budget shown as line, Earned as bar
  const [showBudgetLine, setShowBudgetLine] = useState(true);
  const [showEarnedBar, setShowEarnedBar] = useState(true);

  // Chart resize states - persist across view type changes
  const [chartWidth, setChartWidth] = useState<number | string>('60%');
  const [chartHeight, setChartHeight] = useState<number>(380);

  // All category options
  const categoryOptions = [
    { value: 'Discipline', label: 'Discipline' },
    { value: 'Activity', label: 'Activity' },
    { value: 'Subcontractor', label: 'Subcontractor' },
    { value: 'Scope', label: 'Scope' },
    { value: 'Area', label: 'Area' },
    { value: 'Work Package', label: 'Work Package' },
    { value: 'Trade Package', label: 'Trade Package' },
    { value: 'Cost Code', label: 'Cost Code' },
    { value: 'SPA', label: 'SPA' }
  ];

  const handleLockConfirm = () => {
    setIsProgressLocked(true);
    setShowLockModal(false);
    toast.success('Progress submissions locked successfully.');
  };

  const handleUnlockConfirm = () => {
    setIsProgressLocked(false);
    setShowUnlockModal(false);
    toast.success('Progress submissions unlocked successfully.');
  };

  // Get data based on selected category
  const getCategoryData = () => {
    switch (selectedCategory) {
      case 'Trade Package':
        return TRADE_PACKAGES_DATA;
      case 'Discipline':
        return DISCIPLINES_DATA;
      case 'Activity':
        return ACTIVITIES_DATA;
      case 'Subcontractor':
        return SUBCONTRACTORS_DATA;
      case 'Scope':
        return SCOPE_DATA;
      case 'Area':
        return AREA_DATA;
      case 'Work Package':
        return WORK_PACKAGE_DATA;
      case 'SPA':
        return SPA_DATA;
      case 'Cost Code':
      case 'Cost Type':
        return COST_TYPE_DATA;
      default:
        return DISCIPLINES_DATA;
    }
  };

  const categoryTableData = getCategoryData();

  // Calculate KPIs - Dynamic values based on date range
  const calculatedKPIs = useMemo(() => {
    const totalBudget = 18200;  // Total project manhours
    const baseEarned = 13180;  // Base earned manhours at full period (30 days)
    
    // Calculate date-based factor for earned values
    const daysDiff = startDate && endDate ?
      Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) : 23;
    const dateFactor = Math.min(daysDiff / 30, 1); // Assume 30 days is max period
    
    // Apply date factor to earned values
    const totalEarned = Math.round(baseEarned * dateFactor);
    const remaining = totalBudget - totalEarned;
    const percentComplete = totalBudget > 0 ? Number(((totalEarned / totalBudget) * 100).toFixed(1)) : 0;

    return {
      manhours: {
        budgeted: totalBudget,
        earned: totalEarned,
        remaining: remaining,
        percentComplete: percentComplete
      },
      cost: {
        budgeted: totalBudget * 196,
        earned: totalEarned * 196,
        remaining: remaining * 196,
        percentComplete: percentComplete
      }
    };
  }, [startDate, endDate]); // Dynamic values - dependent on dates

  // Calculate dynamic quantity data based on date range
  const calculatedQuantityData = useMemo(() => {
    const daysDiff = startDate && endDate ? 
      Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) : 23;
    const dateFactor = Math.min(daysDiff / 30, 1);
    
    return MOCK_QUANTITY_DATA.map(item => {
      const adjustedInstalledToDate = Math.round(item.installedToDate * dateFactor);
      const adjustedToGo = item.totalPlanned - adjustedInstalledToDate;
      const adjustedPercent = Math.round((adjustedInstalledToDate / item.totalPlanned) * 100);
      
      return {
        ...item,
        installedToDate: adjustedInstalledToDate,
        toGo: adjustedToGo,
        percentComplete: adjustedPercent
      };
    });
  }, [startDate, endDate]);

  // Project Active Days - fixed value, not affected by date selection
  const activeDays = 145; // Fixed project duration
  const targetCompletionDate = '30-08-2026'; // Target completion date

  // Prepare chart data - sorted by % complete (lowest first)
  // Bar chart values change based on date range
  const chartData = useMemo(() => {
    // Calculate date-based factor for bar chart data
    const daysDiff = startDate && endDate ?
      Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) : 23;
    const dateFactor = Math.min(daysDiff / 30, 1); // Assume 30 days is max period

    const data = categoryTableData.map((item, index) => {
      // Apply date factor to earned values for the chart
      const earnedForPeriod = Math.round(item.earned * dateFactor);
      const percentComplete = item.budget > 0 ? ((earnedForPeriod / item.budget) * 100) : 0;

      // Include category in the unique ID to prevent key collisions across category changes
      const uniqueId = `${selectedCategory}-${item.value || index}`;
      const earnedValue = chartViewType === 'manhours' ? earnedForPeriod : earnedForPeriod * 196;
      const budgetValue = chartViewType === 'manhours' ? item.budget : item.budget * 196;
      const remainingValue = budgetValue - earnedValue;

      // Calculate estimated completion date based on progress
      const daysElapsed = 145 * (percentComplete / 100); // Based on active days
      const startDateObj = new Date(startDate);
      const estimatedDate = new Date(startDateObj);
      estimatedDate.setDate(estimatedDate.getDate() + Math.round(daysElapsed));

      return {
        id: uniqueId,
        name: uniqueId, // Use unique ID as name for Recharts
        displayName: `${item.value} - ${item.label}`.length > 30 ? `${item.value} - ${item.label}`.substring(0, 30) + '...' : `${item.value} - ${item.label}`,
        fullName: `${item.value} - ${item.label}`,
        Earned: earnedValue,
        Remaining: remainingValue,
        percentComplete: percentComplete,
        lastUpdated: estimatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      };
    });

    // Sort by percent complete (lowest first), then by id for stable sorting
    return data.sort((a, b) => {
      if (a.percentComplete !== b.percentComplete) {
        return a.percentComplete - b.percentComplete;
      }
      return a.id.localeCompare(b.id);
    });
  }, [categoryTableData, chartViewType, selectedCategory, startDate, endDate]);

  // Generate dynamic chart title
  const chartTitle = useMemo(() => {
    const viewType = chartViewType === 'manhours' ? 'Manhours' : 'Cost';
    return `${selectedCategory} Budgeted v/s Earned ${viewType}`;
  }, [selectedCategory, chartViewType]);

  // Calculate dynamic tick count based on chart width
  const getTickCount = () => {
    if (typeof chartWidth === 'string') {
      // Parse percentage to approximate pixel width
      const percentage = parseInt(chartWidth);
      if (percentage > 65) return 8;
      if (percentage > 55) return 6;
      return 5;
    }
    // If width is a number (pixels)
    if (chartWidth > 700) return 8;
    if (chartWidth > 550) return 6;
    return 5;
  };

  // Custom label component for labels above bars
  const CustomBarLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const item = chartData[index];
    if (!item) return null;

    // Position label above the bar, aligned with the left edge of the bar
    const labelX = x; // Use the x position of the bar for left alignment
    const labelY = y - 6; // Consistent 6px spacing above the bar

    return (
      <text
        x={labelX}
        y={labelY}
        fill="#1F2937"
        fontSize={11}
        textAnchor="start"
        dominantBaseline="bottom"
        fontWeight="400"
      >
        {item.displayName}
      </text>
    );
  };

  // Get color based on progress percentage
  const getProgressColor = (percent: number) => {
    if (percent >= 75) return '#10B981'; // Green
    if (percent >= 50) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <div style={{
      backgroundColor: '#F7F9FC',
      minHeight: 'calc(100vh - 64px)',
      padding: '32px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Title Section with Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Project Dashboard
              </h1>
              <SubmissionStatusBadge isLocked={isProgressLocked} />
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0,
              fontStyle: 'italic'
            }}>
              Execution snapshot for progress and performance overview
            </p>
          </div>
          <button
            onClick={() => isProgressLocked ? setShowUnlockModal(true) : setShowLockModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            {isProgressLocked ? <Unlock size={16} /> : <Lock size={16} />}
            {isProgressLocked ? 'Unlock Submissions' : 'Lock Submissions'}
          </button>
        </div>

        {/* Date Range Row */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          alignItems: 'center'
        }}>
          <label style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            minWidth: '80px'
          }}>
            Start Date
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                height: '40px',
                paddingLeft: '12px',
                paddingRight: '40px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#272721',
                backgroundColor: '#FFFFFF',
                width: '180px',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                position: 'relative',
                zIndex: 10
              }}
            />
            <Calendar size={16} style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B7280',
              pointerEvents: 'none',
              zIndex: 1
            }} />
          </div>
          <label style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            minWidth: '70px'
          }}>
            End Date
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                height: '40px',
                paddingLeft: '12px',
                paddingRight: '40px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#272721',
                backgroundColor: '#FFFFFF',
                width: '180px',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                position: 'relative',
                zIndex: 10
              }}
            />
            <Calendar size={16} style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B7280',
              pointerEvents: 'none',
              zIndex: 1
            }} />
          </div>
        </div>

        {/* ROW 1: KPI Summary Strip - Enhanced with Icons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* Project Manhours Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(253, 67, 20, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} style={{ color: '#FD4314' }} />
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Project Manhours
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Budgeted
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721'
                }}>
                  {calculatedKPIs.manhours.budgeted.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Earned
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#FD4314'
                }}>
                  {calculatedKPIs.manhours.earned.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Remaining
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721'
                }}>
                  {calculatedKPIs.manhours.remaining.toLocaleString()}
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Progress</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: '#FD4314',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {calculatedKPIs.manhours.percentComplete}%
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#F3F4F6',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${calculatedKPIs.manhours.percentComplete}%`,
                  height: '100%',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Project Cost Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(253, 67, 20, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} style={{ color: '#FD4314' }} />
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Project Cost
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Budgeted
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721'
                }}>
                  ${(calculatedKPIs.cost.budgeted / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Earned
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#FD4314'
                }}>
                  ${(calculatedKPIs.cost.earned / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Remaining
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721'
                }}>
                  ${(calculatedKPIs.cost.remaining / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Progress</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: '#FD4314',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {calculatedKPIs.cost.percentComplete}%
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#F3F4F6',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${calculatedKPIs.cost.percentComplete}%`,
                  height: '100%',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Project Active Days with Target Completion */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(253, 67, 20, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} style={{ color: '#FD4314' }} />
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Project Active Days
              </h3>
            </div>
            <div style={{
              fontSize: '56px',
              fontWeight: '700',
              color: '#FD4314',
              textAlign: 'center',
              margin: '12px 0',
              lineHeight: 1,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeDays}
            </div>
            <div style={{
              backgroundColor: '#F9FAFB',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Calendar size={14} style={{ color: '#6B7280' }} />
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  marginBottom: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Target Completion
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721'
                }}>
                  {targetCompletionDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Primary Visual - Bar Chart with Overall Install Quantity */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '28px',
          alignItems: 'flex-start'
        }}>
          {/* Left: Bar Chart - Resizable */}
          <Resizable
            size={{
              width: chartWidth,
              height: 'auto'
            }}
            minWidth="45%"
            maxWidth="75%"
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            onResizeStop={(e, direction, ref, d) => {
              if (direction === 'right') {
                setChartWidth(ref.style.width);
              }
            }}
            handleStyles={{
              right: {
                background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)',
                width: '8px',
                right: '-4px',
                cursor: 'ew-resize',
                borderRadius: '4px'
              }
            }}
          >
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '24px 24px 12px 24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chart Controls Row (Dropdown + Toggle) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #E5E7EB',
                gap: '20px'
              }}>
                {/* Custom Dropdown with Search Icon */}
                <div style={{ position: 'relative', width: '360px', minWidth: '200px', flex: 1, maxWidth: '360px' }}>
                  <Search size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '40px',
                      paddingRight: '36px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#272721',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      backgroundSize: '18px',
                      outline: 'none'
                    }}
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manhours / Cost Toggle */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => setChartViewType('manhours')}
                    style={{
                      padding: '8px 20px',
                      border: chartViewType === 'manhours' ? '1px solid #FD4314' : '1px solid #E5E7EB',
                      backgroundColor: chartViewType === 'manhours' ? '#FD4314' : '#FFFFFF',
                      color: chartViewType === 'manhours' ? '#FFFFFF' : '#6B7280',
                      fontSize: '13px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Manhours
                  </button>
                  <button
                    onClick={() => setChartViewType('cost')}
                    style={{
                      padding: '8px 20px',
                      border: chartViewType === 'cost' ? '1px solid #FD4314' : '1px solid #E5E7EB',
                      backgroundColor: chartViewType === 'cost' ? '#FD4314' : '#FFFFFF',
                      color: chartViewType === 'cost' ? '#FFFFFF' : '#6B7280',
                      fontSize: '13px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cost
                  </button>
                </div>
              </div>

              {/* Chart Legend Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                {/* Dynamic Chart Title */}
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: 0
                }}>
                  {chartTitle}
                </h3>
                
                {/* Legend */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#FD4314',
                      borderRadius: '2px'
                    }} />
                    <span style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontWeight: '500'
                    }}>Earned</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '2px'
                    }} />
                    <span style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontWeight: '500'
                    }}>Remaining</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart - Height Resizable */}
              <Resizable
                size={{
                  width: '100%',
                  height: chartHeight
                }}
                minHeight={280}
                maxHeight={600}
                enable={{
                  top: false,
                  right: false,
                  bottom: true,
                  left: false,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false
                }}
                onResizeStop={(e, direction, ref, d) => {
                  if (direction === 'bottom') {
                    setChartHeight(parseInt(ref.style.height));
                  }
                }}
                handleStyles={{
                  bottom: {
                    background: 'linear-gradient(180deg, transparent 0%, #E5E7EB 50%, transparent 100%)',
                    height: '8px',
                    bottom: '-4px',
                    cursor: 'ns-resize',
                    borderRadius: '4px'
                  }
                }}
                style={{
                  marginBottom: '0'
                }}
                key={`chart-resizable-${selectedCategory}`}
              >
                <div style={{ width: '100%', height: chartHeight, position: 'relative', minWidth: 300 }} key={`chart-container-${selectedCategory}`}>
                  <ResponsiveContainer width="100%" height={chartHeight} minWidth={300}>
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                      barCategoryGap="25%"
                    >
                      <CartesianGrid
                        key="grid"
                        strokeDasharray="3 3"
                        stroke="#D1D5DB"
                        strokeOpacity={0.6}
                        horizontal={false}
                        vertical={true}
                      />
                      <XAxis
                        key="xaxis"
                        type="number"
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                        stroke="#E5E7EB"
                        tickCount={getTickCount()}
                      />
                      <YAxis
                        key="yaxis"
                        dataKey="name"
                        type="category"
                        width={0}
                        tick={false}
                        stroke="#E5E7EB"
                      />
                      <Tooltip
                        key="tooltip"
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px',
                          padding: '12px'
                        }}
                        labelStyle={{ fontWeight: '600', marginBottom: '8px', color: '#272721' }}
                        itemStyle={{ padding: '2px 0', color: '#4B5563' }}
                        labelFormatter={(value) => {
                          const item = chartData.find(d => d.name === value);
                          return item ? item.fullName : value;
                        }}
                        formatter={(value: any, name: string, props: any) => {
                          const displayValue = chartViewType === 'cost'
                            ? `$${(value / 1000).toFixed(1)}K`
                            : value.toLocaleString();
                          return [displayValue, name];
                        }}
                        content={(props: any) => {
                          if (!props.active || !props.payload || props.payload.length === 0) return null;
                          
                          const data = props.payload[0].payload;
                          const earned = data.Earned;
                          const remaining = data.Remaining;
                          const total = earned + remaining;
                          const percent = data.percentComplete.toFixed(1);
                          
                          return (
                            <div style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                              <div style={{
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#272721',
                                fontSize: '13px',
                                borderBottom: '1px solid #E5E7EB',
                                paddingBottom: '6px'
                              }}>
                                {data.fullName}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                                  <span style={{ color: '#6B7280', fontSize: '12px' }}>Budgeted:</span>
                                  <span style={{ color: '#272721', fontSize: '12px', fontWeight: '600' }}>
                                    {chartViewType === 'cost' ? `$${(total / 1000).toFixed(1)}K` : total.toLocaleString()}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                                  <span style={{ color: '#6B7280', fontSize: '12px' }}>
                                    <span style={{ 
                                      display: 'inline-block', 
                                      width: '8px', 
                                      height: '8px', 
                                      backgroundColor: '#FD4314', 
                                      marginRight: '6px',
                                      borderRadius: '2px'
                                    }}></span>
                                    Earned:
                                  </span>
                                  <span style={{ color: '#FD4314', fontSize: '12px', fontWeight: '600' }}>
                                    {chartViewType === 'cost' ? `$${(earned / 1000).toFixed(1)}K` : earned.toLocaleString()}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                                  <span style={{ color: '#6B7280', fontSize: '12px' }}>
                                    <span style={{ 
                                      display: 'inline-block', 
                                      width: '8px', 
                                      height: '8px', 
                                      backgroundColor: '#E5E7EB', 
                                      marginRight: '6px',
                                      borderRadius: '2px'
                                    }}></span>
                                    Remaining:
                                  </span>
                                  <span style={{ color: '#6B7280', fontSize: '12px', fontWeight: '600' }}>
                                    {chartViewType === 'cost' ? `$${(remaining / 1000).toFixed(1)}K` : remaining.toLocaleString()}
                                  </span>
                                </div>
                                <div style={{ 
                                  borderTop: '1px solid #E5E7EB', 
                                  marginTop: '4px', 
                                  paddingTop: '6px',
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  gap: '24px'
                                }}>
                                  <span style={{ color: '#6B7280', fontSize: '12px' }}>Progress:</span>
                                  <span style={{ 
                                    color: '#FFFFFF', 
                                    fontSize: '11px', 
                                    fontWeight: '600',
                                    backgroundColor: '#FD4314',
                                    padding: '2px 8px',
                                    borderRadius: '4px'
                                  }}>
                                    {percent}%
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                                  <span style={{ color: '#6B7280', fontSize: '11px' }}>Last Updated:</span>
                                  <span style={{ color: '#4B5563', fontSize: '11px', fontWeight: '500' }}>
                                    {data.lastUpdated}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Bar
                        key="earned-bar"
                        dataKey="Earned"
                        stackId="a"
                        fill="#FD4314"
                        isAnimationActive={false}
                        radius={[4, 0, 0, 4]}
                      >
                        <LabelList
                          content={CustomBarLabel}
                        />
                      </Bar>
                      <Bar
                        key="remaining-bar"
                        dataKey="Remaining"
                        stackId="a"
                        fill="#E5E7EB"
                        isAnimationActive={false}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Resizable>

              {/* Resize Instructions - Positioned to avoid overlap */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #F3F4F6'
              }}>
                <div style={{
                  fontSize: '10px',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>↔</span>
                  <span>Drag right edge to resize width</span>
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>↕</span>
                  <span>Drag bottom edge to resize height</span>
                </div>
              </div>
            </div>
          </Resizable>

          {/* Right: Overall Install Quantity Table */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 16px 0'
            }}>
              Overall Install Quantity
            </h3>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              minHeight: 0
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#E8F1F8',
                    borderBottom: '1px solid #D1E3F0'
                  }}>
                    <th style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>Descriptor</th>
                    <th style={{
                      padding: '14px 16px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>UOM</th>
                    <th style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>Planned</th>
                    <th style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>Installed</th>
                    <th style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>To Go</th>
                    <th style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>% Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedQuantityData.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8FBFD',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      <td style={{
                        padding: '14px 16px',
                        fontSize: '13px',
                        color: '#1F2937',
                        fontWeight: '400'
                      }}>{item.descriptor}</td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#4B5563'
                      }}>{item.uom}</td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontSize: '13px',
                        color: '#1F2937'
                      }}>{item.totalPlanned.toLocaleString()}</td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontSize: '13px',
                        color: '#1F2937',
                        fontWeight: '600'
                      }}>{item.installedToDate.toLocaleString()}</td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontSize: '13px',
                        color: '#4B5563'
                      }}>{item.toGo.toLocaleString()}</td>
                      <td style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontSize: '13px',
                        color: '#DC2626',
                        fontWeight: '600'
                      }}>{item.percentComplete}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <LockSubmissionsModal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        onConfirm={handleLockConfirm}
      />
      <UnlockSubmissionsModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={handleUnlockConfirm}
      />
    </div>
  );
}