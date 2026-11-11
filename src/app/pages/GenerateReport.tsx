// Reports component with dynamic grouping functionality
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Calendar, TrendingUp, DollarSign, Package, Download, Save, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';
import { formatDate } from '../components/EnterpriseTable';

type ReportTab = 'manhours' | 'cost' | 'quantity';
type GroupByOption = 'area' | 'discipline' | 'tradePackage' | 'subcontractor' | 'spa' | 'roc' | 'costType' | 'scope' | 'costCode' | 'tasks';

interface ReportFilters {
  startDate: string;
  endDate: string;
  groupBy: GroupByOption | '';
}

interface ManhoursRow {
  id: string;
  code: string;
  name: string;
  weighting: number;
  originalBudget: number;
  agreedChanges: number;
  currentBudget: number;
  periodPercentEarned: number;
  earnedHours: number;
  spi: number;
  toDatePercentEarned: number;
  earnedHoursToDate: number;
  actualHrs: number;
  toGo: number;
  spiToDate: number;
  cpi: number;
  area?: string;
  discipline?: string;
  tradePackage?: string;
  subcontractor?: string;
  spa?: string;
  roc?: string;
  costType?: string;
  scope?: string;
  costCode?: string;
}

interface QuantityRow {
  id: string;
  code: string;
  name: string;
  uom: string;
  totalQuantity: number;
  installedPeriod: number;
  percentPeriod: number;
  installedToDate: number;
  toGo: number;
  percentComplete: number;
  area?: string;
  discipline?: string;
  tradePackage?: string;
  subcontractor?: string;
  spa?: string;
  roc?: string;
  costType?: string;
  scope?: string;
  costCode?: string;
}

interface CostRow {
  id: string;
  code: string;
  name: string;
  weighting: number;
  originalBudget: number;
  agreedChanges: number;
  currentBudget: number;
  percentEarned: number;
  earnedCost: number;
  actualCost: number;
  spi: number;
  cpi: number;
  percentEarnedToDate: number;
  earnedCostToDate: number;
  toGoCost: number;
  spiToDate: number;
  cpiToDate: number;
  area?: string;
  discipline?: string;
  tradePackage?: string;
  subcontractor?: string;
  spa?: string;
  roc?: string;
  costType?: string;
  scope?: string;
  costCode?: string;
}

export default function GenerateReport() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';
  
  const [activeTab, setActiveTab] = useState<ReportTab>('manhours');
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    groupBy: ''
  });
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<Set<ReportTab>>(new Set());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filterSectionCollapsed, setFilterSectionCollapsed] = useState(false);

  // Mock Manhours Data
  const mockManhoursData: ManhoursRow[] = [
    {
      id: '1',
      code: 'DCH-001',
      name: 'Data Centre Hall',
      weighting: 27.60,
      originalBudget: 237098,
      agreedChanges: 20000,
      currentBudget: 257098,
      periodPercentEarned: 9.30,
      earnedHours: 21993,
      spi: 0.92,
      toDatePercentEarned: 65.80,
      earnedHoursToDate: 155982,
      actualHrs: 0,
      toGo: 101116,
      spiToDate: 0.8,
      cpi: 0,
      area: 'Data Centre Hall',
      discipline: 'Multi-discipline',
      tradePackage: 'TP-001',
      subcontractor: 'Various',
      spa: 'SPA-01',
      roc: 'Data Centre',
      costType: 'Direct Cost',
      scope: 'Data Centre Development',
      costCode: 'CC-1000'
    },
    {
      id: '2',
      code: 'EY-002',
      name: 'Electrical Yard',
      weighting: 21.60,
      originalBudget: 185311,
      agreedChanges: 0,
      currentBudget: 185311,
      periodPercentEarned: 13.10,
      earnedHours: 24232,
      spi: 1.28,
      toDatePercentEarned: 70.80,
      earnedHoursToDate: 131177,
      actualHrs: 0,
      toGo: 54134,
      spiToDate: 0.7,
      cpi: 0,
      area: 'Electrical Yard',
      discipline: 'Electrical',
      tradePackage: 'TP-002',
      subcontractor: 'Electrical Contractors Ltd',
      spa: 'SPA-02',
      roc: 'Electrical Infrastructure',
      costType: 'Direct Cost',
      scope: 'Electrical Yard Works',
      costCode: 'CC-2000'
    },
    {
      id: '3',
      code: 'FSA-003',
      name: 'Facility Support Area',
      weighting: 13.30,
      originalBudget: 114146,
      agreedChanges: 0,
      currentBudget: 114146,
      periodPercentEarned: 3.90,
      earnedHours: 4431,
      spi: 2.94,
      toDatePercentEarned: 80.80,
      earnedHoursToDate: 92204,
      actualHrs: 0,
      toGo: 21942,
      spiToDate: 0.8,
      cpi: 0,
      area: 'Facility Support Area',
      discipline: 'Multi-discipline',
      tradePackage: 'TP-003',
      subcontractor: 'Support Services Inc',
      spa: 'SPA-03',
      roc: 'Support Facilities',
      costType: 'Indirect Cost',
      scope: 'Support Infrastructure',
      costCode: 'CC-3000'
    },
    {
      id: '4',
      code: 'MY-004',
      name: 'Mechanical Yard',
      weighting: 29.20,
      originalBudget: 250996,
      agreedChanges: 0,
      currentBudget: 250996,
      periodPercentEarned: 5.40,
      earnedHours: 13677,
      spi: 0.83,
      toDatePercentEarned: 56.20,
      earnedHoursToDate: 140949,
      actualHrs: 0,
      toGo: 110048,
      spiToDate: 0.6,
      cpi: 0,
      area: 'Mechanical Yard',
      discipline: 'Mechanical',
      tradePackage: 'TP-004',
      subcontractor: 'Mechanical Systems Ltd',
      spa: 'SPA-04',
      roc: 'Mechanical Infrastructure',
      costType: 'Direct Cost',
      scope: 'Mechanical Yard Development',
      costCode: 'CC-4000'
    },
    {
      id: '5',
      code: 'SR-005',
      name: 'Security Room Fit Out',
      weighting: 4.70,
      originalBudget: 40222,
      agreedChanges: 0,
      currentBudget: 40222,
      periodPercentEarned: 0.30,
      earnedHours: 123,
      spi: 0.03,
      toDatePercentEarned: 0.70,
      earnedHoursToDate: 262,
      actualHrs: 0,
      toGo: 39960,
      spiToDate: 0,
      cpi: 0,
      area: 'Security Room',
      discipline: 'Fit-Out',
      tradePackage: 'TP-005',
      subcontractor: 'Security Fit-Out Specialists',
      spa: 'SPA-05',
      roc: 'Security Infrastructure',
      costType: 'Direct Cost',
      scope: 'Security Room Development',
      costCode: 'CC-5000'
    },
    {
      id: '6',
      code: 'SUB-006',
      name: 'Substation',
      weighting: 3.70,
      originalBudget: 31703,
      agreedChanges: 0,
      currentBudget: 31703,
      periodPercentEarned: 26.60,
      earnedHours: 8445,
      spi: 0,
      toDatePercentEarned: 86.30,
      earnedHoursToDate: 27363,
      actualHrs: 0,
      toGo: 4340,
      spiToDate: 0.9,
      cpi: 0,
      area: 'Substation',
      discipline: 'Electrical',
      tradePackage: 'TP-006',
      subcontractor: 'Power Systems Inc',
      spa: 'SPA-06',
      roc: 'Power Infrastructure',
      costType: 'Direct Cost',
      scope: 'Substation Development',
      costCode: 'CC-6000'
    },
    {
      id: '7',
      code: 'HVAC-007',
      name: 'HVAC Installation',
      weighting: 12.50,
      originalBudget: 95000,
      agreedChanges: 5000,
      currentBudget: 100000,
      periodPercentEarned: 8.20,
      earnedHours: 8200,
      spi: 1.05,
      toDatePercentEarned: 45.50,
      earnedHoursToDate: 45500,
      actualHrs: 0,
      toGo: 54500,
      spiToDate: 0.75,
      cpi: 0,
      area: 'Main Building',
      discipline: 'HVAC',
      tradePackage: 'TP-007',
      subcontractor: 'Climate Control Systems',
      spa: 'SPA-07',
      roc: 'HVAC Systems',
      costType: 'Direct Cost',
      scope: 'Mechanical Installation',
      costCode: 'CC-7000'
    },
    {
      id: '8',
      code: 'PLB-008',
      name: 'Plumbing Works',
      weighting: 8.40,
      originalBudget: 72000,
      agreedChanges: 3000,
      currentBudget: 75000,
      periodPercentEarned: 12.30,
      earnedHours: 9225,
      spi: 0.98,
      toDatePercentEarned: 62.00,
      earnedHoursToDate: 46500,
      actualHrs: 0,
      toGo: 28500,
      spiToDate: 0.82,
      cpi: 0,
      area: 'Main Building',
      discipline: 'Plumbing',
      tradePackage: 'TP-008',
      subcontractor: 'Plumbing Contractors Ltd',
      spa: 'SPA-08',
      roc: 'Plumbing Installation',
      costType: 'Direct Cost',
      scope: 'Plumbing & Drainage',
      costCode: 'CC-8000'
    },
    {
      id: '9',
      code: 'FAS-009',
      name: 'Fire Alarm System',
      weighting: 6.20,
      originalBudget: 53000,
      agreedChanges: 0,
      currentBudget: 53000,
      periodPercentEarned: 15.40,
      earnedHours: 8162,
      spi: 1.12,
      toDatePercentEarned: 78.50,
      earnedHoursToDate: 41605,
      actualHrs: 0,
      toGo: 11395,
      spiToDate: 0.88,
      cpi: 0,
      area: 'Security Zone',
      discipline: 'Fire Protection',
      tradePackage: 'TP-009',
      subcontractor: 'Fire Safety Solutions',
      spa: 'SPA-09',
      roc: 'Fire Alarm',
      costType: 'Safety & Compliance',
      scope: 'Fire Protection Systems',
      costCode: 'CC-9000'
    },
    {
      id: '10',
      code: 'DNC-010',
      name: 'Data Network Cabling',
      weighting: 5.80,
      originalBudget: 48500,
      agreedChanges: 2500,
      currentBudget: 51000,
      periodPercentEarned: 10.50,
      earnedHours: 5355,
      spi: 0.95,
      toDatePercentEarned: 55.20,
      earnedHoursToDate: 28152,
      actualHrs: 0,
      toGo: 22848,
      spiToDate: 0.79,
      cpi: 0,
      area: 'IT Infrastructure',
      discipline: 'IT & Communications',
      tradePackage: 'TP-010',
      subcontractor: 'Network Systems Inc',
      spa: 'SPA-10',
      roc: 'Network Cabling',
      costType: 'Technology',
      scope: 'IT Infrastructure',
      costCode: 'CC-10000'
    },
    {
      id: '11',
      code: 'AF-011',
      name: 'Architectural Finishes',
      weighting: 9.30,
      originalBudget: 78000,
      agreedChanges: 0,
      currentBudget: 78000,
      periodPercentEarned: 7.80,
      earnedHours: 6084,
      spi: 1.15,
      toDatePercentEarned: 38.40,
      earnedHoursToDate: 29952,
      actualHrs: 0,
      toGo: 48048,
      spiToDate: 0.72,
      cpi: 0,
      area: 'Office Wing',
      discipline: 'Architectural',
      tradePackage: 'TP-011',
      subcontractor: 'Interior Finishes Ltd',
      spa: 'SPA-11',
      roc: 'Interior Finishes',
      costType: 'Direct Cost',
      scope: 'Architectural Works',
      costCode: 'CC-11000'
    },
    {
      id: '12',
      code: 'LS-012',
      name: 'Landscaping',
      weighting: 4.20,
      originalBudget: 35000,
      agreedChanges: 1500,
      currentBudget: 36500,
      periodPercentEarned: 5.60,
      earnedHours: 2044,
      spi: 0.88,
      toDatePercentEarned: 22.30,
      earnedHoursToDate: 8140,
      actualHrs: 0,
      toGo: 28360,
      spiToDate: 0.65,
      cpi: 0,
      area: 'External Areas',
      discipline: 'Landscaping',
      tradePackage: 'TP-012',
      subcontractor: 'Green Spaces Ltd',
      spa: 'SPA-12',
      roc: 'Landscape Works',
      costType: 'Site Development',
      scope: 'External Works',
      costCode: 'CC-12000'
    }
  ];

  // Mock Quantity Data (by UOM)
  const mockQuantityData: QuantityRow[] = [
    // Area A
    {
      id: 'q1',
      code: 'CI-001',
      name: 'Cable Installation',
      uom: 'LM',
      totalQuantity: 2100,
      installedPeriod: 310,
      percentPeriod: 14.8,
      installedToDate: 1500,
      toGo: 600,
      percentComplete: 71,
      area: 'Area A',
      discipline: 'Electrical',
      tradePackage: 'TP-001',
      subcontractor: 'Electrical Contractors',
      spa: 'SPA-01',
      roc: 'Cable Installation',
      costType: 'Direct Cost',
      scope: 'Electrical Infrastructure',
      costCode: 'CC-1000'
    },
    {
      id: 'q2',
      code: 'SP-002',
      name: 'Sprinkler Piping',
      uom: 'LM',
      totalQuantity: 1200,
      installedPeriod: 200,
      percentPeriod: 16.7,
      installedToDate: 800,
      toGo: 400,
      percentComplete: 67,
      area: 'Area A',
      discipline: 'Mechanical',
      tradePackage: 'TP-002',
      subcontractor: 'Mechanical Systems Ltd',
      spa: 'SPA-02',
      roc: 'Sprinkler Piping',
      costType: 'Direct Cost',
      scope: 'Fire Protection Systems',
      costCode: 'CC-2000'
    },
    {
      id: 'q3',
      code: 'CI-003',
      name: 'Ceiling Installation',
      uom: 'm²',
      totalQuantity: 4200,
      installedPeriod: 620,
      percentPeriod: 14.8,
      installedToDate: 3010,
      toGo: 1190,
      percentComplete: 72,
      area: 'Area A',
      discipline: 'Architectural',
      tradePackage: 'TP-003',
      subcontractor: 'Fit-Out Specialists',
      spa: 'SPA-03',
      roc: 'Ceiling Installation',
      costType: 'Direct Cost',
      scope: 'Interior Finishes',
      costCode: 'CC-3000'
    },
    {
      id: 'q4',
      code: 'SS-004',
      name: 'Structural Steel',
      uom: 'MT',
      totalQuantity: 950,
      installedPeriod: 120,
      percentPeriod: 12.6,
      installedToDate: 600,
      toGo: 350,
      percentComplete: 63,
      area: 'Area A',
      discipline: 'Structural',
      tradePackage: 'TP-004',
      subcontractor: 'Steel Contractors Inc',
      spa: 'SPA-04',
      roc: 'Structural Steel',
      costType: 'Direct Cost',
      scope: 'Structural Works',
      costCode: 'CC-4000'
    },
    // Area B
    {
      id: 'q5',
      code: 'CI-005',
      name: 'Cable Installation',
      uom: 'LM',
      totalQuantity: 1800,
      installedPeriod: 250,
      percentPeriod: 13.9,
      installedToDate: 1200,
      toGo: 600,
      percentComplete: 67,
      area: 'Area B',
      discipline: 'Electrical',
      tradePackage: 'TP-001',
      subcontractor: 'Electrical Contractors',
      spa: 'SPA-01',
      roc: 'Cable Installation',
      costType: 'Direct Cost',
      scope: 'Electrical Infrastructure',
      costCode: 'CC-1000'
    },
    {
      id: 'q6',
      code: 'SP-006',
      name: 'Sprinkler Piping',
      uom: 'LM',
      totalQuantity: 900,
      installedPeriod: 150,
      percentPeriod: 16.7,
      installedToDate: 550,
      toGo: 350,
      percentComplete: 61,
      area: 'Area B',
      discipline: 'Mechanical',
      tradePackage: 'TP-002',
      subcontractor: 'Mechanical Systems Ltd',
      spa: 'SPA-02',
      roc: 'Sprinkler Piping',
      costType: 'Direct Cost',
      scope: 'Fire Protection Systems',
      costCode: 'CC-2000'
    },
    {
      id: 'q7',
      code: 'CI-007',
      name: 'Ceiling Installation',
      uom: 'm²',
      totalQuantity: 3800,
      installedPeriod: 560,
      percentPeriod: 14.7,
      installedToDate: 2720,
      toGo: 1080,
      percentComplete: 72,
      area: 'Area B',
      discipline: 'Architectural',
      tradePackage: 'TP-003',
      subcontractor: 'Fit-Out Specialists',
      spa: 'SPA-03',
      roc: 'Ceiling Installation',
      costType: 'Direct Cost',
      scope: 'Interior Finishes',
      costCode: 'CC-3000'
    },
    {
      id: 'q8',
      code: 'SS-008',
      name: 'Structural Steel',
      uom: 'MT',
      totalQuantity: 1000,
      installedPeriod: 1000,
      percentPeriod: 100,
      installedToDate: 1000,
      toGo: 0,
      percentComplete: 100,
      area: 'Area B',
      discipline: 'Structural',
      tradePackage: 'TP-004',
      subcontractor: 'Steel Contractors Inc',
      spa: 'SPA-04',
      roc: 'Structural Steel',
      costType: 'Direct Cost',
      scope: 'Structural Works',
      costCode: 'CC-4000'
    },
    {
      id: 'q11',
      code: 'PDP-011',
      name: 'Power Distribution Panels',
      uom: 'No',
      totalQuantity: 45,
      installedPeriod: 8,
      percentPeriod: 17.8,
      installedToDate: 39,
      toGo: 6,
      percentComplete: 87,
      area: 'Substation',
      discipline: 'Electrical',
      tradePackage: 'TP-011',
      subcontractor: 'Power Systems Inc',
      spa: 'SPA-11',
      roc: 'Power Infrastructure',
      costType: 'Direct Cost',
      scope: 'Electrical Infrastructure',
      costCode: 'CC-11000'
    },
    {
      id: 'q12',
      code: 'SC-012',
      name: 'Security Cameras',
      uom: 'No',
      totalQuantity: 95,
      installedPeriod: 12,
      percentPeriod: 12.6,
      installedToDate: 5,
      toGo: 90,
      percentComplete: 5,
      area: 'Security Room',
      discipline: 'Security Systems',
      tradePackage: 'TP-012',
      subcontractor: 'Security Fit-Out Specialists',
      spa: 'SPA-12',
      roc: 'Security Infrastructure',
      costType: 'Safety & Compliance',
      scope: 'Security Systems',
      costCode: 'CC-12000'
    }
  ];

  // Mock Cost Data
  const mockCostData: CostRow[] = [
    {
      id: 'c1',
      code: 'DCH-001',
      name: 'Data Centre Hall',
      weighting: 27.60,
      originalBudget: 237098,
      agreedChanges: 20000,
      currentBudget: 257098,
      percentEarned: 9.30,
      earnedCost: 21993,
      actualCost: 0,
      spi: 0.92,
      cpi: 0,
      percentEarnedToDate: 65.80,
      earnedCostToDate: 155982,
      toGoCost: 101116,
      spiToDate: 0.8,
      cpiToDate: 0,
      area: 'Data Centre Hall',
      discipline: 'Multi-discipline',
      tradePackage: 'TP-001',
      subcontractor: 'Various',
      spa: 'SPA-01',
      roc: 'Data Centre',
      costType: 'Direct Cost',
      scope: 'Data Centre Development',
      costCode: 'CC-1000'
    },
    {
      id: 'c2',
      code: 'EY-002',
      name: 'Electrical Yard',
      weighting: 21.60,
      originalBudget: 185311,
      agreedChanges: 0,
      currentBudget: 185311,
      percentEarned: 13.10,
      earnedCost: 24232,
      actualCost: 0,
      spi: 1.28,
      cpi: 0,
      percentEarnedToDate: 70.80,
      earnedCostToDate: 131177,
      toGoCost: 54134,
      spiToDate: 0.7,
      cpiToDate: 0,
      area: 'Electrical Yard',
      discipline: 'Electrical',
      tradePackage: 'TP-002',
      subcontractor: 'Electrical Contractors Ltd',
      spa: 'SPA-02',
      roc: 'Electrical Infrastructure',
      costType: 'Direct Cost',
      scope: 'Electrical Yard Works',
      costCode: 'CC-2000'
    },
    {
      id: 'c3',
      code: 'FSA-003',
      name: 'Facility Support Area',
      weighting: 13.30,
      originalBudget: 114146,
      agreedChanges: 0,
      currentBudget: 114146,
      percentEarned: 3.90,
      earnedCost: 4431,
      actualCost: 0,
      spi: 2.94,
      cpi: 0,
      percentEarnedToDate: 80.80,
      earnedCostToDate: 92204,
      toGoCost: 21942,
      spiToDate: 0.8,
      cpiToDate: 0,
      area: 'Facility Support Area',
      discipline: 'Multi-discipline',
      tradePackage: 'TP-003',
      subcontractor: 'Support Services Inc',
      spa: 'SPA-03',
      roc: 'Support Facilities',
      costType: 'Indirect Cost',
      scope: 'Support Infrastructure',
      costCode: 'CC-3000'
    },
    {
      id: 'c4',
      code: 'MY-004',
      name: 'Mechanical Yard',
      weighting: 29.20,
      originalBudget: 250996,
      agreedChanges: 0,
      currentBudget: 250996,
      percentEarned: 5.40,
      earnedCost: 13677,
      actualCost: 0,
      spi: 0.83,
      cpi: 0,
      percentEarnedToDate: 56.20,
      earnedCostToDate: 140949,
      toGoCost: 110048,
      spiToDate: 0.6,
      cpiToDate: 0,
      area: 'Mechanical Yard',
      discipline: 'Mechanical',
      tradePackage: 'TP-004',
      subcontractor: 'Mechanical Systems Ltd',
      spa: 'SPA-04',
      roc: 'Mechanical Infrastructure',
      costType: 'Direct Cost',
      scope: 'Mechanical Yard Development',
      costCode: 'CC-4000'
    },
    {
      id: 'c5',
      code: 'SR-005',
      name: 'Security Room Fit Out',
      weighting: 4.70,
      originalBudget: 40222,
      agreedChanges: 0,
      currentBudget: 40222,
      percentEarned: 0.30,
      earnedCost: 123,
      actualCost: 0,
      spi: 0.03,
      cpi: 0,
      percentEarnedToDate: 0.70,
      earnedCostToDate: 262,
      toGoCost: 39960,
      spiToDate: 0,
      cpiToDate: 0,
      area: 'Security Room',
      discipline: 'Fit-Out',
      tradePackage: 'TP-005',
      subcontractor: 'Security Fit-Out Specialists',
      spa: 'SPA-05',
      roc: 'Security Infrastructure',
      costType: 'Direct Cost',
      scope: 'Security Room Development',
      costCode: 'CC-5000'
    },
    {
      id: 'c6',
      code: 'SUB-006',
      name: 'Substation',
      weighting: 3.70,
      originalBudget: 31703,
      agreedChanges: 0,
      currentBudget: 31703,
      percentEarned: 26.60,
      earnedCost: 8445,
      actualCost: 0,
      spi: 0,
      cpi: 0,
      percentEarnedToDate: 86.30,
      earnedCostToDate: 27363,
      toGoCost: 4340,
      spiToDate: 0.9,
      cpiToDate: 0,
      area: 'Substation',
      discipline: 'Electrical',
      tradePackage: 'TP-006',
      subcontractor: 'Power Systems Inc',
      spa: 'SPA-06',
      roc: 'Power Infrastructure',
      costType: 'Direct Cost',
      scope: 'Substation Development',
      costCode: 'CC-6000'
    },
    {
      id: 'c7',
      code: 'HVAC-007',
      name: 'HVAC Installation',
      weighting: 12.50,
      originalBudget: 95000,
      agreedChanges: 5000,
      currentBudget: 100000,
      percentEarned: 8.20,
      earnedCost: 8200,
      actualCost: 0,
      spi: 1.05,
      cpi: 0,
      percentEarnedToDate: 45.50,
      earnedCostToDate: 45500,
      toGoCost: 54500,
      spiToDate: 0.75,
      cpiToDate: 0,
      area: 'Main Building',
      discipline: 'HVAC',
      tradePackage: 'TP-007',
      subcontractor: 'Climate Control Systems',
      spa: 'SPA-07',
      roc: 'HVAC Systems',
      costType: 'Direct Cost',
      scope: 'Mechanical Installation',
      costCode: 'CC-7000'
    },
    {
      id: 'c8',
      code: 'PLB-008',
      name: 'Plumbing Works',
      weighting: 8.40,
      originalBudget: 72000,
      agreedChanges: 3000,
      currentBudget: 75000,
      percentEarned: 12.30,
      earnedCost: 9225,
      actualCost: 0,
      spi: 0.98,
      cpi: 0,
      percentEarnedToDate: 62.00,
      earnedCostToDate: 46500,
      toGoCost: 28500,
      spiToDate: 0.82,
      cpiToDate: 0,
      area: 'Main Building',
      discipline: 'Plumbing',
      tradePackage: 'TP-008',
      subcontractor: 'Plumbing Contractors Ltd',
      spa: 'SPA-08',
      roc: 'Plumbing Installation',
      costType: 'Direct Cost',
      scope: 'Plumbing & Drainage',
      costCode: 'CC-8000'
    },
    {
      id: 'c9',
      code: 'FAS-009',
      name: 'Fire Alarm System',
      weighting: 6.20,
      originalBudget: 53000,
      agreedChanges: 0,
      currentBudget: 53000,
      percentEarned: 15.40,
      earnedCost: 8162,
      actualCost: 0,
      spi: 1.12,
      cpi: 0,
      percentEarnedToDate: 78.50,
      earnedCostToDate: 41605,
      toGoCost: 11395,
      spiToDate: 0.88,
      cpiToDate: 0,
      area: 'Security Zone',
      discipline: 'Fire Protection',
      tradePackage: 'TP-009',
      subcontractor: 'Fire Safety Solutions',
      spa: 'SPA-09',
      roc: 'Fire Alarm',
      costType: 'Safety & Compliance',
      scope: 'Fire Protection Systems',
      costCode: 'CC-9000'
    },
    {
      id: 'c10',
      code: 'DNC-010',
      name: 'Data Network Cabling',
      weighting: 5.80,
      originalBudget: 48500,
      agreedChanges: 2500,
      currentBudget: 51000,
      percentEarned: 10.50,
      earnedCost: 5355,
      actualCost: 0,
      spi: 0.95,
      cpi: 0,
      percentEarnedToDate: 55.20,
      earnedCostToDate: 28152,
      toGoCost: 22848,
      spiToDate: 0.79,
      cpiToDate: 0,
      area: 'IT Infrastructure',
      discipline: 'IT & Communications',
      tradePackage: 'TP-010',
      subcontractor: 'Network Systems Inc',
      spa: 'SPA-10',
      roc: 'Network Cabling',
      costType: 'Technology',
      scope: 'IT Infrastructure',
      costCode: 'CC-10000'
    },
    {
      id: 'c11',
      code: 'AF-011',
      name: 'Architectural Finishes',
      weighting: 9.30,
      originalBudget: 78000,
      agreedChanges: 0,
      currentBudget: 78000,
      percentEarned: 7.80,
      earnedCost: 6084,
      actualCost: 0,
      spi: 1.15,
      cpi: 0,
      percentEarnedToDate: 38.40,
      earnedCostToDate: 29952,
      toGoCost: 48048,
      spiToDate: 0.72,
      cpiToDate: 0,
      area: 'Office Wing',
      discipline: 'Architectural',
      tradePackage: 'TP-011',
      subcontractor: 'Interior Finishes Ltd',
      spa: 'SPA-11',
      roc: 'Interior Finishes',
      costType: 'Direct Cost',
      scope: 'Architectural Works',
      costCode: 'CC-11000'
    },
    {
      id: 'c12',
      code: 'LS-012',
      name: 'Landscaping',
      weighting: 4.20,
      originalBudget: 35000,
      agreedChanges: 1500,
      currentBudget: 36500,
      percentEarned: 5.60,
      earnedCost: 2044,
      actualCost: 0,
      spi: 0.88,
      cpi: 0,
      percentEarnedToDate: 22.30,
      earnedCostToDate: 8140,
      toGoCost: 28360,
      spiToDate: 0.65,
      cpiToDate: 0,
      area: 'External Areas',
      discipline: 'Landscaping',
      tradePackage: 'TP-012',
      subcontractor: 'Green Spaces Ltd',
      spa: 'SPA-12',
      roc: 'Landscape Works',
      costType: 'Site Development',
      scope: 'External Works',
      costCode: 'CC-12000'
    }
  ];

  const handleFilterChange = (field: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickFilter = (type: 'lastMonth' | 'thisMonth') => {
    const now = new Date();
    if (type === 'thisMonth') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setFilters(prev => ({
        ...prev,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      }));
    } else {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      setFilters(prev => ({
        ...prev,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      }));
    }
  };

  const handleGenerateReport = () => {
    if (filters.startDate && filters.endDate && filters.groupBy) {
      setReportGenerated(true);
      setGeneratedReports(new Set(['manhours', 'cost', 'quantity']));
      setFilterSectionCollapsed(true);
    }
  };

  const getGroupByLabel = () => {
    switch (filters.groupBy) {
      case 'area':
        return 'Area';
      case 'discipline':
        return 'Discipline';
      case 'tradePackage':
        return 'Trade Package';
      case 'subcontractor':
        return 'Subcontractor';
      case 'spa':
        return 'SPA';
      case 'roc':
        return 'Activities';
      case 'costType':
        return 'Cost Type';
      case 'scope':
        return 'Scope';
      case 'costCode':
        return 'Cost Code';
      case 'tasks':
        return 'Tasks';
      default:
        return 'Group';
    }
  };

  const mockTaskRows = [
    { taskId: 'DCH-PH1-S26-003-00001', taskName: 'S26 - Integrated Server Hall - Brooklyn Module Install [Rows 01 to 05]', taskDetail: 'Rows 01 to 05 Module Installation', p6Id: 'CON-01-020650', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH1-S26-003-00002', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 01 to 05]', taskDetail: 'Rows 01 to 05 Module Interconnection', p6Id: 'CON-01-020700', activityType: 'FO-121 - Brooklyn Interconnects' },
    { taskId: 'DCH-PH1-S26-003-00003', taskName: 'S26 - Integrated Server Hall - Brooklyn lighting 2nd Fix Installation [Rows 01 to 05]', taskDetail: 'Rows 01 to 05 Circuit Lighting installation', p6Id: 'CON-01-020750', activityType: 'FO-122 - Brooklyn 2nd Fix' },
    { taskId: 'DCH-PH2-S26-003-00004', taskName: 'S26 - Integrated Server Hall - Brooklyn Module Install [Rows 06 to 10]', taskDetail: 'Rows 06 to 10 Module Installation', p6Id: 'CON-02-010180', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH2-S26-003-00005', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 06 to 10]', taskDetail: 'Rows 06 to 10 Module Interconnection', p6Id: 'CON-02-010230', activityType: 'FO-121 - Brooklyn Interconnects' },
    { taskId: 'DCH-PH2-S26-003-00006', taskName: 'S26 - Integrated Server Hall - Brooklyn lighting 2nd Fix Installation [Rows 06 to 10]', taskDetail: 'Rows 06 to 10 Circuit Lighting installation', p6Id: 'CON-02-010280', activityType: 'FO-122 - Brooklyn 2nd Fix' },
    { taskId: 'DCH-PH3-S26-003-00007', taskName: 'S26 - Integrated Server Hall - Brooklyn Module Install [Rows 11 to 15]', taskDetail: 'Rows 11 to 15 Module Installation', p6Id: 'CON-03-010120', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH3-S26-003-00008', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 11 to 15]', taskDetail: 'Rows 11 to 15 Module Interconnection', p6Id: 'CON-03-010170', activityType: 'FO-121 - Brooklyn Interconnects' },
    { taskId: 'DCH-PH3-S26-003-00009', taskName: 'S26 - Integrated Server Hall - Brooklyn lighting 2nd Fix Installation [Rows 11 to 15]', taskDetail: 'Rows 11 to 15 Circuit Lighting installation', p6Id: 'CON-03-010220', activityType: 'FO-122 - Brooklyn 2nd Fix' },
    { taskId: 'DCH-PH4-S26-003-00010', taskName: 'S26 - Integrated Server Hall - Brooklyn Module Install [Rows 16 to 20]', taskDetail: 'Rows 16 to 20 Module Installation', p6Id: 'CON-04-010130', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH4-S26-003-00011', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 16 to 20]', taskDetail: 'Rows 16 to 20 Module Interconnection', p6Id: 'CON-04-010180', activityType: 'FO-121 - Brooklyn Interconnects' },
    { taskId: 'DCH-PH4-S26-003-00012', taskName: 'S26 - Integrated Server Hall - Brooklyn lighting 2nd Fix Installation [Rows 16 to 20]', taskDetail: 'Rows 16 to 20 Circuit Lighting installation', p6Id: 'CON-04-010230', activityType: 'FO-122 - Brooklyn 2nd Fix' },
    { taskId: 'DCH-PH5-S26-003-00013', taskName: 'S26 - Integrated Server Hall - Brooklyn Install [Rows 21 to 25]', taskDetail: 'Rows 21 to 25 Module Installation', p6Id: 'CON-05-011150', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH5-S26-003-00014', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 21 to 25]', taskDetail: 'Rows 21 to 25 Module Interconnection', p6Id: 'CON-05-011200', activityType: 'FO-121 - Brooklyn Interconnects' },
    { taskId: 'DCH-PH5-S26-003-00015', taskName: 'S26 - Integrated Server Hall - Brooklyn lighting 2nd Fix Installation [Rows 21 to 25]', taskDetail: 'Rows 21 to 25 Circuit Lighting installation', p6Id: 'CON-05-011250', activityType: 'FO-122 - Brooklyn 2nd Fix' },
    { taskId: 'DCH-PH6-S26-003-00016', taskName: 'S26 - Integrated Server Hall - Brooklyn Install [Rows 26 to 30]', taskDetail: 'Rows 26 to 30 Module Installation', p6Id: 'CON-06-020260', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH6-S26-003-00017', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 26 to 30]', taskDetail: 'Rows 26 to 30 Module Interconnection', p6Id: 'CON-06-020310', activityType: 'FO-121 - Brooklyn Interconnects' },
    { taskId: 'DCH-PH6-S26-003-00018', taskName: 'S26 - Integrated Server Hall - Brooklyn lighting 2nd Fix Installation [Rows 26 to 30]', taskDetail: 'Rows 26 to 30 Circuit Lighting installation', p6Id: 'CON-06-020360', activityType: 'FO-122 - Brooklyn 2nd Fix' },
    { taskId: 'DCH-PH7-S26-003-00019', taskName: 'S26 - Integrated Server Hall - Brooklyn Install [Rows 31 to 35]', taskDetail: 'Rows 31 to 35 Module Installation', p6Id: 'CON-07-010120', activityType: 'FO-120 - Brooklyn Install' },
    { taskId: 'DCH-PH7-S26-003-00020', taskName: 'S26 - Integrated Server Hall - Brooklyn Interconnects [Rows 31 to 35]', taskDetail: 'Rows 31 to 35 Module Interconnection', p6Id: 'CON-07-010170', activityType: 'FO-121 - Brooklyn Interconnects' },
  ];

  // Helper function to group data
  // Helper function to get code for dimension values
  const getDimensionCode = (dimensionType: string, value: string): string => {
    // Map dimension values to codes
    const codeMaps: { [key: string]: { [key: string]: string } } = {
      area: {
        'Area A': 'AR-A',
        'Area B': 'AR-B',
        'Data Centre Hall': 'DCH',
        'Electrical Yard': 'EY',
        'Facility Support Area': 'FSA',
        'Mechanical Yard': 'MY',
        'Security Room': 'SR',
        'Substation': 'SUB',
        'Main Building': 'MB',
        'Security Zone': 'SZ',
        'IT Infrastructure': 'IT',
        'Office Wing': 'OW',
        'External Areas': 'EA'
      },
      discipline: {
        'Electrical': 'ELEC',
        'Mechanical': 'MECH',
        'Architectural': 'ARCH',
        'Structural': 'STRU',
        'Multi-discipline': 'MULTI',
        'Fit-Out': 'FIT',
        'HVAC': 'HVAC',
        'Plumbing': 'PLMB',
        'Fire Protection': 'FIRE',
        'IT & Communications': 'IT',
        'Landscaping': 'LAND',
        'Security Systems': 'SEC'
      },
      roc: {
        'Cable Installation': 'CI',
        'Sprinkler Piping': 'SP',
        'Ceiling Installation': 'CEIL',
        'Structural Steel': 'SS',
        'Power Infrastructure': 'PWR',
        'Security Infrastructure': 'SEC',
        'Data Centre': 'DC',
        'Electrical Infrastructure': 'ELEC-INF',
        'Support Facilities': 'SUP',
        'Mechanical Infrastructure': 'MECH-INF',
        'HVAC Systems': 'HVAC',
        'Plumbing Installation': 'PLMB',
        'Fire Alarm': 'FIRE',
        'Network Cabling': 'NET',
        'Interior Finishes': 'INT',
        'Landscape Works': 'LAND'
      },
      costType: {
        'Direct Cost': 'DC',
        'Indirect Cost': 'IC',
        'Safety & Compliance': 'SC',
        'Technology': 'TECH',
        'Site Development': 'SD'
      },
      scope: {
        'Data Centre Development': 'DCD',
        'Electrical Yard Works': 'EYW',
        'Support Infrastructure': 'SI',
        'Mechanical Yard Development': 'MYD',
        'Security Room Development': 'SRD',
        'Substation Development': 'SUBD',
        'Mechanical Installation': 'MI',
        'Plumbing & Drainage': 'PD',
        'Fire Protection Systems': 'FPS',
        'IT Infrastructure': 'IT',
        'Architectural Works': 'AW',
        'External Works': 'EW',
        'Electrical Infrastructure': 'EI',
        'Interior Finishes': 'IF',
        'Structural Works': 'SW',
        'Security Systems': 'SS'
      },
      subcontractor: {
        'Various': 'VAR',
        'Electrical Contractors Ltd': 'ECL',
        'Support Services Inc': 'SSI',
        'Mechanical Systems Ltd': 'MSL',
        'Security Fit-Out Specialists': 'SFS',
        'Power Systems Inc': 'PSI',
        'Climate Control Systems': 'CCS',
        'Plumbing Contractors Ltd': 'PCL',
        'Fire Safety Solutions': 'FSS',
        'Network Systems Inc': 'NSI',
        'Interior Finishes Ltd': 'IFL',
        'Green Spaces Ltd': 'GSL',
        'Electrical Contractors': 'EC',
        'Fit-Out Specialists': 'FS',
        'Steel Contractors Inc': 'SCI'
      }
    };

    // For fields that already have codes (tradePackage, spa, costCode), return value as is
    if (dimensionType === 'tradePackage' || dimensionType === 'spa' || dimensionType === 'costCode') {
      return value;
    }

    return codeMaps[dimensionType]?.[value] || value;
  };

  const groupData = <T extends ManhoursRow | CostRow | QuantityRow>(data: T[]): { [key: string]: T[] } => {
    if (!filters.groupBy) return { 'All': data };

    const grouped: { [key: string]: T[] } = {};
    data.forEach(row => {
      const groupValue = row[filters.groupBy as keyof T] as string || 'Ungrouped';
      const code = getDimensionCode(filters.groupBy, groupValue);
      const groupKey = `${code}-${groupValue}`;
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(row);
    });
    return grouped;
  };

  // Helper function to group quantity data by groupBy option AND UOM
  const groupQuantityDataByUOM = (data: QuantityRow[]): { [groupKey: string]: { [uom: string]: QuantityRow[] } } => {
    if (!filters.groupBy) {
      // When no groupBy is selected, group only by UOM
      const grouped: { [uom: string]: QuantityRow[] } = {};
      data.forEach(row => {
        if (!grouped[row.uom]) {
          grouped[row.uom] = [];
        }
        grouped[row.uom].push(row);
      });
      return { 'All': grouped };
    }
    
    // First group by the selected groupBy option
    const primaryGrouped: { [groupKey: string]: QuantityRow[] } = {};
    data.forEach(row => {
      const groupValue = row[filters.groupBy as keyof QuantityRow] as string || 'Ungrouped';
      if (!primaryGrouped[groupValue]) {
        primaryGrouped[groupValue] = [];
      }
      primaryGrouped[groupValue].push(row);
    });

    // Then within each primary group, group by UOM
    const result: { [groupKey: string]: { [uom: string]: QuantityRow[] } } = {};
    Object.entries(primaryGrouped).forEach(([groupKey, rows]) => {
      result[groupKey] = {};
      rows.forEach(row => {
        if (!result[groupKey][row.uom]) {
          result[groupKey][row.uom] = [];
        }
        result[groupKey][row.uom].push(row);
      });
    });

    return result;
  };


  const isFormValid = filters.startDate && filters.endDate && filters.groupBy;

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const calculateManhoursOverall = () => {
    const totals = mockManhoursData.reduce((acc, row) => ({
      originalBudget: acc.originalBudget + row.originalBudget,
      agreedChanges: acc.agreedChanges + row.agreedChanges,
      currentBudget: acc.currentBudget + row.currentBudget,
      earnedHours: acc.earnedHours + row.earnedHours,
      earnedHoursToDate: acc.earnedHoursToDate + row.earnedHoursToDate,
      actualHrs: acc.actualHrs + row.actualHrs,
      toGo: acc.toGo + row.toGo
    }), {
      originalBudget: 0,
      agreedChanges: 0,
      currentBudget: 0,
      earnedHours: 0,
      earnedHoursToDate: 0,
      actualHrs: 0,
      toGo: 0
    });

    // Use hardcoded values for Overall row as per requirements
    return {
      originalBudget: 859476,
      agreedChanges: 20000,
      currentBudget: 859476,
      earnedHours: 72901,
      spi: 1.11,
      earnedHoursToDate: 547838,
      actualHrs: 0,
      toGo: 311540,
      spiToDate: 0.71,
      cpi: 0
    };
  };

  const calculateCostOverall = () => {
    const totals = mockCostData.reduce((acc, row) => ({
      weighting: acc.weighting + row.weighting,
      originalBudget: acc.originalBudget + row.originalBudget,
      agreedChanges: acc.agreedChanges + row.agreedChanges,
      currentBudget: acc.currentBudget + row.currentBudget,
      earnedCost: acc.earnedCost + row.earnedCost,
      actualCost: acc.actualCost + row.actualCost,
      earnedCostToDate: acc.earnedCostToDate + row.earnedCostToDate,
      toGoCost: acc.toGoCost + row.toGoCost
    }), {
      weighting: 0,
      originalBudget: 0,
      agreedChanges: 0,
      currentBudget: 0,
      earnedCost: 0,
      actualCost: 0,
      earnedCostToDate: 0,
      toGoCost: 0
    });

    // Use hardcoded values for Overall row as per requirements
    return {
      weighting: 100,
      originalBudget: 859476,
      agreedChanges: 20000,
      currentBudget: 859476,
      percentEarned: 8.50,
      earnedCost: 72901,
      actualCost: 0,
      spi: 1.11,
      cpi: 0,
      percentEarnedToDate: 63.80,
      earnedCostToDate: 547938,
      toGoCost: 311540,
      spiToDate: 0.71,
      cpiToDate: 0
    };
  };

  const renderManhoursReport = () => {
    const overall = calculateManhoursOverall();
    
    return (
      <div>
        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '4px',
            padding: '16px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#272721',
              marginBottom: '4px'
            }}>
              {formatNumber(overall.currentBudget)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#5F6B7A',
              marginBottom: '4px'
            }}>
              Total Budget Manhours
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              hrs
            </div>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '4px',
            padding: '16px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#272721',
              marginBottom: '4px'
            }}>
              {formatNumber(overall.earnedHoursToDate)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#5F6B7A',
              marginBottom: '4px'
            }}>
              Earned Manhours (To Date)
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              {((overall.earnedHoursToDate / overall.currentBudget) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Report Table */}
        {filters.groupBy === 'tasks' ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C8D9EE', borderRadius: '4px', overflow: 'auto' }}>
            <table style={{ width: '100%', minWidth: '2200px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '2px solid #C8D9EE' }}>
                  <th colSpan={5} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Details</th>
                  <th colSpan={4} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget Summary</th>
                  <th colSpan={2} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Period Summary</th>
                  <th colSpan={3} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To-Date Summary</th>
                </tr>
                <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '160px' }}>Task ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '280px' }}>Task Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>Task Detail</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>P6ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>Activity Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Original Budget</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Agreed Changes</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Current Budget</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>To Go</th>
                </tr>
              </thead>
              <tbody>
                {mockTaskRows.map((task, index) => {
                  const base = mockManhoursData[index % mockManhoursData.length];
                  return (
                    <tr key={task.taskId} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD', borderBottom: '1px solid #E2E6ED' }}>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>{task.taskId}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.taskName}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.taskDetail}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.p6Id}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.activityType}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{base.weighting.toFixed(2)}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.originalBudget)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.agreedChanges)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>{formatNumber(base.currentBudget)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{base.periodPercentEarned.toFixed(2)}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.earnedHours)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{base.toDatePercentEarned.toFixed(2)}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.earnedHoursToDate)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>{formatNumber(base.toGo)}</td>
                    </tr>
                  );
                })}
                <tr style={{ backgroundColor: '#F0F5FA', borderTop: '2px solid #C8D9EE' }}>
                  <td colSpan={5} style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>Overall</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>100%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.originalBudget)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.agreedChanges)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>{formatNumber(overall.currentBudget)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>8.50%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.earnedHours)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>63.80%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.earnedHoursToDate)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>{formatNumber(overall.toGo)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
        <div style={{
        backgroundColor: '#FFFFFF',
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
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
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
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Period Summary
              </th>
              <th colSpan={3} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                To-Date Summary
              </th>
            </tr>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>
                {getGroupByLabel()}
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Original Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Agreed Changes</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Current Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>To Go</th>
            </tr>
          </thead>
          <tbody>
            {mockManhoursData.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                  borderBottom: '1px solid #E2E6ED'
                }}
              >
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>
                  {row.code}-{row.name}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.weighting.toFixed(2)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.originalBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.agreedChanges)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  {formatNumber(row.currentBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.periodPercentEarned.toFixed(2)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.earnedHours)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.toDatePercentEarned.toFixed(2)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.earnedHoursToDate)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                  {formatNumber(row.toGo)}
                </td>
              </tr>
            ))}
            {/* Overall Row */}
            <tr style={{
              backgroundColor: '#F0F5FA',
              borderTop: '2px solid #C8D9EE',
              fontWeight: '700'
            }}>
              <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>
                Overall
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                100%
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {formatNumber(overall.originalBudget)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {formatNumber(overall.agreedChanges)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>
                {formatNumber(overall.currentBudget)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                8.50%
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {formatNumber(overall.earnedHours)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                63.80%
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {formatNumber(overall.earnedHoursToDate)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                {formatNumber(overall.toGo)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        )}
      </div>
    );
  };

  const renderQuantityReport = () => {
    const groupedData = groupData(mockQuantityData);

    if (filters.groupBy === 'tasks') {
      return (
        <div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C8D9EE', borderRadius: '4px', overflow: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1800px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '160px' }}>Task ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '280px' }}>Task Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>Task Detail</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>P6ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '80px' }}>UOM</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Total Planned Qty</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Installed (Period)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '150px' }}>Installed (To-Date)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>To Go</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '110px' }}>% Complete</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const byActivity: Record<string, typeof mockTaskRows> = {};
                  mockTaskRows.forEach(task => {
                    if (!byActivity[task.activityType]) byActivity[task.activityType] = [];
                    byActivity[task.activityType].push(task);
                  });
                  let rowIndex = 0;
                  return Object.entries(byActivity).flatMap(([activityType, tasks]) => [
                    <tr key={`header-${activityType}`} style={{ backgroundColor: '#E4EEF8', borderTop: '2px solid #C8D9EE', borderBottom: '1px solid #C8D9EE' }}>
                      <td colSpan={10} style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                        {activityType}
                      </td>
                    </tr>,
                    ...tasks.map((task) => {
                      const base = mockQuantityData[rowIndex % mockQuantityData.length];
                      const bg = rowIndex % 2 === 0 ? '#FFFFFF' : '#F4F8FD';
                      rowIndex++;
                      return (
                        <tr key={task.taskId} style={{ backgroundColor: bg, borderBottom: '1px solid #E2E6ED' }}>
                          <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>{task.taskId}</td>
                          <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.taskName}</td>
                          <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.taskDetail}</td>
                          <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.p6Id}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>{base.uom}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>{formatNumber(base.totalQuantity)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.installedPeriod)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.installedToDate)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{formatNumber(base.toGo)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#065F46' }}>{base.percentComplete}%</td>
                        </tr>
                      );
                    })
                  ]);
                })()}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          <table style={{
            width: '100%',
            minWidth: '1400px',
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
              {Object.entries(groupedData).flatMap(([groupName, rows]) => {
                // When grouping by Activity (roc), don't show the blue header row
                // Just show the activity rows directly since activity name is already in the "name" field
                if (filters.groupBy === 'roc') {
                  return rows.map((row, index) => (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        borderBottom: '1px solid #E2E6ED'
                      }}
                    >
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>
                        {row.code}-{row.name}
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
                  ));
                }
                
                // For other groupings, show the blue header row with group name
                return [
                  <tr key={`${groupName}-header`} style={{
                    backgroundColor: '#E4EEF8',
                    borderTop: '2px solid #C8D9EE',
                    borderBottom: '1px solid #C8D9EE'
                  }}>
                    <td colSpan={7} style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                      {groupName}
                    </td>
                  </tr>,
                  ...rows.map((row, index) => (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        borderBottom: '1px solid #E2E6ED'
                      }}
                    >
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>
                        {row.code}-{row.name}
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
                  ))
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCostReport = () => {
    const overall = calculateCostOverall();

    return (
      <div>
        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '4px',
            padding: '16px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#272721',
              marginBottom: '4px'
            }}>
              ${formatNumber(overall.currentBudget)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#5F6B7A',
              marginBottom: '4px'
            }}>
              Total Budget Cost
            </div>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '4px',
            padding: '16px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#272721',
              marginBottom: '4px'
            }}>
              ${formatNumber(overall.earnedCostToDate)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#5F6B7A',
              marginBottom: '4px'
            }}>
              Earned Cost (To Date)
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              {overall.percentEarnedToDate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Report Table */}
        {filters.groupBy === 'tasks' ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C8D9EE', borderRadius: '4px', overflow: 'auto' }}>
            <table style={{ width: '100%', minWidth: '2200px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '2px solid #C8D9EE' }}>
                  <th colSpan={5} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Details</th>
                  <th colSpan={4} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget Summary</th>
                  <th colSpan={2} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Period Summary</th>
                  <th colSpan={2} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#272721', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To-Date Summary</th>
                </tr>
                <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '160px' }}>Task ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '280px' }}>Task Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>Task Detail</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>P6ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>Activity Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting %</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Original Budget</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Agreed Changes</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Current Budget</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Earned Cost</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '130px' }}>Earned Cost</th>
                </tr>
              </thead>
              <tbody>
                {mockTaskRows.map((task, index) => {
                  const base = mockCostData[index % mockCostData.length];
                  return (
                    <tr key={task.taskId} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD', borderBottom: '1px solid #E2E6ED' }}>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>{task.taskId}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.taskName}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.taskDetail}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.p6Id}</td>
                      <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{task.activityType}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{base.weighting.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>${formatNumber(base.originalBudget)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>${formatNumber(base.agreedChanges)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>${formatNumber(base.currentBudget)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{base.percentEarned.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>${formatNumber(base.earnedCost)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{base.percentEarnedToDate.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>${formatNumber(base.earnedCostToDate)}</td>
                    </tr>
                  );
                })}
                <tr style={{ backgroundColor: '#F0F5FA', borderTop: '2px solid #C8D9EE' }}>
                  <td colSpan={5} style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>Overall</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{overall.weighting.toFixed(1)}%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>${formatNumber(overall.originalBudget)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>${formatNumber(overall.agreedChanges)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>${formatNumber(overall.currentBudget)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{overall.percentEarned.toFixed(1)}%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>${formatNumber(overall.earnedCost)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>{overall.percentEarnedToDate.toFixed(1)}%</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>${formatNumber(overall.earnedCostToDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
        <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{
          width: '100%',
          minWidth: '2000px',
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
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
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
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Period Summary
              </th>
              <th colSpan={2} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                To-Date Summary
              </th>
            </tr>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>
                {getGroupByLabel()}
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>Weighting %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Original Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Agreed Changes</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>Current Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '130px' }}>Earned Cost</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>% Earned</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '130px' }}>Earned Cost</th>
            </tr>
          </thead>
          <tbody>
            {mockCostData.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                  borderBottom: '1px solid #E2E6ED'
                }}
              >
                <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '500', color: '#272721' }}>
                  {row.code}-{row.name}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.weighting.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  ${formatNumber(row.originalBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  ${formatNumber(row.agreedChanges)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  ${formatNumber(row.currentBudget)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.percentEarned.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  ${formatNumber(row.earnedCost)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                  {row.percentEarnedToDate.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                  ${formatNumber(row.earnedCostToDate)}
                </td>
              </tr>
            ))}
            {/* Overall Row */}
            <tr style={{
              backgroundColor: '#F0F5FA',
              borderTop: '2px solid #C8D9EE',
              fontWeight: '700'
            }}>
              <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>
                Overall
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {overall.weighting.toFixed(1)}%
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                ${formatNumber(overall.originalBudget)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                ${formatNumber(overall.agreedChanges)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', fontWeight: '700', color: '#272721' }}>
                ${formatNumber(overall.currentBudget)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {overall.percentEarned.toFixed(1)}%
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                ${formatNumber(overall.earnedCost)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                {overall.percentEarnedToDate.toFixed(1)}%
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#272721' }}>
                ${formatNumber(overall.earnedCostToDate)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Page Header */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1F2937',
          margin: '0 0 4px 0'
        }}>
          Generate Reports
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5F6B7A',
          margin: '0'
        }}>
          Generate and manage project performance reports
        </p>
      </div>

      {/* Compact Filter Section - Above Tabs */}
      {(
        <div style={{
          backgroundColor: '#F7F9FC',
          border: '1px solid #E2E6ED',
          borderRadius: '4px',
          marginBottom: '24px',
          overflow: 'visible'
        }}>
          {/* Header with Collapse Button */}
          <div
            onClick={() => setFilterSectionCollapsed(!filterSectionCollapsed)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: filterSectionCollapsed ? '#FFFFFF' : '#F7F9FC',
              borderBottom: filterSectionCollapsed ? 'none' : '1px solid #E2E6ED'
            }}
          >
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721'
            }}>
              Report Filters
            </div>
            {filterSectionCollapsed ? <ChevronDown size={18} color="#6B7280" /> : <ChevronUp size={18} color="#6B7280" />}
          </div>

          {/* Filter Content */}
          {!filterSectionCollapsed && (
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 200px',
                gap: '16px',
                alignItems: 'end'
              }}>
                {/* Start Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Group By */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Group By
                  </label>
                  <StandardDropdown
                    options={[
                      { value: 'tasks', label: 'Tasks' },
                      { value: 'area', label: 'Area' },
                      { value: 'discipline', label: 'Discipline' },
                      { value: 'tradePackage', label: 'Trade Package' },
                      { value: 'subcontractor', label: 'Subcontractor' },
                      { value: 'spa', label: 'SPA' },
                      { value: 'roc', label: 'Activities' },
                      { value: 'costType', label: 'Cost Type' },
                      { value: 'scope', label: 'Scope' },
                      { value: 'costCode', label: 'Cost Code' }
                    ]}
                    value={filters.groupBy}
                    onChange={(value) => handleFilterChange('groupBy', value as GroupByOption)}
                    placeholder="Select..."
                    mode="single"
                    style={{ height: '36px' }}
                    maxHeight={400}
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={() => !isProjectReadOnly && handleGenerateReport()}
                  disabled={!isFormValid || isProjectReadOnly}
                  title={isProjectReadOnly ? "Generate Report disabled - Project is On Hold" : ""}
                  style={{
                    height: '36px',
                    padding: '0 20px',
                    border: 'none',
                    backgroundColor: (isFormValid && !isProjectReadOnly) ? '#FD4314' : '#D1D5DB',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    cursor: (isFormValid && !isProjectReadOnly) ? 'pointer' : 'not-allowed',
                    opacity: isProjectReadOnly ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (isFormValid && !isProjectReadOnly) e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    if (isFormValid && !isProjectReadOnly) e.currentTarget.style.backgroundColor = '#FD4314';
                  }}
                >
                  Generate Report
                </button>
              </div>

              {/* Quick Filters */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px'
              }}>
                <button
                  onClick={() => handleQuickFilter('lastMonth')}
                  style={{
                    height: '28px',
                    padding: '0 12px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Last Month
                </button>
                <button
                  onClick={() => handleQuickFilter('thisMonth')}
                  style={{
                    height: '28px',
                    padding: '0 12px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  This Month
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{
        borderBottom: '1px solid #E2E6ED',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          gap: '0'
        }}>
          {[
            { key: 'manhours' as ReportTab, label: 'Manhours Reports' },
            { key: 'cost' as ReportTab, label: 'Cost Reports' },
            { key: 'quantity' as ReportTab, label: 'Quantity Reports' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (!generatedReports.has(tab.key)) {
                  setReportGenerated(false);
                } else {
                  setReportGenerated(true);
                }
              }}
              style={{
                padding: '12px 24px',
                fontSize: '13px',
                fontWeight: '500',
                color: activeTab === tab.key ? '#272721' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #FD4314' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {reportGenerated ? (
        /* Generated Report Content */
        <div>
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => toast.success('Report downloaded successfully')}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              style={{
                height: '36px',
                padding: '0 16px',
                border: 'none',
                backgroundColor: '#FD4314',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              <Save size={16} />
              Save To System
            </button>
          </div>

          {/* Report Table */}
          {activeTab === 'manhours' && renderManhoursReport()}
          {activeTab === 'cost' && renderCostReport()}
          {activeTab === 'quantity' && renderQuantityReport()}
        </div>
      ) : (
        /* No Report Generated State */
        <div style={{
          padding: '80px 24px',
          textAlign: 'center',
          color: '#9CA3AF'
        }}>
          <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px', margin: '0' }}>
            Configure filters above and click "Generate Report" to view {activeTab} data
          </p>
        </div>
      )}

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 16px 0'
            }}>
              Save Report
            </h3>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Report Name
              </label>
              <input
                type="text"
                placeholder="Enter report name..."
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
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
                  toast.success('Report saved successfully');
                  setShowSaveModal(false);
                }}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
