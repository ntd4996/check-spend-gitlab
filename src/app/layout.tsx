import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitLab Time Spent",
  description: "Track your time spent on GitLab issues",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${inter.className} min-h-screen`}
        suppressHydrationWarning
      >
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e] to-[#29293f]">
            {/* Waves container */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Top waves */}
              <div className="absolute top-0 left-0 right-0 h-[600px]">
                <div 
                  className="absolute top-[5%] -left-[10%] w-[70%] h-[300px] 
                  bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-transparent 
                  rounded-full blur-[60px] animate-wave-slow"
                />
                <div 
                  className="absolute top-[15%] right-[10%] w-[60%] h-[300px] 
                  bg-gradient-to-l from-blue-500/30 via-cyan-500/30 to-transparent 
                  rounded-full blur-[60px] animate-wave-slower"
                />
              </div>

              {/* Bottom waves */}
              <div className="absolute bottom-0 left-0 right-0 h-[600px]">
                <div 
                  className="absolute bottom-[10%] -left-[5%] w-[65%] h-[300px] 
                  bg-gradient-to-r from-blue-600/40 via-blue-500/40 to-transparent 
                  rounded-full blur-[60px] animate-wave-slow"
                />
                <div 
                  className="absolute bottom-[20%] right-[5%] w-[65%] h-[300px] 
                  bg-gradient-to-l from-cyan-500/40 via-blue-500/40 to-transparent 
                  rounded-full blur-[60px] animate-wave-slower"
                />
                <div 
                  className="absolute bottom-[5%] left-[10%] w-[80%] h-[300px] 
                  bg-gradient-to-r from-blue-600/30 via-cyan-500/30 to-blue-500/30 
                  rounded-full blur-[60px] animate-wave-slowest"
                />
              </div>

              {/* Floating elements */}
              <div 
                className="absolute bottom-[30%] left-[20%] w-[200px] h-[200px] 
                bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                rounded-full blur-[40px] animate-float"
              />
              <div 
                className="absolute top-[40%] right-[25%] w-[150px] h-[150px] 
                bg-gradient-to-r from-purple-500/20 to-indigo-500/20 
                rounded-full blur-[40px] animate-float [animation-delay:-4s]"
              />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/60 via-transparent to-[#29293f]/60" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen text-white">
          <nav className="fixed h-screen w-16 bg-dark-800/50 backdrop-blur-sm flex flex-col items-center py-4 space-y-4 border-r border-white/10 animate-slide-in-left">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-dark-700/50 rounded-lg transition-all hover:scale-110 active:scale-95 hover:text-primary-400 animate-fade-in [animation-delay:200ms]"
              aria-label="Dashboard"
            >
              <ChartBarIcon className="w-6 h-6" />
            </Link>
            <Link
              href="/settings"
              className="p-2 hover:bg-dark-700/50 rounded-lg transition-all hover:scale-110 active:scale-95 hover:text-primary-400 animate-fade-in [animation-delay:400ms]"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </Link>
          </nav>
          <main className="flex-1 ml-16 p-8 animate-fade-in">{children}</main>
        </div>
      </body>
    </html>
  );
}
