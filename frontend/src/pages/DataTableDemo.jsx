import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import { Eye, Edit, Trash2, Copy, AlertTriangle } from 'lucide-react';

const DataTableDemo = () => {
  // Sample data for demonstration
  const [tenderData, setTenderData] = useState([
    {
      id: 1,
      title: 'IT Infrastructure Upgrade',
      reference: 'TND-2024-001',
      source: 'Government Portal',
      estimatedValue: 2500000,
      currency: 'USD',
      deadline: '2024-03-15',
      status: 'Active',
      probability: 75,
      riskLevel: 'Low',
      owner: 'John Smith',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Healthcare System Implementation',
      reference: 'TND-2024-002',
      source: 'Healthcare Portal',
      estimatedValue: 1800000,
      currency: 'USD',
      deadline: '2024-04-20',
      status: 'Draft',
      probability: 60,
      riskLevel: 'Medium',
      owner: 'Sarah Johnson',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Construction Management Software',
      reference: 'TND-2024-003',
      source: 'Construction Portal',
      estimatedValue: 3200000,
      currency: 'USD',
      deadline: '2024-05-10',
      status: 'Submitted',
      probability: 85,
      riskLevel: 'Low',
      owner: 'Mike Wilson',
      createdAt: '2024-01-25'
    },
    {
      id: 4,
      title: 'Financial Services Platform',
      reference: 'TND-2024-004',
      source: 'Corporate RFP',
      estimatedValue: 4500000,
      currency: 'USD',
      deadline: '2024-06-30',
      status: 'Under Review',
      probability: 45,
      riskLevel: 'High',
      owner: 'Emily Davis',
      createdAt: '2024-02-01'
    },
    {
      id: 5,
      title: 'Educational Technology Solution',
      reference: 'TND-2024-005',
      source: 'Direct Client',
      estimatedValue: 1200000,
      currency: 'USD',
      deadline: '2024-03-30',
      status: 'Active',
      probability: 70,
      riskLevel: 'Medium',
      owner: 'David Brown',
      createdAt: '2024-02-05'
    }
  ]);

  // Column definitions
  const columns = [
    {
      key: 'title',
      label: 'Title',
      width: '25%',
      render: (value, row) => (
        <div>
          <div className="fw-semibold text-primary">{value}</div>
          <small className="text-muted">{row.reference}</small>
        </div>
      )
    },
    {
      key: 'source',
      label: 'Source',
      width: '15%',
      render: (value) => (
        <Badge bg="info" className="text-white">
          {value}
        </Badge>
      )
    },
    {
      key: 'estimatedValue',
      label: 'Estimated Value',
      width: '15%',
      type: 'currency',
      render: (value, row) => (
        <div className="text-end">
          <div className="fw-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: row.currency || 'USD'
            }).format(value)}
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'deadline',
      label: 'Deadline',
      width: '12%',
      type: 'date',
      render: (value) => {
        const date = new Date(value);
        const today = new Date();
        const isOverdue = date < today;
        const isNearDeadline = date <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return (
          <div className={isOverdue ? 'text-danger' : isNearDeadline ? 'text-warning' : 'text-success'}>
            {date.toLocaleDateString()}
            {isOverdue && <div className="small text-danger">Overdue</div>}
            {isNearDeadline && !isOverdue && <div className="small text-warning">Due Soon</div>}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      type: 'badge',
      badgeClass: (value) => {
        const variants = {
          'Active': 'badge-success',
          'Draft': 'badge-warning',
          'Submitted': 'badge-info',
          'Under Review': 'badge-primary',
          'Awarded': 'badge-success',
          'Rejected': 'badge-danger'
        };
        return variants[value] || 'badge-secondary';
      }
    },
    {
      key: 'probability',
      label: 'Probability',
      width: '10%',
      render: (value) => (
        <div className="text-center">
          <div className="fw-semibold">{value}%</div>
          <div className="progress" style={{ height: '4px' }}>
            <div 
              className="progress-bar bg-primary" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '10%',
      type: 'badge',
      badgeClass: (value) => {
        const variants = {
          'Low': 'badge-success',
          'Medium': 'badge-warning',
          'High': 'badge-danger'
        };
        return variants[value] || 'badge-secondary';
      }
    },
    {
      key: 'owner',
      label: 'Owner',
      width: '12%',
      render: (value) => (
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
               style={{ width: '32px', height: '32px', fontSize: '12px' }}>
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="small">{value}</span>
        </div>
      )
    }
  ];

  // Action handlers
  const handleView = (row) => {
    console.log('View tender:', row);
    alert(`Viewing tender: ${row.title}`);
  };

  const handleEdit = (row) => {
    console.log('Edit tender:', row);
    alert(`Editing tender: ${row.title}`);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.title}"?`)) {
      setTenderData(prev => prev.filter(item => item.id !== row.id));
    }
  };

  const handleCopy = (row) => {
    console.log('Copy tender:', row);
    alert(`Copied tender: ${row.title}`);
  };

  const handleRiskAnalysis = (row) => {
    console.log('AI Risk Analysis for:', row);
    alert(`Running AI Risk Analysis for: ${row.title}`);
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  // Custom actions
  const customActions = [
    {
      type: 'custom',
      label: 'Generate Report',
      onClick: (row) => {
        alert(`Generating report for: ${row.title}`);
      }
    }
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">DataTable Component Demo</h2>
              <p className="text-muted mb-0">
                Comprehensive data table with search, sort, filter, export, and action capabilities
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <DataTable
            data={tenderData}
            columns={columns}
            title="Tender Management Data"
            searchable={true}
            sortable={true}
            exportable={true}
            pagination={true}
            pageSize={10}
            showActions={true}
            showCheckboxes={true}
            onRowClick={handleRowClick}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onRiskAnalysis={handleRiskAnalysis}
            customActions={customActions}
            searchPlaceholder="Search tenders..."
            emptyMessage="No tenders found"
            loading={false}
            initialHiddenColumns={[]}
          />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">DataTable Features</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Core Features</h6>
                  <ul className="list-unstyled">
                    <li>✅ Search and filter data</li>
                    <li>✅ Sort by any column</li>
                    <li>✅ Pagination with customizable page size</li>
                    <li>✅ Row selection with checkboxes</li>
                    <li>✅ Export to Excel functionality</li>
                    <li>✅ Column visibility toggle</li>
                    <li>✅ Custom cell rendering</li>
                    <li>✅ Action menu with multiple options</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Advanced Features</h6>
                  <ul className="list-unstyled">
                    <li>✅ Responsive design</li>
                    <li>✅ Loading states</li>
                    <li>✅ Custom actions</li>
                    <li>✅ Row click handlers</li>
                    <li>✅ Badge and status indicators</li>
                    <li>✅ Progress bars and visual elements</li>
                    <li>✅ Tooltip support</li>
                    <li>✅ Inter font integration</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DataTableDemo;
