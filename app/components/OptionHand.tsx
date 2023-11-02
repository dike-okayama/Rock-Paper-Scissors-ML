import Image from "next/image";
import * as styles from "../page.css";

export type OptionHandProps = {
  name: string;
  highlight?: boolean;
};

export default function OptionHand({ name, highlight }: OptionHandProps) {
  return (
    <Image
      src={`/${name}.png`}
      alt={name}
      height={100}
      width={100}
      className={`${styles.optionHand} ${highlight ? styles.highlight : ""}`}
      priority={true}
    />
  );
}
