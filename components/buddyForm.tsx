"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants";
import { Textarea } from "./ui/textarea";
import { createBuddy } from "@/lib/actions/buddy.actions";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Buddy is Required" }).max(1000),
  subject: z.string().min(1, { message: "Subject is Required" }).max(1000),
  topic: z.string().min(1, { message: "Topic is Required" }).max(1000),
  voice: z.string().min(1, { message: "Voice is Required" }).max(1000),
  style: z.string().min(1, { message: "Buddy is Required" }).max(1000),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration is Required" })
    .max(1000),
});

const BuddyForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 10,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const buddy = await createBuddy(values);

    if (buddy) {
      redirect(`/buddies/${buddy.id}`);
    } else {
      console.log("Failed to create a buddy");
      redirect("/");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="buddy-form-split">
          {/* Left Section - Basic Information */}
          <div className="buddy-form-left">
            <div className="buddy-form-section">
              <h3 className="buddy-form-section-header">Basic Information</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buddy Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Input Buddy Name"
                          {...field}
                          className="input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="input capitalize">
                            <SelectValue placeholder="Pick the Subject" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {subjects.map((subject) => (
                              <SelectItem
                                value={subject}
                                key={subject}
                                className="capitalize"
                              >
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What the buddy can help you with?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Input the Topic (Ex. Algorithm, Deviation ...)"
                          {...field}
                          className="input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Advanced Settings */}
          <div className="buddy-form-right">
            <div className="buddy-form-section">
              <h3 className="buddy-form-section-header">Advanced Settings</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="voice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="input">
                            <SelectValue placeholder="Pick the Voice" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="input">
                            <SelectValue placeholder="Pick the Style" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="informal">Informal/Casual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Minutes of Session</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Input the Duration in Minutes (Ex. 15 or 30)"
                          {...field}
                          className="input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="buddy-form-actions">
          <button type="submit" className="cursor-pointer btn-primary">
            Done, Submit
          </button>
        </div>
      </form>
    </Form>
  );
};

export default BuddyForm;