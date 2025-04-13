"use client"

import { Navigation } from "../components/navigation"
import { useLanguage } from "../contexts/language-context"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"
import React, { useState, useRef, useEffect, useCallback } from "react"
import { useTrash, type TrashType } from "../contexts/trash-context"
import { useVision } from "../contexts/vision-context";
import { StopScan } from "../components/StopScan"
import { Camera } from "react-icons/fi";
import { RiCameraLensAiLine } from "react-icons/ri";
import { RiCameraLensFill } from "react-icons/ri";

export default function ScanPage() {
  const { t: originalT, language } = useLanguage();
  const t = useCallback((key: string) => originalT(key), [originalT]);
  const router = useRouter();
  const { setTrashResult } = useTrash();
  const { setVisionData } = useVision();

  const [isCameraPreviewActive, setIsCameraPreviewActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // useRef でストリームを管理

  interface ClassifyResponse {
    predictions: { [key: string]: number };
    best_match: string | null;
  }

  const startCamera = async () => { // useEffect の外で定義
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    } catch (err) {
      setError(t("scan.error.camera_failed"));
    }
  };

  useEffect(() => {
    setIsCameraPreviewActive(true);
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [language, t]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && !isAnalyzing) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        setIsCameraPreviewActive(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          videoRef.current.srcObject = null; //videoRef.current.srcObjectもnullにする。
        }
      }
    }
  };

  const retakeImage = () => {
    setCapturedImage(null)
    setIsCameraPreviewActive(true)
    setError(null);
  }

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    setError(null);

    if (capturedImage) {
      try {
        const img = new Image();
        img.onload = async () => {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          const resizeCanvas = document.createElement('canvas');
          resizeCanvas.width = width;
          resizeCanvas.height = height;
          const resizeCtx = resizeCanvas.getContext('2d');
          resizeCtx?.drawImage(img, 0, 0, width, height);

          const resizedImageDataUrl = resizeCanvas.toDataURL('image/jpeg', 0.8);

          const byteString = atob(resizedImageDataUrl.split(',')[1]);
          const mimeString = resizedImageDataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          const formData = new FormData();
          formData.append("image_file", blob, "resized_image.jpg");

          const response = await fetch("http://localhost:8000/api/classify", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("画像分析APIエラー:", errorData);
            setError(t("scan.error.analyze"));
          } else {
            // const data: ClassifyResponse = await response.json();
            // setTrashResult(data.best_match as TrashType || "unknown");
            // router.push("/result");
            const data: ClassifyResponse = await response.json();
            setTrashResult(data.best_match as TrashType || "unknown");
            setVisionData(data); // Ensure the type matches the updated definition
            router.push("/calendar");
          }
        };
        img.onerror = (error) => {
          console.error("画像のロードに失敗しました:", error);
          setError(t("scan.error.image_load_failed"));
          setIsAnalyzing(false);
        };
        img.src = capturedImage;
      } catch (error) {
        console.error("画像送信エラー:", error);
        setError(t("scan.error.network"));
        setIsAnalyzing(false);
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setError(t("scan.error.no_image"));
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {isCameraPreviewActive && (
          <>
            <div className="relative w-full max-w-sm">
              <video
                key={`video-${Date.now()}`}
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border-2 border-gray-300"
              />
            </div>

            {/* <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20" onClick={captureImage}>
              {t("scan.take.picture")}
            </Button> */}
            <Button
  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-19 h-19 flex items-center justify-center"
  onClick={captureImage}
>
  <RiCameraLensFill   className="w-8 h-12" />
</Button>
          </>
        )}

        {capturedImage && (
          <>
            <div className="relative w-full max-w-sm">
              <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full rounded-lg" />
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={retakeImage}>
                {t("scan.retake")}
              </Button>

              <Button
                className="bg-gray-500 hover:bg-gray-700 text-white"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? t("scan.processing") : t("scan.analyze")}
              </Button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="text-xs text-[#2d3748] text-center mt-auto">{t("common.copyright")}</div>
      </div>

<StopScan/>
    </div>
  );
}