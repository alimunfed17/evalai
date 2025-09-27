"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { parseResume } from "@/lib/parseResume";

// ----------------------
// Validation Schema
// ----------------------
const formSchema = z.object({
  resume: z
    .custom<FileList>(
      (val) => val instanceof FileList && val.length > 0,
      { message: "Resume / CV is required" }
    )
    .refine(
      (files) =>
        files &&
        files.length > 0 &&
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(files[0].type),
      { message: "Only PDF or DOCX files are allowed" }
    ),
});

type ResumeFormValues = z.infer<typeof formSchema>;

// ----------------------
// Component
// ----------------------
export default function ResumeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: undefined,
    },
  });

  const onSubmit = async (data: ResumeFormValues) => {
    const file = data.resume[0];
    setLoading(true);
    setError(null);
    setResumeText(null);

    try {
      const text = await parseResume(file);
      setResumeText(text);
    } catch (err) {
      console.error("Resume parsing error:", err);
      setError("Failed to parse resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center gap-10 bg-gray-50 p-6">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Upload Your Resume
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Resume / CV
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => field.onChange(e.target.files)}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-gray-500">
                      Upload a PDF or DOCX file only.
                    </FormDescription>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-lg py-5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* {resumeText && (
        <div className="mt-6 w-full max-w-2xl bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Extracted Resume Text</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
            {resumeText}
          </pre>
        </div>
      )} */}
    </div>
  );
}
