"use client";

import { useMutation, useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { api } from "@/../convex/_generated/api";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});

export function UploadButton() {
  const [isFiledDialogOpen, setIsFiledDialogOpen] = useState(false);
  const organization = useOrganization();
  const user = useUser();
  const { toast } = useToast();

  let orgId: string | undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }


  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: "",
      file: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": values.file[0].type,
        },
        body: values.file[0],
      });

      const { storageId } = await result.json();

      if (!orgId) return;
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId: orgId,
      });

      form.reset();
      setIsFiledDialogOpen(false);

      toast({
        variant: "success",
        title: "File uploaded",
        description: "Your file has been uploaded",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your file has not been uploaded, please try again",
      });
    }
  }
  return (
    <Dialog
      open={isFiledDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFiledDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Upload your file here</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange }, ...field }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-1"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
