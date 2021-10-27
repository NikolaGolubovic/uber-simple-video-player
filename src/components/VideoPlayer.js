import React, { useState, useRef, useEffect } from "react";

import clip1 from "../clips/clip1.mp4";
import clip2 from "../clips/clip2.mp4";
import clip3 from "../clips/clip3.mp4";
import clip4 from "../clips/clip4.mp4";

import { FaVolumeMute } from "react-icons/fa";
import { FaVolumeDown } from "react-icons/fa";
import { BsSpeedometer2 } from "react-icons/bs";
import { BiFullscreen } from "react-icons/bi";
import { FaVolumeUp } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { BsFullscreenExit } from "react-icons/bs";
import { IoPlaySkipForwardSharp } from "react-icons/io5";

const VideoPlayer = () => {
  const [volumeRange, setVolumeRange] = useState(0.5);
  const [mute, setMute] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [pausePos, setPausePos] = useState(false);
  const [optionsActive, setOptionsActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("00");
  const [fullScreen, setFullScreen] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const arrClips = [clip1, clip2, clip3, clip4];
  const [src, setSrc] = useState(arrClips[srcIndex]);
  const [previousSrc, setPreviousSrc] = useState(arrClips[srcIndex]);
  const arrSpeeds = ["0.5", "0.75", "1", "1.25", "1.5", "2"];
  const videoRef = useRef();

  useEffect(() => {
    if (previousSrc === src) {
      return;
    }

    if (videoRef.current) {
      videoRef.current.load();
    }

    setPreviousSrc(src);
  }, [src]);

  function togglePlay() {
    const video = videoRef.current;
    video.paused ? video.play() : video.pause();
    setPausePos(!pausePos);
  }

  function updateVolume(e) {
    const video = videoRef.current;
    video.volume = e.target.value;
    setVolumeRange(e.target.value);
    var value =
      ((e.target.value - e.target.min) / (e.target.max - e.target.min)) * 100;
    e.target.style.background =
      "linear-gradient(to right, white 0%, white " +
      value +
      "%, rgba(0, 0, 0, 0.2) " +
      value +
      "%, rgba(0, 0, 0, 0.2) 100%)";
  }

  function mutedVideo() {
    const video = videoRef.current;
    !mute ? (video.muted = true) : (video.muted = false);
    setMute(!mute);
  }

  function scrub(e) {
    const video = videoRef.current;
    console.log(e.currentTarget);
    const scrubTime =
      (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    setProgressPercent(scrubTime);
  }

  return (
    <div className={fullScreen ? "video-container full" : "video-container"}>
      <div className="player">
        <video
          className="viewer"
          ref={videoRef}
          onEnded={() => {
            setPausePos(true);
          }}
          onTimeUpdate={() => {
            const video = videoRef.current;
            const percent = (video.currentTime / video.duration) * 100;
            setProgressPercent(percent);
            const simpleSecFormula = Math.floor(
              video.currentTime - minutes * 60
            );
            let seconds =
              simpleSecFormula < 10
                ? "0" + simpleSecFormula
                : simpleSecFormula >= 60
                ? "0" + (simpleSecFormula - 60).toString()
                : simpleSecFormula.toString();
            setMinutes(Math.floor(video.currentTime / 60).toString());
            setSeconds(seconds);
          }}
          autoPlay
        >
          <source src={src} type="video/mp4" />
        </video>
        <div className="controlls">
          <div className="progress" onClick={scrub}>
            <div
              className="progress-filled"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="controller-left-half">
            <div className="player-button-container">
              <button className="player-button" onClick={togglePlay}>
                {pausePos ? <FaPlay /> : <FaPause />}
              </button>
            </div>
            <div className="next-video">
              <IoPlaySkipForwardSharp
                className="next-video-icon"
                onClick={() => {
                  console.log("hej");
                  let i = srcIndex + 1;
                  if (i >= arrClips.length) {
                    i = 0;
                  }
                  setSrc(arrClips[i]);
                  setSrcIndex(i);
                  setProgressPercent(0);
                }}
              />
            </div>
            <div className="video-volume-container">
              <div className="volume-icon" onClick={mutedVideo}>
                {mute || +volumeRange === 0 ? (
                  <FaVolumeMute />
                ) : volumeRange > 0 && volumeRange <= 0.7 ? (
                  <FaVolumeDown />
                ) : (
                  <FaVolumeUp />
                )}
              </div>
              <input
                type="range"
                id="myinput"
                name="volume"
                className="player-slider"
                min="0"
                max="1"
                step="0.05"
                value={volumeRange}
                onChange={(e) => updateVolume(e)}
              />
            </div>
            <div className="video-time">
              <p>
                <span>{minutes}</span> : <span>{seconds}</span>
              </p>
            </div>
          </div>
          <div className="controller-right-half">
            <div className="speed-settings">
              <BsSpeedometer2
                className="speedometar"
                onClick={() => setOptionsActive(!optionsActive)}
              />
              <div className="select">
                <div className={optionsActive ? "options active" : "options"}>
                  {arrSpeeds.map((speed, index) => {
                    return (
                      <div
                        data-value={speed}
                        onClick={(e) => {
                          videoRef.current.playbackRate =
                            e.target.dataset.value;
                          setSelectedIndex(index);
                          setOptionsActive(false);
                        }}
                        key={speed}
                        className={
                          index === selectedIndex ? "option active" : "option"
                        }
                      >
                        <FaCheck
                          className={
                            index === selectedIndex
                              ? "checkmark active"
                              : "checkmark"
                          }
                          onClick={(e) => e.stopPropagation()}
                        />{" "}
                        {speed}x
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="full-screen-container">
              {fullScreen ? (
                <BsFullscreenExit
                  className="full-screen-icon"
                  onClick={() => setFullScreen(!fullScreen)}
                />
              ) : (
                <BiFullscreen
                  className="full-screen-icon"
                  onClick={() => setFullScreen(!fullScreen)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
