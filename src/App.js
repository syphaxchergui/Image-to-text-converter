import React, { useState, useEffect } from "react";
import ImageUpload from "image-upload-react";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { createWorker } from "tesseract.js";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const App = () => {
  const [ocr, setOcr] = useState();
  const [imageSrc, setImageSrc] = useState("#");
  const [progress, setProgress] = useState();
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
      if (m.status === "recognizing text") {
        setProgress(m.progress);
      }
    },
  });
  const doOCR = async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageSrc);
    setOcr(text);
  };

  const handleImageSelect = (e) => {
    setImageSrc(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className='container'>
      <h2>Upload an image then click on GET TEXT</h2>
      <div className='image-uploader'>
        <ImageUpload
          handleImageSelect={handleImageSelect}
          setImageSrc={setImageSrc}
          style={{
            width: "100%",
            height: 100,
            background: "#1976D2",
          }}
        />
      </div>
      {imageSrc === "#" ? null : (
        <p>
          <b>Image URL : </b>
          {imageSrc.split("blob:")[1]}
        </p>
      )}
      <Stack spacing={2} direction='column'>
        <Button
          variant='contained'
          onClick={() => {
            if (imageSrc !== "#") {
              setOcr();
              doOCR();
            }
          }}>
          Get Text
        </Button>
        <Button
          variant='outlined'
          onClick={() => {
            setImageSrc("#");
            setOcr();
            setProgress();
          }}>
          Delete Image
        </Button>
      </Stack>
      {progress ? (
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <LinearProgress variant='determinate' value={progress * 100} />
        </Box>
      ) : null}

      <Stack spacing={1} direction='column'>
        <p>{ocr}</p>{" "}
        {progress == 1 ? (
          <Button
            variant='outlined'
            onClick={() => {
              navigator.clipboard.writeText(ocr);
            }}>
            Copy to clipboard
          </Button>
        ) : null}
      </Stack>
    </div>
  );
};

export default App;
