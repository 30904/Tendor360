/**
 * Build standard row actions for TableActionCenter / ActionMenu.
 * @param {object} options
 * @param {boolean|function} options.onView
 * @param {boolean|function} options.onEdit
 * @param {boolean|function} options.onDelete
 * @param {boolean|function} options.onCopy
 * @param {Array} options.custom - extra actions: { type, label, key, icon, variant, disabled }
 * @param {object} options.labels - override default labels
 */
export function buildTableActions({
  onView,
  onEdit,
  onDelete,
  onCopy,
  custom = [],
  labels = {}
} = {}) {
  const actions = [];

  if (onView) {
    actions.push({ type: 'view', label: labels.view || 'View' });
  }
  if (onEdit) {
    actions.push({ type: 'edit', label: labels.edit || 'Edit' });
  }
  if (onCopy) {
    actions.push({ type: 'copy', label: labels.copy || 'Copy' });
  }

  actions.push(...custom);

  if (onDelete) {
    actions.push({
      type: 'delete',
      label: labels.delete || 'Delete',
      variant: 'danger'
    });
  }

  return actions;
}

/**
 * Run a table action against standard handlers + custom keys.
 */
export function runTableAction(action, row, handlers = {}) {
  if (!action) return;

  if (action.key && typeof handlers[action.key] === 'function') {
    handlers[action.key](row, action);
    return;
  }

  switch (action.type) {
    case 'view':
      handlers.onView?.(row, action);
      break;
    case 'edit':
      handlers.onEdit?.(row, action);
      break;
    case 'delete':
      handlers.onDelete?.(row, action);
      break;
    case 'copy':
      handlers.onCopy?.(row, action);
      break;
    default:
      if (typeof action.onClick === 'function') {
        action.onClick(row, action);
      }
      break;
  }
}
