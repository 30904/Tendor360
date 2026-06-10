import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for API calls
export const fetchSystemStats = createAsyncThunk(
  'adminConfig/fetchSystemStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system stats');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'adminConfig/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'adminConfig/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/admin/users', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'adminConfig/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`/api/admin/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'adminConfig/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'adminConfig/updateUserStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`/api/admin/users/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const fetchRoles = createAsyncThunk(
  'adminConfig/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  'adminConfig/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/permissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

export const createRole = createAsyncThunk(
  'adminConfig/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/admin/roles', roleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create role');
    }
  }
);

export const updateRole = createAsyncThunk(
  'adminConfig/updateRole',
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`/api/admin/roles/${id}`, roleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'adminConfig/deleteRole',
  async (roleId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/admin/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return roleId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
  }
);

export const fetchSecuritySettings = createAsyncThunk(
  'adminConfig/fetchSecuritySettings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/security', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch security settings');
    }
  }
);

export const updateSecuritySettings = createAsyncThunk(
  'adminConfig/updateSecuritySettings',
  async (settings, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('/api/admin/security', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update security settings');
    }
  }
);

export const fetchSystemConfig = createAsyncThunk(
  'adminConfig/fetchSystemConfig',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system configuration');
    }
  }
);

export const updateSystemConfig = createAsyncThunk(
  'adminConfig/updateSystemConfig',
  async (config, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('/api/admin/config', config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update system configuration');
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'adminConfig/fetchAuditLogs',
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

export const exportAuditLogs = createAsyncThunk(
  'adminConfig/exportAuditLogs',
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/audit-logs/export', {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export audit logs');
    }
  }
);

const initialState = {
  // System Stats
  systemStats: null,
  systemStatsLoading: false,
  systemStatsError: null,

  // Users
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: null,

  // Roles
  roles: [],
  rolesLoading: false,
  rolesError: null,
  
  // Permissions
  permissions: [],
  permissionsLoading: false,
  permissionsError: null,

  // Security Settings
  securitySettings: null,
  securitySettingsLoading: false,
  securitySettingsError: null,

  // System Configuration
  systemConfig: null,
  systemConfigLoading: false,
  systemConfigError: null,

  // Audit Logs
  auditLogs: [],
  auditLogsLoading: false,
  auditLogsError: null,
  auditLogsPagination: null,

  // UI State
  activeTab: 'dashboard',
  showUserModal: false,
  showRoleModal: false,
  showSecurityModal: false,
  showConfigModal: false,
  editingUser: null,
  editingRole: null,
  editingSecurity: null,
  editingConfig: null
};

const adminConfigSlice = createSlice({
  name: 'adminConfig',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowUserModal: (state, action) => {
      state.showUserModal = action.payload;
      if (!action.payload) state.editingUser = null;
    },
    setShowRoleModal: (state, action) => {
      state.showRoleModal = action.payload;
      if (!action.payload) state.editingRole = null;
    },
    setShowSecurityModal: (state, action) => {
      state.showSecurityModal = action.payload;
      if (!action.payload) state.editingSecurity = null;
    },
    setShowConfigModal: (state, action) => {
      state.showConfigModal = action.payload;
      if (!action.payload) state.editingConfig = null;
    },
    setEditingUser: (state, action) => {
      state.editingUser = action.payload;
      state.showUserModal = true;
    },
    setEditingRole: (state, action) => {
      state.editingRole = action.payload;
      state.showRoleModal = true;
    },
    setEditingSecurity: (state, action) => {
      state.editingSecurity = action.payload;
      state.showSecurityModal = true;
    },
    setEditingConfig: (state, action) => {
      state.editingConfig = action.payload;
      state.showConfigModal = true;
    },
    clearErrors: (state) => {
      state.systemStatsError = null;
      state.usersError = null;
      state.rolesError = null;
      state.securitySettingsError = null;
      state.systemConfigError = null;
      state.auditLogsError = null;
    }
  },
  extraReducers: (builder) => {
    // System Stats
    builder
      .addCase(fetchSystemStats.pending, (state) => {
        state.systemStatsLoading = true;
        state.systemStatsError = null;
      })
      .addCase(fetchSystemStats.fulfilled, (state, action) => {
        state.systemStatsLoading = false;
        state.systemStats = action.payload;
      })
      .addCase(fetchSystemStats.rejected, (state, action) => {
        state.systemStatsLoading = false;
        state.systemStatsError = action.payload;
      });

    // Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });

    // Roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload;
      })
      .addCase(fetchPermissions.pending, (state) => {
        state.permissionsLoading = true;
        state.permissionsError = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsError = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(role => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(role => role._id !== action.payload);
      });

    // Security Settings
    builder
      .addCase(fetchSecuritySettings.pending, (state) => {
        state.securitySettingsLoading = true;
        state.securitySettingsError = null;
      })
      .addCase(fetchSecuritySettings.fulfilled, (state, action) => {
        state.securitySettingsLoading = false;
        state.securitySettings = action.payload;
      })
      .addCase(fetchSecuritySettings.rejected, (state, action) => {
        state.securitySettingsLoading = false;
        state.securitySettingsError = action.payload;
      })
      .addCase(updateSecuritySettings.fulfilled, (state, action) => {
        state.securitySettings = action.payload.securitySettings;
      });

    // System Configuration
    builder
      .addCase(fetchSystemConfig.pending, (state) => {
        state.systemConfigLoading = true;
        state.systemConfigError = null;
      })
      .addCase(fetchSystemConfig.fulfilled, (state, action) => {
        state.systemConfigLoading = false;
        state.systemConfig = action.payload;
      })
      .addCase(fetchSystemConfig.rejected, (state, action) => {
        state.systemConfigLoading = false;
        state.systemConfigError = action.payload;
      })
      .addCase(updateSystemConfig.fulfilled, (state, action) => {
        state.systemConfig = action.payload;
      });

    // Audit Logs
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.auditLogsLoading = true;
        state.auditLogsError = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogsLoading = false;
        state.auditLogs = action.payload.data;
        state.auditLogsPagination = action.payload.pagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.auditLogsLoading = false;
        state.auditLogsError = action.payload;
      });
  }
});

export const {
  setActiveTab,
  setShowUserModal,
  setShowRoleModal,
  setShowSecurityModal,
  setShowConfigModal,
  setEditingUser,
  setEditingRole,
  setEditingSecurity,
  setEditingConfig,
  clearErrors
} = adminConfigSlice.actions;

export default adminConfigSlice.reducer;
