import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPanel() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/admin/grant-applications'
        : `/api/admin/grant-applications?status=${statusFilter}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch applications');
      
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/grant-applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      fetchApplications();
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      received: 'bg-blue-100 text-blue-800',
      'in-review': 'bg-yellow-100 text-yellow-800',
      granted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Grant Applications Admin</h1>
          <p className="mt-2 text-gray-600">
            {user ? `Logged in as: ${user.name}` : 'Development Mode'}
          </p>
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Applications</option>
            <option value="received">Received</option>
            <option value="in-review">In Review</option>
            <option value="granted">Granted</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="text-sm text-gray-600">
            {applications.length} application(s)
          </span>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.projectTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.applicantName}</div>
                    <div className="text-sm text-gray-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{app.grantCategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.fundingAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(app.submittedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No applications found
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

function ApplicationDetailModal({ application, onClose, onUpdateStatus }) {
  const [newStatus, setNewStatus] = useState(application.status);

  const handleUpdateStatus = () => {
    if (newStatus !== application.status) {
      onUpdateStatus(application.id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <p className="text-gray-900">{application.projectTitle}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funding Amount</label>
              <p className="text-gray-900">{application.fundingAmount}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
              <p className="text-gray-900">{application.applicantName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{application.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <p className="text-gray-900">{application.organization || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p className="text-gray-900 capitalize">{application.grantCategory}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <p className="text-gray-900">{application.timeline}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
              <p className="text-gray-900">{new Date(application.submittedAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <p className="text-gray-900 whitespace-pre-wrap">{application.projectDescription}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technical Details</label>
            <p className="text-gray-900 whitespace-pre-wrap">{application.technicalDetails}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Experience</label>
            <p className="text-gray-900 whitespace-pre-wrap">{application.teamExperience}</p>
          </div>

          {application.githubRepo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository</label>
              <a
                href={application.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {application.githubRepo}
              </a>
            </div>
          )}

          {application.additionalInfo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
              <p className="text-gray-900 whitespace-pre-wrap">{application.additionalInfo}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
            <div className="flex gap-4 items-center">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="received">Received</option>
                <option value="in-review">In Review</option>
                <option value="granted">Granted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={newStatus === application.status}
                className={`px-6 py-2 rounded-lg font-medium ${
                  newStatus === application.status
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
