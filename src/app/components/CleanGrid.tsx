import React from 'react';
import { AgGridReact } from 'ag-grid-react';

interface CleanGridProps {
  rowData?: any[];
  columnDefs?: any[];
  defaultColDef?: any;
  pagination?: boolean;
  paginationPageSize?: number;
  onGridReady?: (params: any) => void;
  onSelectionChanged?: (params: any) => void;
  onRowClicked?: (params: any) => void;
  headerHeight?: number;
  rowHeight?: number;
  rowSelection?: any;
  suppressRowClickSelection?: boolean;
  domLayout?: string;
  modules?: any[];
  gridOptions?: any;
  context?: any;
  theme?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function CleanGrid(props: any) {
  const wrapperStyle = props.style || { width: '100%', height: '100%' };

  // Create a completely clean props object using only known AG Grid props
  const agGridProps: any = {};
  
  if (props.rowData !== undefined) agGridProps.rowData = props.rowData;
  if (props.columnDefs !== undefined) agGridProps.columnDefs = props.columnDefs;
  if (props.defaultColDef !== undefined) agGridProps.defaultColDef = props.defaultColDef;
  if (props.pagination !== undefined) agGridProps.pagination = props.pagination;
  if (props.paginationPageSize !== undefined) agGridProps.paginationPageSize = props.paginationPageSize;
  if (props.onGridReady !== undefined) agGridProps.onGridReady = props.onGridReady;
  if (props.onSelectionChanged !== undefined) agGridProps.onSelectionChanged = props.onSelectionChanged;
  if (props.onRowClicked !== undefined) agGridProps.onRowClicked = props.onRowClicked;
  if (props.headerHeight !== undefined) agGridProps.headerHeight = props.headerHeight;
  if (props.rowHeight !== undefined) agGridProps.rowHeight = props.rowHeight;
  if (props.rowSelection !== undefined) agGridProps.rowSelection = props.rowSelection;
  if (props.suppressRowClickSelection !== undefined) agGridProps.suppressRowClickSelection = props.suppressRowClickSelection;
  if (props.domLayout !== undefined) agGridProps.domLayout = props.domLayout;
  if (props.context !== undefined) agGridProps.context = props.context;
  if (props.theme !== undefined) agGridProps.theme = props.theme;

  return (
    <div style={wrapperStyle} className={props.className}>
      {React.createElement(AgGridReact, agGridProps)}
    </div>
  );
}
