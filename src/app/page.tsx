"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Typography, Box } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          className="w-full flex justify-center"
        >
          List:
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/attendee-list")}
        >
          Go to Attendee List
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/event-listing")}
        >
          Go to Event Listing
        </Button>
      </main>
    </div>
  );
}
