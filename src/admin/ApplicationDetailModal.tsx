import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { GrantApplication, ChatMessage } from "@shared/schema";
import { 
  User, 
  Mail, 
  Building, 
  FileText, 
  DollarSign, 
  Calendar, 
  Code, 
  Users, 
  Github, 
  MessageSquare,
  ArrowRight,
  RotateCcw,
  X,
  Info,
  ExternalLink,
  Send,
  Clock,
  AlertCircle
} from "lucide-react";

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailModal({ 
  applicationId, 
  isOpen, 
  onClose 
}: ApplicationDetailModalProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPipelineDialog, setShowPipelineDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch individual application details
  const { 
    data: application, 
    isLoading, 
    error 
  } = useQuery<GrantApplication>({
    queryKey: [`/api/admin/grant-applications/${applicationId}`],
    enabled: !!applicationId && isOpen,
    retry: 1,
  });

  // Fetch chat messages with real-time polling
  const { 
    data: chatMessages = [], 
    isLoading: isLoadingMessages,
    refetch: refetchMessages 
  } = useQuery<ChatMessage[]>({
    queryKey: ["/api/admin/grant-applications", applicationId, "messages"],
    enabled: !!applicationId && isOpen,
    refetchInterval: isOpen ? 5000 : false, // Poll every 5 seconds when modal is open
    retry: 1,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageBody: string) => {
      if (!applicationId) throw new Error("No application ID");
      await apiRequest("POST", `/api/admin/grant-applications/${applicationId}/messages`, {
        body: messageBody.trim()
      });
    },
    onMutate: async (messageBody: string) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ 
        queryKey: ["/api/admin/grant-applications", applicationId, "messages"] 
      });

      // Snapshot the previous value for rollback
      const previousMessages = queryClient.getQueryData<ChatMessage[]>([
        "/api/admin/grant-applications", 
        applicationId, 
        "messages"
      ]);

      // CRITICAL: Check for prior admin messages BEFORE adding optimistic update
      const hasPriorAdmin = previousMessages?.some(m => m.senderRole === 'admin') || false;

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`, // Temporary ID for optimistic update
        applicationId: applicationId!,
        senderRole: 'admin',
        senderId: null,
        body: messageBody.trim(),
        createdAt: new Date(),
      };

      // Optimistically update the cache
      queryClient.setQueryData<ChatMessage[]>(
        ["/api/admin/grant-applications", applicationId, "messages"],
        (old = []) => [...old, optimisticMessage]
      );

      return { previousMessages, hasPriorAdmin };
    },
    onError: (error: Error, messageBody: string, context) => {
      // Rollback to previous state on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["/api/admin/grant-applications", applicationId, "messages"],
          context.previousMessages
        );
      }
      
      toast({
        title: "Failed to Send Message",
        description: error.message || "Unable to send message. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      setMessageText("");
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the applicant",
      });
    },
    onSettled: () => {
      // Always refetch to get the real server data and replace optimistic updates
      queryClient.invalidateQueries({ 
        queryKey: ["/api/admin/grant-applications", applicationId, "messages"] 
      });
      
      // Also invalidate application detail to refresh lastAdminViewedAt and other metadata
      queryClient.invalidateQueries({ 
        queryKey: [`/api/admin/grant-applications/${applicationId}`] 
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && chatMessages.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Focus message input when chat expands
  useEffect(() => {
    if (isChatExpanded && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isChatExpanded]);

  // Status update mutation
  const statusUpdateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/grant-applications/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      // Invalidate specific tab queries to update counts properly
      queryClient.invalidateQueries({ 
        queryKey: ["/api/admin/grant-applications", "received"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/admin/grant-applications", "in-review"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/admin/grant-applications", "rejected"] 
      });
      
      // Also invalidate the individual application detail
      queryClient.invalidateQueries({ 
        queryKey: [`/api/admin/grant-applications/${variables.id}`] 
      });
      
      const statusMessages = {
        "in-review": "Application moved to pipeline",
        rejected: "Application rejected",
        received: "Application restored to received"
      };
      
      toast({
        title: "Status Updated",
        description: statusMessages[variables.status as keyof typeof statusMessages] || "Status updated successfully",
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "received":
        return "secondary";
      case "in-review":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "text-blue-600";
      case "in-review":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleMoveToPipeline = () => {
    if (applicationId) {
      statusUpdateMutation.mutate({ id: applicationId, status: "in-review" });
      setShowPipelineDialog(false);
    }
  };

  const handleReject = () => {
    if (applicationId) {
      statusUpdateMutation.mutate({ id: applicationId, status: "rejected" });
      setShowRejectDialog(false);
    }
  };

  const handleRestore = () => {
    if (applicationId) {
      statusUpdateMutation.mutate({ id: applicationId, status: "in-review" });
      setShowRestoreDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || sendMessageMutation.isPending) return;
    
    if (trimmedMessage.length > 10000) {
      toast({
        title: "Message Too Long",
        description: "Messages must be under 10,000 characters",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate(trimmedMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto" data-testid="modal-application-detail">
          <SheetHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <SheetTitle className="text-2xl font-bold">
                  Grant Application Details
                </SheetTitle>
                <SheetDescription>
                  Review and manage this grant application submission
                </SheetDescription>
              </div>
              {application && (
                <Badge 
                  variant={getStatusBadgeVariant(application.status)}
                  className="text-sm px-3 py-1"
                  data-testid={`badge-application-status-${application.id}`}
                >
                  {application.status.toUpperCase()}
                </Badge>
              )}
            </div>
          </SheetHeader>

          {isLoading ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <X className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="heading-application-error">
                Failed to Load Application
              </h3>
              <p className="text-gray-600 mb-4">
                Unable to retrieve application details. This might be a temporary server issue.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                data-testid="button-reload-application"
              >
                Try Again
              </Button>
            </div>
          ) : !application ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="heading-application-not-found">
                Application Not Found
              </h3>
              <p className="text-gray-600">
                The requested application could not be found.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Management Actions */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Application Status Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {application.status === "received" && (
                      <Button
                        onClick={() => setShowPipelineDialog(true)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={statusUpdateMutation.isPending}
                        data-testid="button-move-to-pipeline"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Move to Pipeline
                      </Button>
                    )}
                    
                    {application.status !== "rejected" && (
                      <Button
                        onClick={() => setShowRejectDialog(true)}
                        variant="destructive"
                        disabled={statusUpdateMutation.isPending}
                        data-testid="button-reject-application"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Application
                      </Button>
                    )}
                    
                    {application.status === "rejected" && (
                      <Button
                        onClick={() => setShowRestoreDialog(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={statusUpdateMutation.isPending}
                        data-testid="button-restore-application"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore to Pipeline
                      </Button>
                    )}
                  </div>
                  
                  {statusUpdateMutation.isPending && (
                    <div className="mt-3 text-sm text-gray-600">
                      Updating application status...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Applicant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Full Name
                      </label>
                      <p className="text-gray-900 font-medium" data-testid="text-applicant-name">
                        {application.applicantName}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <p className="text-gray-900" data-testid="text-applicant-email">
                        {application.email}
                      </p>
                    </div>
                  </div>
                  
                  {application.organization && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Organization
                      </label>
                      <p className="text-gray-900" data-testid="text-applicant-organization">
                        {application.organization}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">
                        Project Title
                      </label>
                      <p className="text-gray-900 font-medium" data-testid="text-project-title">
                        {application.projectTitle}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">
                        Grant Category
                      </label>
                      <p className="text-gray-900" data-testid="text-grant-category">
                        {application.grantCategory}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Requested Funding Amount
                    </label>
                    <p className="text-gray-900 font-medium text-lg" data-testid="text-funding-amount">
                      {application.fundingAmount}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Project Description
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap" data-testid="text-project-description">
                        {application.projectDescription}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Technical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Technical Details
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap" data-testid="text-technical-details">
                        {application.technicalDetails}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Project Timeline
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap" data-testid="text-timeline">
                        {application.timeline}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Team Experience
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap" data-testid="text-team-experience">
                        {application.teamExperience}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.githubRepo && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Github className="h-4 w-4" />
                        GitHub Repository
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-blue-600 hover:text-blue-800" data-testid="text-github-repo">
                          {application.githubRepo}
                        </p>
                        <a 
                          href={application.githubRepo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          data-testid="link-github-repo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {application.additionalInfo && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">
                        Additional Information
                      </label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap" data-testid="text-additional-info">
                          {application.additionalInfo}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Submitted Date
                    </label>
                    <p className="text-gray-900" data-testid="text-submitted-date">
                      {formatDate(application.submittedAt.toString())}
                    </p>
                  </div>
                  
                  {application.lastAdminViewedAt && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">
                        Last Admin Review
                      </label>
                      <p className="text-gray-900" data-testid="text-last-viewed">
                        {formatDate(application.lastAdminViewedAt.toString())}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Chat Interface */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Application Chat
                      {chatMessages.length > 0 && (
                        <Badge variant="secondary" className="ml-2" data-testid="badge-message-count">
                          {chatMessages.length} message{chatMessages.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {isLoadingMessages && (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                        data-testid="button-toggle-chat"
                      >
                        {isChatExpanded ? "Collapse" : "Expand"}
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Chat Token: {application.publicChatToken}
                  </div>
                </CardHeader>
                
                {isChatExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    {/* Chat Messages Container */}
                    <div 
                      ref={chatContainerRef}
                      className="max-h-80 overflow-y-auto border rounded-lg bg-gray-50 p-4 space-y-3"
                      data-testid="container-chat-messages"
                    >
                      {isLoadingMessages ? (
                        <div className="flex items-center justify-center py-8">
                          <Clock className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                          <span className="text-gray-500">Loading messages...</span>
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm text-gray-500" data-testid="text-no-messages">
                            No messages yet. Start the conversation with the applicant.
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                            data-testid={`message-${message.senderRole}-${message.id}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                                message.senderRole === 'admin'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className={`text-xs font-medium ${
                                  message.senderRole === 'admin' ? 'text-blue-100' : 'text-gray-600'
                                }`}>
                                  {message.senderRole === 'admin' ? 'Admin' : 'Applicant'}
                                </span>
                                <span className={`text-xs ${
                                  message.senderRole === 'admin' ? 'text-blue-200' : 'text-gray-400'
                                }`}>
                                  {formatMessageTime(message.createdAt.toString())}
                                </span>
                              </div>
                              <p className={`text-sm whitespace-pre-wrap ${
                                message.senderRole === 'admin' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {message.body}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Composition Area */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <textarea
                          ref={messageInputRef}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Type your message to the applicant..."
                          className="flex-1 min-h-[80px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={sendMessageMutation.isPending}
                          maxLength={10000}
                          data-testid="input-message"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {messageText.length}/10,000 characters • Press Enter to send, Shift+Enter for new line
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || sendMessageMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700"
                          data-testid="button-send-message"
                        >
                          {sendMessageMutation.isPending ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Chat Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                          <p className="font-medium mb-1">Chat Instructions:</p>
                          <ul className="space-y-1 text-blue-700">
                            <li>• Messages update automatically every 5 seconds</li>
                            <li>• Applicants can respond using the chat token: <code className="bg-blue-100 px-1 rounded">{application.publicChatToken}</code></li>
                            <li>• First admin message will move application to pipeline status</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Status Change Confirmation Dialogs */}
      <AlertDialog open={showPipelineDialog} onOpenChange={setShowPipelineDialog}>
        <AlertDialogContent data-testid="dialog-confirm-pipeline">
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Pipeline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this application to the pipeline? 
              This will mark the application as under review and notify the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-pipeline">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMoveToPipeline}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-confirm-pipeline"
            >
              Move to Pipeline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent data-testid="dialog-confirm-reject">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this application? 
              This action will notify the applicant that their application was not approved.
              You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-reject">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-reject"
            >
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent data-testid="dialog-confirm-restore">
          <AlertDialogHeader>
            <AlertDialogTitle>Restore to Pipeline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this application to the pipeline? 
              This will move it back to active review status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-restore">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestore}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-confirm-restore"
            >
              Restore to Pipeline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}