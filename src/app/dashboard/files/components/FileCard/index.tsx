"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

type FileCardProps = {
  file: Doc<"files">;
};

function FileCardActions({ file }: FileCardProps) {
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const deleteFile = useMutation(api.files.deleteFile);

  function handleDelete() {
    deleteFile({ fileId: file._id });
    setIsAlertOpen(false);

    toast({
      title: "File deleted",
      description: "Your file has been deleted",
      variant: "success",
    });
  }
  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setIsAlertOpen(true)}
            className="flex gap-1 text-red-500 cursor-pointer items-center"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function FileCard({ file }: FileCardProps) {
  const typesIcons = {
    image: <ImageIcon />,
    application: <FileTextIcon />,
    text: <GanttChartIcon />,
  } as unknown as Record<Doc<"files">["type"], ReactNode>;

  const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2">
          <div className="flex justify-center">{typesIcons[file.type]}</div>
          {file.name}
        </CardTitle>

        <div className="absolute top-2 right-2">
          <FileCardActions file={file} />
        </div>
      </CardHeader>

      <CardContent className="h-[200px] flex justify-center items-center">
        {file && file.type === "image" && (
          <Image
            src={fileUrl as string}
            alt="File"
            width="200"
            height="100"
            className="w-full h-full object-cover"
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button onClick={() => window.open(fileUrl, "_blank")}>Download</Button>
      </CardFooter>
    </Card>
  );
}
