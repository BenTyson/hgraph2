import { NavLink } from 'react-router-dom'
import { HomeIcon, BeakerIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolid, BeakerIcon as BeakerSolid } from '@heroicons/react/24/solid'

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">HGraph2</h1>
            <p className="text-xs text-gray-500">Hemp Graphene Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <HomeSolid className="mr-3 h-5 w-5 text-blue-600" />
              ) : (
                <HomeIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
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
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <BeakerSolid className="mr-3 h-5 w-5 text-blue-600" />
              ) : (
                <BeakerIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              )}
              Batch Explorer
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <p className="font-medium">Production Analytics</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
