import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertGrantCategorySchema, InsertGrantCategory } from "@shared/schema";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryFormModal({ 
  isOpen, 
  onClose,
}: CategoryFormModalProps) {
  const { toast } = useToast();

  const form = useForm<InsertGrantCategory>({
    resolver: zodResolver(insertGrantCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      description: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        icon: "",
        description: "",
      });
    }
  }, [isOpen, form]);

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertGrantCategory) => {
      const response = await apiRequest("POST", "/api/admin/grant-categories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "admin", "grant-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api", "grant-categories"] });
      toast({
        title: "Success",
        description: "Grant category created successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertGrantCategory) => {
    createCategoryMutation.mutate(data);
  };

  const isPending = createCategoryMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="title-category-form-modal">
            Create New Grant Category
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new grant category.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., DeFi Development"
                      {...field}
                      data-testid="input-category-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 🏦 or icon name"
                      {...field}
                      data-testid="input-category-icon"
                    />
                  </FormControl>
                  <div className="text-sm text-gray-500">
                    Can be an emoji or icon name that represents this category
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this grant category and what types of projects it covers..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-category-description"
                    />
                  </FormControl>
                  <div className="text-sm text-gray-500">
                    Optional description to help applicants understand this category
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                data-testid="button-cancel-category-form"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-submit-category-form"
              >
                {isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}