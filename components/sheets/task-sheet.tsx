"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Task, TaskSchema } from "@/types/task";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

type TaskFormValues = z.infer<typeof TaskSchema>;

interface TaskSheetProps {
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: TaskFormValues) => void;
  open: boolean;
  initialData?: Partial<TaskFormValues>;
}

export function TaskSheet({ open, onOpenChange, onFormSubmit, initialData }: TaskSheetProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "pending",
      priority: initialData?.priority || "medium",
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      taskType: initialData?.taskType || "administrative",
      location: initialData?.location || "",
    },
  });

  const { handleSubmit, control, formState: { isSubmitting }, reset } = form;

  const onSubmitHandler: SubmitHandler<TaskFormValues> = (data) => {
    onFormSubmit(data);
  };

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : undefined,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: undefined,
        taskType: "administrative",
        location: "",
      });
    }
  }, [initialData, reset]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0 bg-gray-900 text-gray-100 overflow-auto">
        <SheetHeader className="p-6 border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
          <SheetTitle className="text-xl font-semibold text-white">
            {initialData ? "Edit Task" : "Create New Task"}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            {initialData ? "Update the details of the existing task." : "Fill in the details to create a new task."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col">
            <div className="p-6 space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Prepare monthly report"
                            {...field}
                            className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add a detailed description..."
                            {...field}
                            className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 min-h-24"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[60] bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="pending" className="focus:bg-gray-700">Pending</SelectItem>
                              <SelectItem value="in-progress" className="focus:bg-gray-700">In Progress</SelectItem>
                              <SelectItem value="under-review" className="focus:bg-gray-700">Under Review</SelectItem>
                              <SelectItem value="completed" className="focus:bg-gray-700">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[60] bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="low" className="focus:bg-gray-700">Low</SelectItem>
                              <SelectItem value="medium" className="focus:bg-gray-700">Medium</SelectItem>
                              <SelectItem value="high" className="focus:bg-gray-700">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-200">Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 hover:bg-gray-600",
                                  !field.value && "text-gray-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[60] bg-gray-800 border-gray-700" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                              className="bg-gray-800 text-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Assignment & Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="taskType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Task Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select task type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[60] bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="administrative" className="focus:bg-gray-700">Administrative</SelectItem>
                            <SelectItem value="clinical" className="focus:bg-gray-700">Clinical</SelectItem>
                            <SelectItem value="billing" className="focus:bg-gray-700">Billing</SelectItem>
                            <SelectItem value="maintenance" className="focus:bg-gray-700">Maintenance</SelectItem>
                            <SelectItem value="reporting" className="focus:bg-gray-700">Reporting</SelectItem>
                            <SelectItem value="other" className="focus:bg-gray-700">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Location (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Ward B, Room 201"
                            {...field}
                            className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <SheetFooter className="p-6 bg-gray-900 border-t border-gray-700 sticky bottom-0 z-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-transparent hover:bg-gray-700 border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {initialData ? "Save Changes" : "Create Task"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
