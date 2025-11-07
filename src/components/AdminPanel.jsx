import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPanel() {
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch applications when filters change
  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/grant-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

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
      received: 'bg-blue-500 text-white',
      'in-review': 'bg-yellow-500 text-white',
      granted: 'bg-green-500 text-white',
      rejected: 'bg-red-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getStatusLabel = (status) => {
    const labels = {
      received: 'Received',
      'in-review': 'In Review',
      granted: 'Granted',
      rejected: 'Rejected'
    };
    return labels[status] || status;
  };

  // Filter applications by search and category
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.projectDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || app.grantCategory === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate status counts
  const statusCounts = {
    received: applications.filter(a => a.status === 'received').length,
    'in-review': applications.filter(a => a.status === 'in-review').length,
    granted: applications.filter(a => a.status === 'granted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grant Applications Admin</h1>
          <p className="text-gray-600">Logged in as: {user?.email || 'undefined'}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search grants by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="received">Received</option>
              <option value="in-review">In Review</option>
              <option value="granted">Granted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Grant Applications Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Grant Applications Management</h2>
          
          {/* Status Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setStatusFilter('received')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                statusFilter === 'received' 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Received ({statusCounts.received})
            </button>
            <button
              onClick={() => setStatusFilter('in-review')}
              className={`px-4 py-2 border-b-2 transition-colors relative ${
                statusFilter === 'in-review' 
                  ? 'border-yellow-500 text-yellow-600 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              In Review ({statusCounts['in-review']})
              {statusCounts['in-review'] > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {statusCounts['in-review']}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('granted')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                statusFilter === 'granted' 
                  ? 'border-green-500 text-green-600 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Granted ({statusCounts.granted})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                statusFilter === 'rejected' 
                  ? 'border-red-500 text-red-600 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                statusFilter === 'all' 
                  ? 'border-gray-500 text-gray-900 font-medium' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({applications.length})
            </button>
          </div>

          {/* Applications Table */}
          {error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No applications found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Applicant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Project Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Funding Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Submitted</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{app.applicantName}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{app.projectTitle}</td>
                      <td className="py-3 px-4 text-gray-700">{app.grantCategory}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">${app.fundingAmount}</td>
                      <td className="py-3 px-4 text-gray-700">{app.organization || '-'}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{formatDate(app.submittedAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            className="text-sm px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="received">Move to...</option>
                            <option value="received">Received</option>
                            <option value="in-review">In Review</option>
                            <option value="granted">Granted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApp && (
          <ApplicationDetailModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStatusUpdate={updateStatus}
          />
        )}
      </div>
    </div>
  );
}

function ApplicationDetailModal({ application, onClose, onStatusUpdate }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    pollIntervalRef.current = setInterval(fetchMessages, 5000);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [application.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/admin/grant-applications/${application.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`/api/admin/grant-applications/${application.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      } else {
        alert('Failed to send message');
      }
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow new line
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      received: 'bg-blue-500',
      'in-review': 'bg-yellow-500',
      granted: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      received: 'RECEIVED',
      'in-review': 'IN-REVIEW',
      granted: 'GRANTED',
      rejected: 'REJECTED'
    };
    return labels[status] || status.toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Grant Application Details</h2>
            <p className="text-gray-600 mt-1">Review and manage this grant application submission</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-lg text-white text-sm font-bold ${getStatusColor(application.status)}`}>
              {getStatusLabel(application.status)}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Application Status Management */}
          <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold text-gray-900">Application Status Management</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onStatusUpdate(application.id, 'in-review')}
                disabled={application.status === 'in-review'}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Move to In Review
              </button>
              <button
                onClick={() => onStatusUpdate(application.id, 'granted')}
                disabled={application.status === 'granted'}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Grant Application
              </button>
              <button
                onClick={() => onStatusUpdate(application.id, 'rejected')}
                disabled={application.status === 'rejected'}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                ✕ Reject Application
              </button>
            </div>
          </div>

          {/* Applicant Information */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-bold text-gray-900">Applicant Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{application.applicantName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <p className="text-gray-900 font-medium">{application.email}</p>
              </div>
              {application.organization && (
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Organization
                  </label>
                  <p className="text-gray-900 font-medium">{application.organization}</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Information */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-bold text-gray-900">Project Information</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Project Title</label>
                  <p className="text-gray-900 font-medium">{application.projectTitle}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Grant Category</label>
                  <p className="text-gray-900 font-medium">{application.grantCategory}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Requested Funding Amount
                </label>
                <p className="text-gray-900 font-bold text-lg">${application.fundingAmount}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Project Description</label>
                <p className="text-gray-900 bg-white p-3 rounded border">{application.projectDescription}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Technical Details</label>
                <p className="text-gray-900 bg-white p-3 rounded border">{application.technicalDetails}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Timeline</label>
                <p className="text-gray-900 bg-white p-3 rounded border">{application.timeline}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Team Experience</label>
                <p className="text-gray-900 bg-white p-3 rounded border">{application.teamExperience}</p>
              </div>
              {application.githubRepo && (
                <div>
                  <label className="text-sm text-gray-600">GitHub Repository</label>
                  <a 
                    href={application.githubRepo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {application.githubRepo}
                  </a>
                </div>
              )}
              {application.additionalInfo && (
                <div>
                  <label className="text-sm text-gray-600">Additional Information</label>
                  <p className="text-gray-900 bg-white p-3 rounded border">{application.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submission Info */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Submitted Date
                </label>
                <p className="text-gray-900 font-medium">{formatDate(application.submittedAt)}</p>
              </div>
              {application.lastAdminViewedAt && (
                <div>
                  <label className="text-sm text-gray-600">Last Admin Review</label>
                  <p className="text-gray-900 font-medium">{formatDate(application.lastAdminViewedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Chat */}
          <div className="border-l-4 border-blue-500 bg-blue-50 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="font-bold text-gray-900">Application Chat</h3>
              </div>
              <button
                onClick={() => setChatCollapsed(!chatCollapsed)}
                className="text-gray-600 hover:text-gray-900"
              >
                {chatCollapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>
            
            {!chatCollapsed && (
              <>
                <div className="text-sm text-gray-600 mb-3">
                  <p className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Chat Token: <code className="bg-white px-2 py-1 rounded text-xs">{application.publicChatToken}</code>
                  </p>
                </div>

                {/* Messages */}
                <div className="bg-white rounded border p-4 mb-3 min-h-[200px] max-h-[400px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                      <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No messages yet. Start the conversation with the applicant.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderRole === 'admin' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm font-medium mb-1">
                              {msg.senderRole === 'admin' ? 'Admin' : 'Applicant'}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.body}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderRole === 'admin' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message to the applicant..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {newMessage.length}/10,000 characters • Press Enter to send, Shift+Enter for new line
                    </p>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </button>
                  </div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-3 text-sm">
                    <p className="font-medium text-blue-900 mb-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Chat Instructions:
                    </p>
                    <ul className="list-disc list-inside text-blue-800 space-y-1">
                      <li>Messages update automatically every 5 seconds</li>
                      <li>Applicants can respond using the chat token: <code className="bg-white px-1 rounded">{application.publicChatToken}</code></li>
                      <li>First admin message will move application to pipeline status</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
