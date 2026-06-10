# DataTable Component

A comprehensive, feature-rich data table component for the Tender Management Application built with React, Bootstrap, and SCSS.

## Features

- ✅ **Search & Filter**: Real-time search across all columns with advanced filtering
- ✅ **Sorting**: Sort by any column with visual indicators
- ✅ **Pagination**: Configurable pagination with customizable page sizes
- ✅ **Row Selection**: Single and bulk row selection with checkboxes
- ✅ **Export**: Export data to Excel format
- ✅ **Column Management**: Show/hide columns dynamically
- ✅ **Custom Rendering**: Custom cell renderers for complex data
- ✅ **Actions**: Leads-style ellipsis action center (View, Edit, Delete, custom items)
- ✅ **Responsive**: Mobile-friendly responsive design
- ✅ **Loading States**: Built-in loading state support
- ✅ **Styling**: Consistent with application design (Inter font, #4678be primary color)

## Installation

The DataTable component is already included in the project. Make sure you have the required dependencies:

```bash
npm install xlsx lucide-react
```

## Basic Usage

```jsx
import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import DataTable from '../components/DataTable';

const MyComponent = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active'
    }
  ]);

  const columns = [
    {
      key: 'name',
      label: 'Name',
      width: '30%'
    },
    {
      key: 'email',
      label: 'Email',
      width: '40%'
    },
    {
      key: 'status',
      label: 'Status',
      width: '30%',
      type: 'badge',
      badgeClass: (value) => value === 'Active' ? 'badge-success' : 'badge-secondary'
    }
  ];

  const handleEdit = (row) => {
    console.log('Edit:', row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Delete ${row.name}?`)) {
      setData(prev => prev.filter(item => item.id !== row.id));
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      title="User Management"
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array` | Array of objects containing the table data |
| `columns` | `Array` | Array of column configuration objects |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Data Table"` | Table title displayed in header |
| `searchable` | `boolean` | `true` | Enable/disable search functionality |
| `sortable` | `boolean` | `true` | Enable/disable column sorting |
| `exportable` | `boolean` | `true` | Enable/disable Excel export |
| `pagination` | `boolean` | `true` | Enable/disable pagination |
| `pageSize` | `number` | `10` | Number of rows per page |
| `showActions` | `boolean` | `true` | Show/hide actions column |
| `showCheckboxes` | `boolean` | `true` | Show/hide row selection checkboxes |
| `onRowClick` | `function` | `null` | Callback when row is clicked |
| `onEdit` | `function` | `null` | Callback for edit action |
| `onDelete` | `function` | `null` | Callback for delete action |
| `onView` | `function` | `null` | Callback for view action |
| `onCopy` | `function` | `null` | Callback for copy action |
| `onRiskAnalysis` | `function` | `null` | Callback for AI risk analysis action |
| `customActions` | `Array` | `[]` | Array of custom action objects |
| `className` | `string` | `""` | Additional CSS classes |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder text for search input |
| `emptyMessage` | `string` | `"No data available"` | Message when no data is available |
| `loading` | `boolean` | `false` | Show loading state |
| `initialHiddenColumns` | `Array` | `[]` | Array of column keys to hide initially |

## Column Configuration

Each column object can have the following properties:

```jsx
{
  key: 'columnKey',           // Required: Property key in data object
  label: 'Column Label',      // Required: Display label
  width: '20%',              // Optional: Column width
  type: 'badge',             // Optional: 'badge', 'date', 'currency'
  render: (value, row) => {   // Optional: Custom render function
    return <CustomComponent value={value} row={row} />;
  },
  badgeClass: (value) => {    // Optional: Function to determine badge class
    return value === 'Active' ? 'badge-success' : 'badge-secondary';
  }
}
```

### Column Types

- **`badge`**: Renders value as a Bootstrap badge
- **`date`**: Formats value as a date string
- **`currency`**: Formats value as currency (USD)

### Custom Rendering

Use the `render` function for complex cell content:

```jsx
{
  key: 'status',
  label: 'Status',
  render: (value, row) => (
    <div>
      <Badge bg={value === 'Active' ? 'success' : 'secondary'}>
        {value}
      </Badge>
      <small className="text-muted d-block">
        Last updated: {row.lastUpdated}
      </small>
    </div>
  )
}
```

## Action Handlers

### Built-in Actions

- **`onView`**: View details action
- **`onEdit`**: Edit action
- **`onDelete`**: Delete action
- **`onCopy`**: Copy content action
- **`onRiskAnalysis`**: AI risk analysis action

### Custom Actions

```jsx
const customActions = [
  {
    type: 'custom',
    label: 'Generate Report',
    onClick: (row) => {
      console.log('Generate report for:', row);
    }
  }
];

<DataTable
  data={data}
  columns={columns}
  customActions={customActions}
/>
```

## Styling

The component uses SCSS with the following design tokens:

- **Font**: Inter font family
- **Primary Color**: #4678be
- **Border Radius**: 8px for buttons, 12px for cards
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth 0.2s transitions

### Custom Styling

You can override styles by targeting the component classes:

```scss
.datatable-card {
  .datatable-title {
    color: #your-color;
  }
  
  .datatable-btn {
    background-color: #your-bg-color;
  }
}
```

## Examples

### Basic Table

```jsx
<DataTable
  data={users}
  columns={userColumns}
  title="Users"
/>
```

### Table with Actions

```jsx
<DataTable
  data={tenders}
  columns={tenderColumns}
  title="Tenders"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
```

### Table with Custom Rendering

```jsx
const columns = [
  {
    key: 'progress',
    label: 'Progress',
    render: (value) => (
      <div className="progress">
        <div 
          className="progress-bar" 
          style={{ width: `${value}%` }}
        >
          {value}%
        </div>
      </div>
    )
  }
];
```

### Table with Filters

```jsx
<DataTable
  data={data}
  columns={columns}
  searchable={true}
  searchPlaceholder="Search tenders..."
/>
```

## Demo

Visit `/datatable-demo` to see the component in action with sample data and all features demonstrated.

## Integration with Existing Pages

To replace existing tables in your application:

1. Import the DataTable component
2. Define your column configuration
3. Set up action handlers
4. Replace your existing table markup with the DataTable component

Example migration:

```jsx
// Before
<table className="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
      </tr>
    ))}
  </tbody>
</table>

// After
<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
  title="Users"
/>
```

## Action center in custom Bootstrap tables

Pages that use raw `<Table>` (not `DataTable`) should use the same ellipsis menu:

```jsx
import TableActionsCell from '../components/TableActionsCell';
import { buildTableActions, runTableAction } from '../utils/tableActions';

// In <thead>: <th className="table-actions-col">Actions</th>
// In <tbody>:
<td className="table-actions-col">
  <TableActionsCell
    actions={buildTableActions({ onView: true, onEdit: true, onDelete: true })}
    onAction={(action) => runTableAction(action, row, {
      onView: () => openView(row),
      onEdit: () => openEdit(row),
      onDelete: () => remove(row),
    })}
  />
</td>
```

`DataTable` with `showActions={true}` uses this pattern automatically.

## Performance Considerations

- The component uses `useMemo` for expensive operations like filtering and sorting
- Large datasets are automatically paginated
- Search is debounced to prevent excessive re-renders
- Export functionality handles large datasets efficiently

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

- React 18+
- React Bootstrap 2.9+
- Lucide React 0.544+
- XLSX 0.18+
