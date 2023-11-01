"use client";

import { useEffect, useState, useRef } from "react";

type Text = "" | "じゃんけん..." | "ぽん！";

export const OnePlay = () => {
  const [text, setText] = useState<Text>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current !== null) {
      audioRef.current.play();
    }

    const timer = setTimeout(() => {
      setText("じゃんけん...");
    }, 100);
    const timer2 = setTimeout(() => {
      setText("ぽん！");
    }, 1600);
    const timer3 = setTimeout(() => {
      setText("");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef}>
        <source src="/play.wav" type="audio/wav" />
      </audio>
      {text}
    </>
  );
};
