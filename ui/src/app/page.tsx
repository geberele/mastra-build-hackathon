import styles from "./page.module.css";
import { Chatbot } from "@/components/Chatbot";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Chatbot />
      </main>
    </div>
  );
}
