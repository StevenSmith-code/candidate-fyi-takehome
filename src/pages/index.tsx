import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { InterviewScheduler } from "@/pages/_components/InterviewScheduler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Candidate Fyi Assessment</title>
        <meta name="description" content="Candidate Fyi Assessment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable} w-screen h-screen
       border-2 border-black rounded-md flex justify-between items-center mx-auto p-4 bg-gradient-to-br from-purple-400/75 via-blue-400/75 to-yellow-600/75`}>
        <InterviewScheduler />
      </div>
    </>
  );
}