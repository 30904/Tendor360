import React from 'react'
import ActionMenu from './ActionMenu'

/**
 * Drop-in actions column cell for Bootstrap <Table> rows.
 *
 * @example
 * <td className="table-actions-col">
 *   <TableActionsCell
 *     actions={buildTableActions({ onView: true, onEdit: true, onDelete: true })}
 *     onAction={(action) => runTableAction(action, row, handlers)}
 *   />
 * </td>
 */
const TableActionsCell = ({ actions = [], onAction, align = 'end', className = '' }) => (
  <div className={`d-flex justify-content-center ${className}`.trim()}>
    <ActionMenu actions={actions} onAction={onAction} align={align} />
  </div>
)

export default TableActionsCell
