import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

const RefComponent = forwardRef(
  (props, ref: ForwardedRef<HTMLInputElement> | undefined) => {
    return <input {...props} ref={ref} />;
  },
);
function VideoPlayer({ src, isPlaying }: { src: string; isPlaying: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
    // Cleanup
    return () => {
      ref.current?.pause();
    };
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function Stopwatch() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const domRef = useRef(null);

  function handleStart() {
    if (timer.current) {
      return;
    }
    if (!startTime) {
      setStartTime(Date.now());
    }
    setNow(Date.now());

    timer.current = window.setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    timer.current && window.clearInterval(timer.current);
    timer.current = null;
  }

  function handleReset() {
    handleStop();
    setStartTime(null);
    setNow(null);
  }

  function handleRef() {
    console.log(domRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  function handleInputClick() {
    inputRef.current?.focus();
  }
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <h1 ref={domRef}>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>Start</button>
      <br />
      <button onClick={handleStop}>Stop</button>
      <br />
      <button onClick={handleReset}>Reset</button>
      <br />
      <button onClick={handleRef}>Ref</button>
      <br />
      <RefComponent ref={inputRef} />
      <button onClick={handleInputClick}>Focus the input</button>
      <div>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <VideoPlayer
          isPlaying={isPlaying}
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        />
      </div>
    </>
  );
}
