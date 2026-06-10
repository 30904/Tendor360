import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import DataTable from './DataTable';

// Example usage of DataTable component
const DataTableExample = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-15',
      department: 'IT'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Inactive',
      lastLogin: '2024-01-10',
      department: 'HR'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-01-14',
      department: 'Finance'
    }
  ]);

  // Column definitions
  const columns = [
    {
      key: 'name',
      label: 'Name',
      width: '20%'
    },
    {
      key: 'email',
      label: 'Email',
      width: '25%'
    },
    {
      key: 'role',
      label: 'Role',
      width: '15%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      type: 'badge',
      badgeClass: (value) => value === 'Active' ? 'badge-success' : 'badge-secondary'
    },
    {
      key: 'department',
      label: 'Department',
      width: '15%'
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      width: '20%',
      type: 'date'
    }
  ];

  const handleEdit = (row) => {
    console.log('Edit user:', row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Delete user ${row.name}?`)) {
      setData(prev => prev.filter(item => item.id !== row.id));
    }
  };

  const handleView = (row) => {
    console.log('View user:', row);
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      title="User Management"
      searchable={true}
      sortable={true}
      exportable={true}
      pagination={true}
      pageSize={10}
      showActions={true}
      showCheckboxes={true}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      searchPlaceholder="Search users..."
      emptyMessage="No users found"
    />
  );
};

export default DataTableExample;
