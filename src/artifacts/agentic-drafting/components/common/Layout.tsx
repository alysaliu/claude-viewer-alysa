import React from 'react';
import { Bell, Briefcase } from 'lucide-react';
import type { 
  Notification, 
  Job, 
  SidebarItem 
} from '../../types/drafting-types';
import { sidebarItems } from '../../data/sample-data';
import NotificationPanel from '../panels/NotificationPanel';
import JobsListPanel from '../panels/JobsListPanel';

interface LayoutProps {
  children: React.ReactNode;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  jobs: Job[];
  showJobsList: boolean;
  setShowJobsList: (show: boolean) => void;
  onNotificationAction?: (action: string, notificationId: number) => void;
  onJobClick?: (job: Job) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  notifications,
  showNotifications,
  setShowNotifications,
  jobs,
  showJobsList,
  setShowJobsList,
  onNotificationAction,
  onJobClick
}) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Davis v. Johnson - MVA Case</h1>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Update case
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Case history
            </button>
            
            {/* Notification and Jobs Icons */}
            <div className="flex items-center space-x-2 ml-2 relative">
              {/* Notification Bell */}
              <div className="relative notification-panel-container">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowJobsList(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell size={18} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    </div>
                  )}
                </button>
                {showNotifications && (
                  <NotificationPanel 
                    notifications={notifications}
                    onNotificationAction={onNotificationAction}
                  />
                )}
              </div>

              {/* Jobs List */}
              <div className="relative jobs-panel-container">
                <button
                  onClick={() => {
                    setShowJobsList(!showJobsList);
                    setShowNotifications(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Briefcase size={18} />
                </button>
                {showJobsList && (
                  <JobsListPanel 
                    jobs={jobs}
                    onJobClick={onJobClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200">
          <div className="p-4 space-y-1">
            {sidebarItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon()}
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;