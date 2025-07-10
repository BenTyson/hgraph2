// frontend/src/components/Sidebar.tsx - Updated with new pages
import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  BeakerIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  UsersIcon,
  CubeIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeSolid, 
  BeakerIcon as BeakerSolid, 
  ChartBarIcon as ChartBarSolid, 
  DocumentTextIcon as DocumentTextSolid, 
  ArrowUpTrayIcon as ArrowUpTraySolid,
  ShieldCheckIcon as ShieldCheckSolid,
  UsersIcon as UsersSolid,
  CubeIcon as CubeSolid,
  BoltIcon as BoltSolid
} from '@heroicons/react/24/solid'
import { ThemeToggle } from './ThemeToggle'

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HG</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HGraph2</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hemp Graphene Analytics</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <HomeSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <HomeIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink
          to="/batches"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <BeakerSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <BeakerIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Batch Explorer
            </>
          )}
        </NavLink>

        {/* NEW: BET Analysis */}
        <NavLink
          to="/bet-analysis"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <CubeSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <CubeIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              BET Analysis
            </>
          )}
        </NavLink>

        {/* NEW: Supercapacitor Application */}
        <NavLink
          to="/supercapacitor"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <BoltSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <BoltIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Supercapacitor
            </>
          )}
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <ChartBarSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <ChartBarIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Analysis Results
            </>
          )}
        </NavLink>

        <NavLink
          to="/quality"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <ShieldCheckSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <ShieldCheckIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Quality Control
            </>
          )}
        </NavLink>

        <NavLink
          to="/import"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <ArrowUpTraySolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <ArrowUpTrayIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Data Import
            </>
          )}
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <DocumentTextSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <DocumentTextIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              Reports
            </>
          )}
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <UsersSolid className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <UsersIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
              )}
              User Management
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p className="font-medium">Production Analytics</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}