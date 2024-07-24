"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Image from "next/image";
import { FileCardActions } from "@/app/dashboard/files/components/FileCard/FileCardActions";

type FileCardProps = {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
};

export function FileCard({ file, favorites }: FileCardProps) {
  const typesIcons = {
    image: <ImageIcon />,
    application: <FileTextIcon />,
    text: <GanttChartIcon />,
  } as unknown as Record<Doc<"files">["type"], ReactNode>;

  const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });

  const isFavorite = favorites.some((favorite) => favorite.fileId === file._id);

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2">
          <div className="flex justify-center">{typesIcons[file.type]}</div>
          {file.name}
        </CardTitle>

        <div className="absolute top-2 right-2">
          <FileCardActions file={file} isFavorited={isFavorite} />
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
