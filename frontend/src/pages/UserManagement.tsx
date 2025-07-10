import { useState } from 'react'
import { 
  UserIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ShieldCheckIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Badge } from '../components/Badge'
import { SearchInput } from '../components/SearchInput'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'scientist' | 'analyst' | 'viewer'
  department: string
  lastActive: string
  status: 'active' | 'inactive'
  permissions: string[]
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isAddingUser, setIsAddingUser] = useState(false)

  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@hgraph2.com',
      role: 'admin',
      department: 'Research & Development',
      lastActive: '2025-07-10T15:30:00Z',
      status: 'active',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Dr. Torsten Busch',
      email: 'torsten.busch@hgraph2.com',
      role: 'scientist',
      department: 'Process Engineering',
      lastActive: '2025-07-10T14:45:00Z',
      status: 'active',
      permissions: ['batches', 'analysis', 'reports']
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@hgraph2.com',
      role: 'analyst',
      department: 'Quality Control',
      lastActive: '2025-07-10T16:20:00Z',
      status: 'active',
      permissions: ['analysis', 'quality', 'reports']
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.wilson@hgraph2.com',
      role: 'viewer',
      department: 'Management',
      lastActive: '2025-07-09T09:15:00Z',
      status: 'active',
      permissions: ['dashboard', 'reports']
    }
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="red">Admin</Badge>
      case 'scientist':
        return <Badge variant="blue">Scientist</Badge>
      case 'analyst':
        return <Badge variant="green">Analyst</Badge>
      case 'viewer':
        return <Badge variant="gray">Viewer</Badge>
      default:
        return <Badge variant="gray">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="green" size="sm">Active</Badge>
      : <Badge variant="gray" size="sm">Inactive</Badge>
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const roleStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    scientist: users.filter(u => u.role === 'scientist').length,
    analyst: users.filter(u => u.role === 'analyst').length,
    viewer: users.filter(u => u.role === 'viewer').length,
    active: users.filter(u => u.status === 'active').length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">Manage user accounts, roles, and permissions</p>
          </div>
          <button 
            onClick={() => setIsAddingUser(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-red-600">{roleStats.admin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Scientists</p>
              <p className="text-2xl font-bold text-blue-600">{roleStats.scientist}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Analysts</p>
              <p className="text-2xl font-bold text-green-600">{roleStats.analyst}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{roleStats.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SearchInput
              placeholder="Search users..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="md:col-span-2"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="scientist">Scientist</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Role Permissions Matrix</h2>
          <p className="text-sm text-gray-600">Overview of access levels by role</p>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Feature</th>
                  <th className="text-center py-2 px-4 font-medium text-red-600">Admin</th>
                  <th className="text-center py-2 px-4 font-medium text-blue-600">Scientist</th>
                  <th className="text-center py-2 px-4 font-medium text-green-600">Analyst</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-600">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Dashboard', admin: true, scientist: true, analyst: true, viewer: true },
                  { feature: 'Batch Explorer', admin: true, scientist: true, analyst: true, viewer: false },
                  { feature: 'Create Batches', admin: true, scientist: true, analyst: false, viewer: false },
                  { feature: 'Analysis Results', admin: true, scientist: true, analyst: true, viewer: false },
                  { feature: 'Data Import', admin: true, scientist: true, analyst: false, viewer: false },
                  { feature: 'Reports', admin: true, scientist: true, analyst: true, viewer: true },
                  { feature: 'Quality Control', admin: true, scientist: false, analyst: true, viewer: false },
                  { feature: 'User Management', admin: true, scientist: false, analyst: false, viewer: false },
                ].map((perm, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-4 text-gray-900">{perm.feature}</td>
                    <td className="py-2 px-4 text-center">
                      {perm.admin ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 bg-gray-200 rounded-full mx-auto"></div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {perm.scientist ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 bg-gray-200 rounded-full mx-auto"></div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {perm.analyst ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 bg-gray-200 rounded-full mx-auto"></div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {perm.viewer ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="h-5 w-5 bg-gray-200 rounded-full mx-auto"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
