import React from 'react';
import { Bell, Briefcase, Eye, X } from 'lucide-react';
import type { 
  ViewMode, 
  Notification, 
  Job, 
  SidebarItem 
} from '../../types/drafting-types';
import { sidebarItems } from '../../data/sample-data';
import NotificationPanel from '../panels/NotificationPanel';
import JobsListPanel from '../panels/JobsListPanel';

interface ReviewInterfaceProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  jobs: Job[];
  showJobsList: boolean;
  setShowJobsList: (show: boolean) => void;
  onNotificationAction?: (action: string, notificationId: number) => void;
  onJobClick?: (job: Job) => void;
}

const ReviewInterface: React.FC<ReviewInterfaceProps> = ({
  viewMode,
  setViewMode,
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

        {/* Document Editor */}
        <div className="flex-1 bg-white">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="font-medium text-gray-900">Complaint - Davis v. Johnson</h2>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                  98% Complete
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('clean')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'clean' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Clean View
                  </button>
                  <button
                    onClick={() => setViewMode('changes')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'changes' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Changes View
                  </button>
                  <button
                    onClick={() => setViewMode('compare')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'compare' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-8 prose max-w-none overflow-auto">
            <h1 className="text-center text-2xl font-bold mb-8">
              IN THE CIRCUIT COURT OF SPRINGFIELD COUNTY<br />
              STATE OF ILLINOIS, LAW DIVISION
            </h1>

            <div className="mb-8">
              <p className="font-bold">SARAH DAVIS,</p>
              <p className="ml-8">Plaintiff,</p>
              <p className="mt-2">v.</p>
              <p className="mt-2 font-bold">MICHAEL JOHNSON,</p>
              <p className="font-bold">and <span className="bg-yellow-200">[INSURANCE COMPANY - needs confirmation]</span>,</p>
              <p className="ml-8">Defendants.</p>
            </div>

            <h2 className="text-center font-bold text-xl mb-6">COMPLAINT AT LAW</h2>

            <p className="mb-4">
              NOW COMES the Plaintiff, <span className="font-semibold">SARAH DAVIS</span>, by and through undersigned counsel, 
              and brings this Complaint against Defendants <span className="font-semibold">MICHAEL JOHNSON</span> and{' '}
              <span className="bg-yellow-200">[INSURANCE COMPANY - needs confirmation]</span>, and in support states as follows:
            </p>

            <h3 className="font-bold mt-6 mb-3">PARTIES</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Plaintiff <span className="font-semibold">SARAH DAVIS</span> is an individual residing in Springfield County, Illinois.
              </li>
              <li>
                Defendant <span className="font-semibold">MICHAEL JOHNSON</span> is an individual residing in Springfield County, Illinois.
              </li>
              <li>
                {viewMode === 'changes' && <span className="line-through text-gray-400">Defendant XYZ INSURANCE is a corporation...</span>}
                <span className={viewMode === 'changes' ? "bg-blue-100" : ""}>
                  Defendant <span className="bg-yellow-200">[INSURANCE COMPANY]</span> is believed to be the insurance carrier
                  for Defendant MICHAEL JOHNSON.
                </span>
              </li>
            </ol>

            <h3 className="font-bold mt-6 mb-3">FACTS</h3>
            <ol className="list-decimal pl-6 space-y-2" start={4}>
              <li>
                On <span className="font-semibold">March 15, 2024</span>, at approximately 2:30 PM, Plaintiff was lawfully operating
                her motor vehicle eastbound on Oak Street in Springfield, Illinois.
              </li>
              <li>
                At said time and place, Defendant MICHAEL JOHNSON was operating his motor vehicle
                westbound on Oak Street, approaching the intersection with Main Street.
              </li>
              <li>
                {viewMode === 'changes' && (
                  <span className="line-through text-gray-400">Defendant JOHNSON was under the influence of alcohol...</span>
                )}
                <span className={viewMode === 'changes' ? "bg-blue-100" : ""}>
                  Defendant JOHNSON was distracted by his mobile device and failed to observe the traffic signal
                  at the intersection of Oak Street and Main Street, running a red light.
                </span>
              </li>
              <li>
                As a direct result of Defendant JOHNSON's negligent operation of his vehicle, 
                his vehicle collided with Plaintiff's vehicle in the intersection, causing significant damage
                and injuries to Plaintiff.
              </li>
            </ol>

            <h3 className="font-bold mt-6 mb-3">COUNT I - NEGLIGENCE</h3>
            <p className="mb-2">(Against Defendant MICHAEL JOHNSON)</p>
            <ol className="list-decimal pl-6 space-y-2" start={8}>
              <li>Plaintiff realleges and incorporates paragraphs 1 through 7 as if fully set forth herein.</li>
              <li>
                Defendant JOHNSON owed a duty to Plaintiff and other motorists to operate his vehicle in a safe and 
                reasonable manner, including obeying traffic control devices.
              </li>
              <li>
                Defendant JOHNSON breached said duty by operating his vehicle while distracted by his mobile device,
                failing to observe the traffic signal, and running a red light.
              </li>
              <li>
                As a direct and proximate result of Defendant JOHNSON's negligence, Plaintiff sustained serious
                injuries including back injuries requiring ongoing treatment, totaling $47,500 in medical expenses.
              </li>
            </ol>

            <h3 className="font-bold mt-6 mb-3">WHEREFORE</h3>
            <p className="mb-4">
              WHEREFORE, Plaintiff SARAH DAVIS respectfully requests that this Honorable Court enter judgment
              in her favor and against Defendant MICHAEL JOHNSON for damages in excess of $50,000, together with
              costs of suit, and for such other relief as this Court deems just and proper.
            </p>
            
            <div className="mt-8 text-right">
              <p className="mb-2">Respectfully submitted,</p>
              <p className="mb-4">SARAH DAVIS, Plaintiff</p>
              <p>By: _________________________</p>
              <p>[Attorney Name]</p>
              <p>[Attorney Information]</p>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                Find Next Gap
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Accept All Changes
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 space-y-4 p-4 bg-gray-50 overflow-auto">
          {/* Fill Gaps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Fill Gaps</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Insurance Company Name</p>
                <p className="text-xs text-gray-600 mt-1">Page 1, Parties section</p>
                <input
                  type="text"
                  placeholder="Enter insurance company name..."
                  className="mt-2 w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-center text-sm text-gray-500">
                2 more items need input
              </div>
            </div>
          </div>

          {/* Key Changes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Strategic Adaptations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Simplified defendant structure</p>
                  <p className="text-gray-600">Focused on individual defendant rather than commercial entity</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Updated jurisdiction</p>
                  <p className="text-gray-600">Changed venue to Springfield County based on case location</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Incorporated medical damages</p>
                  <p className="text-gray-600">Included $47,500 in medical expenses from case files</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Adapted fact pattern</p>
                  <p className="text-gray-600">Updated accident location and circumstances to match Davis v. Johnson case</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewInterface;