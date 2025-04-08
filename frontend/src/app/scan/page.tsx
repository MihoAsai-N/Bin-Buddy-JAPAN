"use client"

import { Navigation } from "../components/navigation"
import { useLanguage } from "../contexts/language-context"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect, useCallback } from "react"
import { useTrash, type TrashType } from "../contexts/trash-context"

export default function ScanPage() {
  const { t: originalT, language } = useLanguage();
  const t = useCallback((key: string) => originalT(key), [originalT]);
  const router = useRouter()
  const { setTrashResult } = useTrash()

  const [isCameraPreviewActive, setIsCameraPreviewActive] = useState(false) // カメラプレビューの状態
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false) // API分析の状態
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  interface ClassifyResponse {
    predictions: { [key: string]: number };
    best_match: string | null;
  }

  let stream: MediaStream | null = null;
  const startCamera = async () => {

    try {
      console.log("42");//TODO:最後消す
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      console.log("44");//TODO:最後消す
      if (videoRef.current) {
        console.log("カメラストリームを取得しました", stream);
        videoRef.current.srcObject = stream;
        
      }
    } catch (err) {
      console.log("カメラの起動に失敗しました:", err);
      setError(t("scan.error.camera_failed"));
    }
  };
  useEffect(() => {  

    console.log("useEffect実行 - カメラ状態:", isCameraPreviewActive);
    
    if (isCameraPreviewActive) {
      console.log("カメラを起動します");
      startCamera();
    } else if (stream) {
      // カメラを停止
      console.log("カメラを停止します");
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }

    // クリーンアップ関数
    return () => {
      if (stream) {
        console.log("コンポーネントアンマウント - カメラを停止します");
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraPreviewActive, language, t]);

  const handleCancel = () => {
    router.push("/calendar")
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && !isAnalyzing) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        setIsCameraPreviewActive(false)
        
        // カメラを明示的に停止
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }
      }
    }
  }

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

          const response = await fetch("/api/classify", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("画像分析APIエラー:", errorData);
            setError(t("scan.error.analyze"));
          } else {
            const data: ClassifyResponse = await response.json();
            setTrashResult(data.best_match as TrashType || "unknown");
            router.push("/result");
          }
        };
        img.onerror = (error) => {
          console.error("画像のロードに失敗しました:", error);
          setError(t("scan.error.image_load_failed"));
          setIsAnalyzing(false); // ここを修正: setIsProcessing -> setIsAnalyzing
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
        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        {!isCameraPreviewActive && !capturedImage && (
          <>
            <div className="text-center mb-8">{t("scan.take.photo")}</div>

            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <div
                  className="w-24 h-24 border-4 border-red-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    console.log("カメラを起動します");
                    setIsCameraPreviewActive(true);
                  }}
                >
                  <div className="w-20 h-20 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="mt-8" onClick={handleCancel}>
              {t("scan.cancel")}
            </Button>
          </>
        )}

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

            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={captureImage}>
              {t("scan.take.picture")}
            </Button>

            <Button variant="outline" onClick={handleCancel}>
              {t("scan.cancel")}
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
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? t("scan.processing") : t("scan.analyze")}
              </Button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="text-xs text-gray-500 text-center mt-auto">{t("common.copyright")}</div>
      </div>
    </div>
  )
}