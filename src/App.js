import React, { useEffect, useRef, useState } from "react";
import ml5 from "ml5";
import useInterval from "@use-it/interval";
let classifier;

const Model = () => {
  const videoRef = useRef();
  const [start, setStart] = useState(true);
  const [result, setResult] = useState([]);
  const [dataResult, setDataResult] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    classifier = ml5.imageClassifier("./model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setLoaded(true);
        });
    });
  }, []);

  useInterval(() => {
    if (classifier && start) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        setResult(results);
        setDataResult([result[0]]);
        console.log([result[0]]);
      });
    }
  }, 500);

  const toggle = () => {
    setStart(!start);
    setResult([]);
  };
  return (
    <div className="container">
      <div className="upper">
        <div className="capture">
          <video
            ref={videoRef}
            style={{ transform: "scale(-1, 1)" }}
            width="100%"
          />
          {loaded && (
            <button onClick={() => toggle()}>{start ? "Stop" : "Start"}</button>
          )}
        </div>
      </div>
      <p>
        {dataResult?.map((result, label) => {
          if (result?.confidence >= 0.95) {
            return (
              <div key="label">
                <p>{result?.label}</p> <p>{result?.confidence}</p>
              </div>
            );
          }
        })}
      </p>
    </div>
  );
};

export default Model;
