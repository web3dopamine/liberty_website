import { useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Cross } from "../assets/images";

const grantApplicationSchema = z.object({
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().optional(),
  grantCategory: z.string().min(1, "Please select a grant category"),
  projectTitle: z.string().min(3, "Project title must be at least 3 characters"),
  fundingAmount: z.string().min(1, "Please specify funding amount"),
  projectDescription: z.string().min(50, "Project description must be at least 50 characters"),
  technicalDetails: z.string().min(30, "Please provide technical details (minimum 30 characters)"),
  timeline: z.string().min(20, "Please provide a development timeline"),
  teamExperience: z.string().min(30, "Please describe your team's experience"),
  githubRepo: z.string().url("Please enter a valid GitHub URL").optional().or(z.literal("")),
  additionalInfo: z.string().optional(),
});

const GrantApplicationModal = ({ ref }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(grantApplicationSchema),
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        showModal() {
          setIsOpen(true);
          setSubmitSuccess(false);
        },
      };
    },
    []
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/grant-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }

      const result = await response.json();
      console.log("Application submitted successfully:", result);
      
      setSubmitSuccess(true);
      reset();
      
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const grantCategories = [
    { value: "defi", label: "DeFi Protocol Development ($50K - $200K)" },
    { value: "infrastructure", label: "Node Infrastructure ($25K - $100K)" },
    { value: "developer-tools", label: "Developer Tooling & SDKs ($20K - $75K)" },
    { value: "community", label: "Community Growth ($10K - $50K)" },
    { value: "bridge", label: "Bridge & Interoperability ($100K - $300K)" },
    { value: "trading-tools", label: "Institutional Trading Tools ($75K - $250K)" },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`relative bg-gradient-to-b from-[#082A2D] to-[#000000] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute cursor-pointer top-0 right-0 p-6 z-10" onClick={() => setIsOpen(false)}>
          <img src={Cross} alt="Close" />
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-white">Grant Application Form</h2>
            <p className="text-[#99A1AF] mt-2">Submit your project for Bitcoin Liberty ecosystem funding</p>
          </div>

          {submitSuccess ? (
            <div className="bg-[#2D5F5D]/20 border border-[#4A9390]/40 rounded-2xl p-8 text-center">
              <div className="text-[#4A9390] text-5xl mb-4">✓</div>
              <h3 className="text-2xl text-white font-semibold mb-2">Application Submitted!</h3>
              <p className="text-[#99A1AF]">
                Your grant application has been submitted successfully. We'll review it within 2 weeks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Applicant Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#99A1AF] text-sm mb-2">Full Name *</label>
                    <input
                      {...register("applicantName")}
                      placeholder="Your full name"
                      className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50"
                    />
                    {errors.applicantName && (
                      <p className="text-[#FF8904] text-sm mt-1">{errors.applicantName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#99A1AF] text-sm mb-2">Email Address *</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50"
                    />
                    {errors.email && <p className="text-[#FF8904] text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">Organization / Company (Optional)</label>
                  <input
                    {...register("organization")}
                    placeholder="Your organization name"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Project Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#99A1AF] text-sm mb-2">Grant Category *</label>
                    <select
                      {...register("grantCategory")}
                      className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4A9390]/50"
                    >
                      <option value="">Select grant category</option>
                      {grantCategories.map((category) => (
                        <option key={category.value} value={category.value} className="bg-[#082A2D]">
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.grantCategory && (
                      <p className="text-[#FF8904] text-sm mt-1">{errors.grantCategory.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#99A1AF] text-sm mb-2">Requested Funding Amount *</label>
                    <input
                      {...register("fundingAmount")}
                      placeholder="e.g., $75,000"
                      className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50"
                    />
                    {errors.fundingAmount && (
                      <p className="text-[#FF8904] text-sm mt-1">{errors.fundingAmount.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">Project Title *</label>
                  <input
                    {...register("projectTitle")}
                    placeholder="Name of your project"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50"
                  />
                  {errors.projectTitle && (
                    <p className="text-[#FF8904] text-sm mt-1">{errors.projectTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">
                    Project Description * (minimum 50 characters)
                  </label>
                  <textarea
                    {...register("projectDescription")}
                    placeholder="Describe your project, its goals, and how it benefits the Bitcoin Liberty ecosystem..."
                    rows="4"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50 resize-none"
                  />
                  {errors.projectDescription && (
                    <p className="text-[#FF8904] text-sm mt-1">{errors.projectDescription.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Technical Details</h3>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">Technical Implementation *</label>
                  <textarea
                    {...register("technicalDetails")}
                    placeholder="Describe the technical approach, architecture, technologies used, security considerations..."
                    rows="4"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50 resize-none"
                  />
                  {errors.technicalDetails && (
                    <p className="text-[#FF8904] text-sm mt-1">{errors.technicalDetails.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">Development Timeline *</label>
                  <textarea
                    {...register("timeline")}
                    placeholder="Provide a timeline with key milestones and deliverables..."
                    rows="3"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50 resize-none"
                  />
                  {errors.timeline && <p className="text-[#FF8904] text-sm mt-1">{errors.timeline.message}</p>}
                </div>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">Team Experience *</label>
                  <textarea
                    {...register("teamExperience")}
                    placeholder="Describe your team's relevant experience, previous projects, credentials..."
                    rows="3"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50 resize-none"
                  />
                  {errors.teamExperience && (
                    <p className="text-[#FF8904] text-sm mt-1">{errors.teamExperience.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Additional Information</h3>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">GitHub Repository (Optional)</label>
                  <input
                    {...register("githubRepo")}
                    placeholder="https://github.com/username/project"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50"
                  />
                  {errors.githubRepo && <p className="text-[#FF8904] text-sm mt-1">{errors.githubRepo.message}</p>}
                </div>

                <div>
                  <label className="block text-[#99A1AF] text-sm mb-2">Additional Information (Optional)</label>
                  <textarea
                    {...register("additionalInfo")}
                    placeholder="Any additional information that would help us evaluate your application..."
                    rows="3"
                    className="w-full bg-[#FFFFFF]/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A9390]/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-[#FFFFFF]/5 border border-white/5 rounded-2xl text-white hover:bg-[#FFFFFF]/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white text-black rounded-2xl font-medium hover:bg-[#dbf1f3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantApplicationModal;
