"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import { WebcamIterator } from "@tensorflow/tfjs-data/dist/iterators/webcam_iterator";
import * as styles from "./page.css";

const PREDICT_INTERVAL = 100;

enum Hand {
  Rock = "rock",
  Scissors = "scissors",
  Paper = "paper",
}

const HandList = [Hand.Rock, Hand.Scissors, Hand.Paper];

type Text = "" | "じゃんけん..." | "ぽん！";

// const MODEL = "https://teachablemachine.withgoogle.com/models/7l47J0nvwC/";
const MODEL = "https://teachablemachine.withgoogle.com/models/feCZWlpVt/";

const synchronizeHands: { self: Hand | undefined; ai: Hand | undefined } = {
  self: undefined,
  ai: undefined,
};

export default function Play() {
  const [model, setModel] = useState<tf.LayersModel>();
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [webcamIterator, setWebcamIterator] = useState<WebcamIterator>();
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState<Text>("");
  const [selfHand, setSelfHand] = useState<Hand>();
  const [AIHand, setAIHand] = useState<Hand>();
  const webcamRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function setupMediaStream() {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 224,
          height: 224,
        },
      });
      setMediaStream(ms);
    } catch (e) {
      alert("Camera is disabled");
      throw e;
    }
  }

  async function setupModel() {
    try {
      const loaded_model = await tf.loadLayersModel(MODEL + "model.json");
      setModel(loaded_model);
      console.log("model loaded");
    } catch (e) {
      alert("Model could not load");
      throw e;
    }
  }

  async function setupWebcamIterator() {
    try {
      if (webcamRef.current == null) return;
      setWebcamIterator(await tf.data.webcam(webcamRef.current));
      console.log("setup webcam iterator");
    } catch (e) {
      alert("Camera is disabled");
      throw e;
    }
  }

  // initialization (webcam)
  useEffect(() => {
    async function setupWebcamVideo() {
      if (!mediaStream) {
        await setupMediaStream();
      } else {
        const videoCurr = webcamRef.current;
        if (!videoCurr) return;
        const video = videoCurr;
        if (!video.srcObject) {
          video.srcObject = mediaStream;
        }
      }
    }
    setupWebcamVideo();
    setupMediaStream();
  }, [mediaStream]);

  // initialization (model)
  useEffect(() => {
    setupModel();
  }, []);

  // initialization (webcamIterator)
  useEffect(() => {
    setupWebcamIterator();
  }, []);

  useEffect(() => {
    if (isPredicting == false) return;

    const loop = async () => {
      const image = await webcamIterator?.capture();
      if (image == null) return;

      const prediction = (await model?.predict(
        image.expandDims(0).toFloat().div(255)
      )) as tf.Tensor;
      const probability = Array.from(await prediction.data());

      const selfHand = HandList[probability.indexOf(Math.max(...probability))];
      synchronizeHands.self = selfHand; // not good, but needed for useEffect
      setSelfHand(selfHand);
    };

    const timer = setInterval(loop, PREDICT_INTERVAL);
    return () => {
      clearInterval(timer);
    };
  }, [isPredicting]);

  const play = () => {
    const hands = { ...synchronizeHands };
    if (hands.self == undefined || hands.ai == undefined) return;
    if (hands.self == hands.ai) {
    } else if (
      (hands.self == Hand.Rock && hands.ai == Hand.Scissors) ||
      (hands.self == Hand.Scissors && hands.ai == Hand.Paper) ||
      (hands.self == Hand.Paper && hands.ai == Hand.Rock)
    ) {
      setWinCount((prev) => prev + 1);
    } else {
      setLoseCount((prev) => prev + 1);
    }
  };

  // game loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (audioRef.current !== null) {
        audioRef.current.play();
      }
      setTimeout(() => {
        setText("じゃんけん...");
      }, 100);
      setTimeout(() => {
        setText("ぽん！");
        const aiHand = HandList[Math.floor(Math.random() * 3)];
        synchronizeHands.ai = aiHand; // not good, but needed for useEffect
        setAIHand(aiHand);
      }, 1600);
      setTimeout(() => {
        play();
      }, 1700);
      setTimeout(() => {
        setText("");
        synchronizeHands.ai = undefined;
        setAIHand(undefined);
      }, 2500);
    }, 2500);

    return () => {
      clearInterval(timer);
      setWinCount(0);
      setLoseCount(0);
    };
  }, [isPlaying]);

  return (
    <>
      <div className={styles.playRoot}>
        <>
          <div className={styles.opponentContainer}>
            <div className={`${styles.stack} ${styles.handOptions}`}>
              <OptionHand name="paper_ai" />
              <OptionHand name="scissors_ai" />
              <OptionHand name="rock_ai" />
            </div>
            <div className={styles.stack}>
              <div className={styles.nameContainer}>
                <p className={styles.text}>AI</p>
              </div>
              <div className={styles.circle}>
                {AIHand && (
                  <Image
                    src={`/${AIHand}_ai.png`}
                    alt={AIHand}
                    height={224}
                    width={224}
                    className={styles.video}
                    priority={true}
                  />
                )}
              </div>
              <div className={styles.counterContainer}>
                <p className={styles.text}>{loseCount}勝</p>
              </div>
            </div>
          </div>
          <div className={styles.textContainer}>
            <audio ref={audioRef}>
              <source src="/play.wav" type="audio/wav" />
            </audio>
            <h2 className={styles.text}>{text}</h2>
          </div>
          <div className={styles.selfContainer}>
            <div className={styles.stack}>
              <div className={styles.nameContainer}>
                <p className={styles.text}>あなた</p>
              </div>
              <div
                className={styles.circle}
                onClick={() => setIsPredicting(!isPredicting)}
              >
                <video
                  ref={webcamRef}
                  height={224}
                  width={224}
                  className={styles.video}
                  autoPlay={true}
                  muted={true}
                  style={{ visibility: isPredicting ? "visible" : "hidden" }}
                ></video>
                {selfHand && (
                  <Image
                    src={`/${selfHand}.png`}
                    alt={selfHand}
                    height={224}
                    width={224}
                    className={styles.video}
                    priority={true}
                    style={{ visibility: isPredicting ? "hidden" : "visible" }}
                  />
                )}
              </div>
              <div className={styles.counterContainer}>
                <p className={styles.text}>{winCount}勝</p>
              </div>
            </div>
            <div className={`${styles.stack} ${styles.handOptions}`}>
              <OptionHand name="rock" highlight={selfHand == Hand.Rock} />
              <OptionHand
                name="scissors"
                highlight={selfHand == Hand.Scissors}
              />
              <OptionHand name="paper" highlight={selfHand == Hand.Paper} />
            </div>
          </div>
        </>
      </div>
      <div className={styles.buttonContainer}>
        {isPlaying ? (
          <button
            onClick={() => {
              setIsPlaying(false);
            }}
          >
            最初から
          </button>
        ) : (
          <button
            onClick={() => {
              setIsPlaying(true);
            }}
          >
            スタート
          </button>
        )}
        <Link href="/">
          <button>タイトルへ</button>
        </Link>
      </div>
    </>
  );
}

type OptionHandProps = {
  name: string;
  highlight?: boolean;
};

const OptionHand = ({ name, highlight }: OptionHandProps) => {
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
};
