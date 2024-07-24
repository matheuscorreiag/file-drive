import Image from "next/image";
import { UploadButton } from "@/app/dashboard/files/components/UploadButton";

export function Placeholder() {
  return (
    <div className="flex flex-col gap-4 w-full items-center mt-12">
      <Image
        alt="A image of a picture and a directory of files"
        width={300}
        height={300}
        src="/empty.svg"
      />
      <div className="text-2xl"> You have no files, upload one now!</div>
      <UploadButton />
    </div>
  );
}
