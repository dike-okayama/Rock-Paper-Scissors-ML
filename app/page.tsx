import Link from "next/link";

import * as styles from "./page.css";

export default function Home() {
  return (
    <main className={styles.homeRoot}>
      <h1 className={styles.title}>AIじゃんけん</h1>
      <div className={styles.buttonContainer}>
        <Link href="/play">
          <button>スタート</button>
        </Link>
        <Link href="/about">
          <button>あそびかた</button>
        </Link>
      </div>
    </main>
  );
}
