import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  EyeOff,
  Settings
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ActionMenu from './ActionMenu';
import './DataTable.scss';

const formatTableHeader = (label = '') =>
  String(label)
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')

const DataTable = ({
  data = [],
  columns = [],
  title = "Data Table",
  searchable = true,
  sortable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  showActions = true,
  showCheckboxes = true,
  onRowClick = null,
  onEdit = null,
  onDelete = null,
  onView = null,
  onCopy = null,
  onRiskAnalysis = null,
  customActions = [],
  className = "",
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  loading = false,
  initialHiddenColumns = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [hiddenColumns, setHiddenColumns] = useState(initialHiddenColumns);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({});

  // Close column settings when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColumnSettings && !event.target.closest('.position-relative')) {
        setShowColumnSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSettings]);

  // Tooltip component
  const Tooltip = ({ show, text, x, y }) => {
    if (!show) return null;
    
    return (
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y - 35,
          backgroundColor: 'var(--text-primary)',
          color: 'var(--white)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        {text}
      </div>
    );
  };

  // Handle tooltip
  const handleTooltip = (show, text, event) => {
    if (show && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        text,
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    } else {
      setTooltip({ show: false, text: '', x: 0, y: 0 });
    }
  };

  // Handle column visibility
  const toggleColumnVisibility = (columnKey) => {
    setHiddenColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(column => !hiddenColumns.includes(column.key));
  }, [columns, hiddenColumns]);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    let filtered = data;
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(row => {
        if (!row) return false;
        return visibleColumns.some(column => {
          const value = row[column.key];
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(row => {
          if (!row) return false;
          const rowValue = row[key];
          if (rowValue === null || rowValue === undefined) return false;
          if (typeof rowValue === 'string') {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }
          return rowValue === value;
        });
      }
    });
    
    return filtered;
  }, [data, searchTerm, visibleColumns, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle row selection
  const handleRowSelect = (rowId, isSelected) => {
    if (isSelected) {
      setSelectedRows(prev => [...prev, rowId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId));
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedRows(paginatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Reset selected rows when checkboxes are disabled
  React.useEffect(() => {
    if (!showCheckboxes) {
      setSelectedRows([]);
    }
  }, [showCheckboxes]);

  // Export to Excel
  const handleExport = () => {
    const exportData = selectedRows.length > 0 
      ? data.filter(row => selectedRows.includes(row.id))
      : sortedData;

    const worksheet = XLSX.utils.json_to_sheet(
      exportData.map(row => {
        const exportRow = {};
        columns.forEach(column => {
          exportRow[column.label] = row[column.key];
        });
        return exportRow;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (!sortable) return null;
    
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ArrowUp size={16} className="text-primary" /> : 
        <ArrowDown size={16} className="text-primary" />;
    }
    return <ArrowUpDown size={16} className="text-muted" />;
  };

  // Render cell content
  const renderCell = (row, column) => {
    if (!row || !column) return null;
    
    const value = row[column.key];
    
    // If column has a render function, use it (even for objects)
    if (column.render) {
      try {
        return column.render(value, row);
      } catch (error) {
        console.error('Error in column render function:', error);
        return String(value || '');
      }
    }
    
    // Safety check: don't render objects directly if no render function
    if (typeof value === 'object' && value !== null) {
      console.warn('Attempted to render object in DataTable without render function:', value);
      return JSON.stringify(value);
    }
    
    if (column.type === 'badge') {
      const badgeClass = column.badgeClass ? column.badgeClass(value) : 'badge-secondary';
      return <span className={`badge ${badgeClass}`}>{String(value || '')}</span>;
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    
    return String(value || '');
  };

  const buildRowActions = (row) => [
    ...(onView ? [{ type: 'view', label: 'View' }] : []),
    ...(onEdit ? [{ type: 'edit', label: 'Edit' }] : []),
    ...(onCopy ? [{ type: 'copy', label: 'Copy' }] : []),
    ...(onRiskAnalysis ? [{ type: 'risk', label: 'AI Risk Analysis' }] : []),
    ...customActions,
    ...(onDelete ? [{ type: 'delete', label: 'Delete', variant: 'danger' }] : [])
  ];

  const handleRowAction = (action, row) => {
    switch (action.type) {
      case 'view':
        onView && onView(row);
        break;
      case 'edit':
        onEdit && onEdit(row);
        break;
      case 'copy':
        onCopy && onCopy(row);
        break;
      case 'risk':
        onRiskAnalysis && onRiskAnalysis(row);
        break;
      case 'delete':
        onDelete && onDelete(row);
        break;
      default:
        if (action.onClick) {
          action.onClick(row);
        }
        break;
    }
  };

  const mobileTitleColumn = useMemo(() => {
    const preferred = visibleColumns.find((column) => column.mobileTitle || column.primary)
    return preferred || visibleColumns[0] || null
  }, [visibleColumns])

  const mobileFieldColumns = useMemo(() => {
    if (!mobileTitleColumn) return visibleColumns
    return visibleColumns.filter((column) => column.key !== mobileTitleColumn.key)
  }, [mobileTitleColumn, visibleColumns])

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Tooltip show={tooltip.show} text={tooltip.text} x={tooltip.x} y={tooltip.y} />
      <div className={`card datatable-card ${className}`}>
        {/* Header */}
        <div className="card-header datatable-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 datatable-title">{title}</h5>
            <div className="d-flex gap-2">
              {exportable && (
                <button 
                  className="btn btn-sm datatable-btn"
                  onClick={handleExport}
                  disabled={data.length === 0}
                >
                  <Download size={16} className="me-1" />
                  Export
                </button>
              )}
              <button 
                className="btn btn-sm datatable-btn"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter size={16} className="me-1" />
                Filter
              </button>
              <div className="position-relative" style={{ zIndex: 10000 }}>
                <button 
                  className="btn btn-sm datatable-btn"
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                  onMouseEnter={(e) => {
                    handleTooltip(true, 'Column Settings', e);
                  }}
                  onMouseLeave={(e) => {
                    handleTooltip(false);
                  }}
                >
                  <Settings size={16} />
                </button>
                
                {/* Column Settings Dropdown */}
                {showColumnSettings && (
                  <div className="datatable-column-settings">
                    <div className="mb-2">
                      <strong style={{ fontSize: '14px' }}>Show/Hide Columns</strong>
                    </div>
                    {columns.map(column => (
                      <div key={column.key} className="form-check datatable-column-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`column-${column.key}`}
                          checked={!hiddenColumns.includes(column.key)}
                          onChange={() => toggleColumnVisibility(column.key)}
                        />
                        <label 
                          className="form-check-label" 
                          htmlFor={`column-${column.key}`}
                        >
                          {formatTableHeader(column.label)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchable && (
          <div className="card-body datatable-search-section">
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="datatable-search-container">
                <span className="input-group-text datatable-search-icon">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control datatable-search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="datatable-info-text">
                Showing {paginatedData.length} of {sortedData.length} entries
                {selectedRows.length > 0 && ` (${selectedRows.length} selected)`}
              </span>
            </div>
          </div>
        )}

        {/* Desktop table */}
        <div className="table-responsive datatable-desktop">
          <table className="table table-hover mb-0 datatable-table">
            <thead className="table-light datatable-thead">
              <tr>
                {showCheckboxes && (
                  <th className="datatable-checkbox-column">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                {visibleColumns.map((column) => (
                  <th 
                    key={column.key}
                    className={`datatable-th ${sortable ? 'sortable' : ''}`}
                    style={{ width: column.width || 'auto' }}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {formatTableHeader(column.label)}
                      {getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {showActions && (
                  <th className="datatable-actions-column">{formatTableHeader('Actions')}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={visibleColumns.length + (showCheckboxes ? 1 : 0) + (showActions ? 1 : 0)} 
                    className="text-center py-4 text-muted datatable-empty"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr 
                    key={row.id || index}
                    className={`datatable-row ${selectedRows.includes(row.id) ? 'table-active' : ''} ${onRowClick ? 'clickable' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {showCheckboxes && (
                      <td className="datatable-checkbox-cell">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(row.id, e.target.checked);
                          }}
                        />
                      </td>
                    )}
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="datatable-cell">
                        {renderCell(row, column)}
                      </td>
                    ))}
                    {showActions && (
                      <td className="datatable-actions-cell">
                        <div className="d-flex justify-content-center">
                          <ActionMenu
                            actions={buildRowActions(row)}
                            onAction={(action) => handleRowAction(action, row)}
                            size="sm"
                            variant="outline"
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="datatable-mobile-list">
          {paginatedData.length === 0 ? (
            <div className="datatable-mobile-empty">{emptyMessage}</div>
          ) : (
            paginatedData.map((row, index) => (
              <article
                key={row.id || index}
                className={`datatable-mobile-card ${selectedRows.includes(row.id) ? 'is-selected' : ''} ${onRowClick ? 'is-clickable' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {showCheckboxes ? (
                  <div className="datatable-mobile-card__select">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleRowSelect(row.id, e.target.checked)
                      }}
                    />
                  </div>
                ) : null}

                <div className="datatable-mobile-card__header">
                  <div className="datatable-mobile-card__title">
                    {mobileTitleColumn ? renderCell(row, mobileTitleColumn) : null}
                  </div>
                  {showActions ? (
                    <div
                      className="datatable-mobile-card__actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionMenu
                        actions={buildRowActions(row)}
                        onAction={(action) => handleRowAction(action, row)}
                        size="sm"
                        variant="outline"
                      />
                    </div>
                  ) : null}
                </div>

                <dl className="datatable-mobile-card__fields">
                  {mobileFieldColumns.map((column) => (
                    <div key={column.key} className="datatable-mobile-card__field">
                      <dt>{formatTableHeader(column.label)}</dt>
                      <dd>{renderCell(row, column)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="card-footer datatable-footer">
            <div className="d-flex justify-content-between align-items-center">
              <div className="datatable-pagination-info">
                Page {currentPage} of {totalPages} ({sortedData.length} total entries)
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0 datatable-pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link datatable-page-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className="page-link datatable-page-btn"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link datatable-page-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div 
          className="datatable-filter-overlay"
          onClick={() => setShowFilterModal(false)}
        >
          <div 
            className="datatable-filter-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Filter Data</h5>
              <button 
                className="btn-close" 
                onClick={() => setShowFilterModal(false)}
              ></button>
            </div>
            
            <div className="mb-3">
              {visibleColumns.filter(col => col.key !== 'actions').map(column => (
                <div key={column.key} className="mb-3">
                  <label className="form-label">
                    {column.label}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Filter by ${column.label.toLowerCase()}...`}
                    value={filters[column.key] || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, [column.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            
            <div className="d-flex gap-2 justify-content-end">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFilters({});
                  setShowFilterModal(false);
                }}
              >
                Clear All
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowFilterModal(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
