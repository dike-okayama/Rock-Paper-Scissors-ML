import type { Metadata } from "next";
import { Inter } from "next/font/google";
import * as styles from "./layout.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIじゃんけん",
  description: "画像認識と手先予測によるじゃんけん",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.gameWindowRoot}>
          <div className={styles.gameWindow}>{children}</div>
        </div>
      </body>
    </html>
  );
}
