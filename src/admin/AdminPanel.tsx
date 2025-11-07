import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { loginWithReplit } from "@/lib/authUtils";
import { Grant, GrantCategory, GrantApplication, GrantApplicationWithUnreadCount, GrantApplicationStatusEnum } from "@shared/schema";
import { Plus, Edit, Trash2, Search, Shield, AlertTriangle, MessageCircle } from "lucide-react";
import GrantFormModal from "../components/grant-form-modal";
import CategoryFormModal from "../components/CategoryFormModal";
import ApplicationDetailModal from "../components/ApplicationDetailModal";

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated, isAdmin, error: authError } = useAuth();

  // Fetch grants
  const { 
    data: grants = [], 
    isLoading: grantsLoading, 
    error: grantsError 
  } = useQuery<Grant[]>({
    queryKey: ["/api", "admin", "grants"],
    retry: 1,
  });

  // Fetch grant categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery<GrantCategory[]>({
    queryKey: ["/api", "admin", "grant-categories"],
    retry: 1,
  });

  // Fetch grant applications by status
  const { 
    data: receivedApplications = [], 
    isLoading: receivedLoading 
  } = useQuery<GrantApplicationWithUnreadCount[]>({
    queryKey: ["/api", "admin", "grant-applications", { status: "received" }],
    queryFn: () => fetch("/api/admin/grant-applications?status=received").then(res => res.json()),
    retry: 1,
  });

  const { 
    data: inReviewApplications = [], 
    isLoading: inReviewLoading 
  } = useQuery<GrantApplicationWithUnreadCount[]>({
    queryKey: ["/api", "admin", "grant-applications", { status: "in-review" }],
    queryFn: () => fetch("/api/admin/grant-applications?status=in-review").then(res => res.json()),
    retry: 1,
  });

  const { 
    data: grantedApplications = [], 
    isLoading: grantedLoading 
  } = useQuery<GrantApplicationWithUnreadCount[]>({
    queryKey: ["/api", "admin", "grant-applications", { status: "granted" }],
    queryFn: () => fetch("/api/admin/grant-applications?status=granted").then(res => res.json()),
    retry: 1,
  });

  const { 
    data: rejectedApplications = [], 
    isLoading: rejectedLoading 
  } = useQuery<GrantApplicationWithUnreadCount[]>({
    queryKey: ["/api", "admin", "grant-applications", { status: "rejected" }],
    queryFn: () => fetch("/api/admin/grant-applications?status=rejected").then(res => res.json()),
    retry: 1,
  });

  // Calculate if any applications are loading
  const applicationsLoading = receivedLoading || inReviewLoading || grantedLoading || rejectedLoading;

  // Calculate unread counts per tab
  const receivedUnreadCount = receivedApplications.reduce((sum, app) => sum + app.unreadMessageCount, 0);
  const inReviewUnreadCount = inReviewApplications.reduce((sum, app) => sum + app.unreadMessageCount, 0);
  const grantedUnreadCount = grantedApplications.reduce((sum, app) => sum + app.unreadMessageCount, 0);
  const rejectedUnreadCount = rejectedApplications.reduce((sum, app) => sum + app.unreadMessageCount, 0);

  // Delete grant mutation
  const deleteGrantMutation = useMutation({
    mutationFn: async (grantId: string) => {
      await apiRequest("DELETE", `/api/admin/grants/${grantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grants"] });
      toast({
        title: "Success",
        description: "Grant deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete grant",
        variant: "destructive",
      });
    },
  });

  // Status change mutation
  const changeStatusMutation = useMutation({
    mutationFn: async ({ applicationId, newStatus }: { applicationId: string; newStatus: string }) => {
      return await apiRequest("PATCH", `/api/admin/grant-applications/${applicationId}/status`, {
        status: newStatus
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate specific status queries to ensure proper tab updates
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grant-applications", { status: "received" }] });
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grant-applications", { status: "in-review" }] });
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grant-applications", { status: "granted" }] });
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grant-applications", { status: "rejected" }] });
      
      // Also invalidate the general query
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grant-applications"] });
      
      const statusMessages = {
        received: "Application moved to Received",
        "in-review": "Application moved to In Review", 
        granted: "Application granted",
        rejected: "Application rejected"
      };
      
      toast({
        title: "Success",
        description: statusMessages[variables.newStatus as keyof typeof statusMessages] || "Application status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    changeStatusMutation.mutate({ applicationId, newStatus });
  };


  // Filter grants based on search and filters
  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || grant.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === "all" || grant.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "featured":
        return "default";
      case "high-priority":
        return "destructive";
      case "closed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleEdit = (grant: Grant) => {
    setEditingGrant(grant);
    setIsFormModalOpen(true);
  };

  const handleDelete = (grantId: string) => {
    deleteGrantMutation.mutate(grantId);
  };

  const handleCreateNew = () => {
    setEditingGrant(null);
    setIsFormModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setEditingGrant(null);
  };

  const handleCreateCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleApplicationClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsApplicationModalOpen(true);
  };

  const handleApplicationModalClose = () => {
    setIsApplicationModalOpen(false);
    setSelectedApplicationId(null);
  };

  // Show loading state while checking authentication or loading data
  if (authLoading || grantsLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="text-sm text-gray-500">Checking permissions...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show login required state for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Shield className="h-16 w-16 text-blue-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900" data-testid="heading-login-required">
                Authentication Required
              </h2>
              <p className="text-gray-600">
                You need to be logged in to access the admin panel.
              </p>
              <Button 
                onClick={loginWithReplit}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-login"
              >
                Login with Replit
              </Button>
              {authError && (
                <p className="text-sm text-red-600 mt-2" data-testid="text-auth-error">
                  Error: {authError.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for authenticated but non-admin users
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-red-600" data-testid="heading-access-denied">
                Access Denied
              </h2>
              <p className="text-gray-600">
                You don't have administrator privileges to access this panel.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Logged in as: <span className="font-medium">{user?.email}</span></p>
                <p>User ID: <span className="font-mono text-xs">{user?.id}</span></p>
              </div>
              <p className="text-xs text-gray-400">
                Contact a system administrator if you believe this is an error.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state for data loading errors (now that we know user is authenticated and admin)
  if (grantsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-red-600" data-testid="heading-data-error">
                Data Loading Error
              </h2>
              <p className="text-gray-600">
                Failed to load grants data. This might be a temporary server issue.
              </p>
              <p className="text-sm text-gray-500" data-testid="text-error-details">
                Error: {grantsError.message}
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Logged in as: <span className="font-medium">{user?.email}</span> (Admin)</p>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-reload"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="heading-admin-panel">
              Admin Panel - Developer Grants
            </h1>
            <p className="text-gray-600 mt-2">
              Manage grant programs and applications
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleCreateCategory}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              data-testid="button-create-category"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
            <Button 
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-create-grant"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Grant
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search grants by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-grants"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48" data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="high-priority">High Priority</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grants Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Grants ({filteredGrants.length} of {grants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredGrants.length === 0 ? (
              <div className="text-center py-8 text-gray-500" data-testid="text-no-grants">
                {searchQuery || selectedCategory !== "all" || selectedStatus !== "all" 
                  ? "No grants match your current filters." 
                  : "No grants found. Create your first grant to get started."
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrants.map((grant) => {
                      const category = categories.find(c => c.id === grant.categoryId);
                      return (
                        <TableRow key={grant.id} data-testid={`row-grant-${grant.id}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium" data-testid={`text-grant-title-${grant.id}`}>
                                {grant.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {grant.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell data-testid={`text-grant-category-${grant.id}`}>
                            {category?.name || "Unknown"}
                          </TableCell>
                          <TableCell data-testid={`text-grant-amount-${grant.id}`}>
                            {grant.amount}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusBadgeVariant(grant.status)}
                              data-testid={`badge-grant-status-${grant.id}`}
                            >
                              {grant.status.replace("-", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`text-grant-deadline-${grant.id}`}>
                            {grant.deadline}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(grant)}
                                data-testid={`button-edit-${grant.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    data-testid={`button-delete-${grant.id}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the grant
                                      "{grant.title}" and remove it from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-testid={`button-cancel-delete-${grant.id}`}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(grant.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deleteGrantMutation.isPending}
                                      data-testid={`button-confirm-delete-${grant.id}`}
                                    >
                                      {deleteGrantMutation.isPending ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grant Applications - Tabbed Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Grant Applications Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="received" data-testid="tab-received" className="relative">
                  <span>Received ({receivedApplications.length})</span>
                  {receivedUnreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center" data-testid="badge-received-unread">
                      {receivedUnreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="in-review" data-testid="tab-in-review" className="relative">
                  <span>In Review ({inReviewApplications.length})</span>
                  {inReviewUnreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center" data-testid="badge-in-review-unread">
                      {inReviewUnreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="granted" data-testid="tab-granted" className="relative">
                  <span>Granted ({grantedApplications.length})</span>
                  {grantedUnreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center" data-testid="badge-granted-unread">
                      {grantedUnreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="rejected" data-testid="tab-rejected" className="relative">
                  <span>Rejected ({rejectedApplications.length})</span>
                  {rejectedUnreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center" data-testid="badge-rejected-unread">
                      {rejectedUnreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Received Applications Tab */}
              <TabsContent value="received" className="mt-4">
                {receivedLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : receivedApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500" data-testid="text-no-received-applications">
                    No new applications received yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Project Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Funding Amount</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {receivedApplications.map((application) => (
                          <TableRow 
                            key={application.id} 
                            data-testid={`row-received-application-${application.id}`} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleApplicationClick(application.id)}
                          >
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium" data-testid={`text-received-applicant-name-${application.id}`}>
                                    {application.applicantName}
                                  </div>
                                  <div className="text-sm text-gray-500" data-testid={`text-received-applicant-email-${application.id}`}>
                                    {application.email}
                                  </div>
                                </div>
                                {application.unreadMessageCount > 0 && (
                                  <div className="flex items-center gap-1" data-testid={`badge-unread-${application.id}`}>
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {application.unreadMessageCount}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium max-w-xs truncate" data-testid={`text-received-project-title-${application.id}`}>
                                {application.projectTitle}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-received-grant-category-${application.id}`}>
                              {application.grantCategory}
                            </TableCell>
                            <TableCell data-testid={`text-received-funding-amount-${application.id}`}>
                              {application.fundingAmount}
                            </TableCell>
                            <TableCell data-testid={`text-received-organization-${application.id}`}>
                              {application.organization || "Individual"}
                            </TableCell>
                            <TableCell data-testid={`text-received-submitted-date-${application.id}`}>
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                <Select onValueChange={(value) => handleStatusChange(application.id, value)}>
                                  <SelectTrigger className="w-32" data-testid={`select-status-${application.id}`}>
                                    <SelectValue placeholder="Move to..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="in-review">In Review</SelectItem>
                                    <SelectItem value="granted">Granted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* In Review Applications Tab */}
              <TabsContent value="in-review" className="mt-4">
                {inReviewLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : inReviewApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500" data-testid="text-no-in-review-applications">
                    No applications currently under review.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Project Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Funding Amount</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inReviewApplications.map((application) => (
                          <TableRow 
                            key={application.id} 
                            data-testid={`row-in-review-application-${application.id}`} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleApplicationClick(application.id)}
                          >
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium" data-testid={`text-in-review-applicant-name-${application.id}`}>
                                    {application.applicantName}
                                  </div>
                                  <div className="text-sm text-gray-500" data-testid={`text-in-review-applicant-email-${application.id}`}>
                                    {application.email}
                                  </div>
                                </div>
                                {application.unreadMessageCount > 0 && (
                                  <div className="flex items-center gap-1" data-testid={`badge-unread-${application.id}`}>
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {application.unreadMessageCount}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium max-w-xs truncate" data-testid={`text-in-review-project-title-${application.id}`}>
                                {application.projectTitle}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-in-review-grant-category-${application.id}`}>
                              {application.grantCategory}
                            </TableCell>
                            <TableCell data-testid={`text-in-review-funding-amount-${application.id}`}>
                              {application.fundingAmount}
                            </TableCell>
                            <TableCell data-testid={`text-in-review-organization-${application.id}`}>
                              {application.organization || "Individual"}
                            </TableCell>
                            <TableCell data-testid={`text-in-review-submitted-date-${application.id}`}>
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                <Select onValueChange={(value) => handleStatusChange(application.id, value)}>
                                  <SelectTrigger className="w-32" data-testid={`select-status-${application.id}`}>
                                    <SelectValue placeholder="Move to..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="granted">Granted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Granted Applications Tab */}
              <TabsContent value="granted" className="mt-4">
                {grantedLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : grantedApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500" data-testid="text-no-granted-applications">
                    No applications have been granted yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Project Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Funding Amount</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grantedApplications.map((application) => (
                          <TableRow 
                            key={application.id} 
                            data-testid={`row-granted-application-${application.id}`} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleApplicationClick(application.id)}
                          >
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium" data-testid={`text-granted-applicant-name-${application.id}`}>
                                    {application.applicantName}
                                  </div>
                                  <div className="text-sm text-gray-500" data-testid={`text-granted-applicant-email-${application.id}`}>
                                    {application.email}
                                  </div>
                                </div>
                                {application.unreadMessageCount > 0 && (
                                  <div className="flex items-center gap-1" data-testid={`badge-unread-${application.id}`}>
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {application.unreadMessageCount}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium max-w-xs truncate" data-testid={`text-granted-project-title-${application.id}`}>
                                {application.projectTitle}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-granted-grant-category-${application.id}`}>
                              {application.grantCategory}
                            </TableCell>
                            <TableCell data-testid={`text-granted-funding-amount-${application.id}`}>
                              {application.fundingAmount}
                            </TableCell>
                            <TableCell data-testid={`text-granted-organization-${application.id}`}>
                              {application.organization || "Individual"}
                            </TableCell>
                            <TableCell data-testid={`text-granted-submitted-date-${application.id}`}>
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                <Select onValueChange={(value) => handleStatusChange(application.id, value)}>
                                  <SelectTrigger className="w-32" data-testid={`select-status-${application.id}`}>
                                    <SelectValue placeholder="Move to..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="in-review">In Review</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Rejected Applications Tab */}
              <TabsContent value="rejected" className="mt-4">
                {rejectedLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : rejectedApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500" data-testid="text-no-rejected-applications">
                    No applications have been rejected.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Project Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Funding Amount</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedApplications.map((application) => (
                          <TableRow 
                            key={application.id} 
                            data-testid={`row-rejected-application-${application.id}`} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleApplicationClick(application.id)}
                          >
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium" data-testid={`text-rejected-applicant-name-${application.id}`}>
                                    {application.applicantName}
                                  </div>
                                  <div className="text-sm text-gray-500" data-testid={`text-rejected-applicant-email-${application.id}`}>
                                    {application.email}
                                  </div>
                                </div>
                                {application.unreadMessageCount > 0 && (
                                  <div className="flex items-center gap-1" data-testid={`badge-unread-${application.id}`}>
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {application.unreadMessageCount}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium max-w-xs truncate" data-testid={`text-rejected-project-title-${application.id}`}>
                                {application.projectTitle}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-rejected-grant-category-${application.id}`}>
                              {application.grantCategory}
                            </TableCell>
                            <TableCell data-testid={`text-rejected-funding-amount-${application.id}`}>
                              {application.fundingAmount}
                            </TableCell>
                            <TableCell data-testid={`text-rejected-organization-${application.id}`}>
                              {application.organization || "Individual"}
                            </TableCell>
                            <TableCell data-testid={`text-rejected-submitted-date-${application.id}`}>
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                <Select onValueChange={(value) => handleStatusChange(application.id, value)}>
                                  <SelectTrigger className="w-32" data-testid={`select-status-${application.id}`}>
                                    <SelectValue placeholder="Move to..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="in-review">In Review</SelectItem>
                                    <SelectItem value="granted">Granted</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Grant Form Modal */}
        <GrantFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormClose}
          editingGrant={editingGrant}
          categories={categories}
        />

        {/* Application Detail Modal */}
        <ApplicationDetailModal
          applicationId={selectedApplicationId}
          isOpen={isApplicationModalOpen}
          onClose={handleApplicationModalClose}
        />

        {/* Category Form Modal */}
        <CategoryFormModal
          isOpen={isCategoryModalOpen}
          onClose={handleCategoryModalClose}
        />
      </div>
    </div>
  );
}