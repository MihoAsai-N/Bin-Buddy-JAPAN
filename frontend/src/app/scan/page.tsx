"use client"

import { Navigation } from "../components/navigation"
import { useLanguage } from "../contexts/language-context"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useTrash, type TrashType } from "../contexts/trash-context"

export default function ScanPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { setTrashResult } = useTrash()

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // カメラを起動する
  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("カメラの起動に失敗しました:", err)
      }
    }

    if (isCameraActive) {
      startCamera()
    }

    // クリーンアップ関数
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isCameraActive])

  const handleCancel = () => {
    router.push("/calendar")
  }

  // 写真を撮影する
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        setIsCameraActive(false)
      }
    }
  }

  // 撮り直す
  const retakeImage = () => {
    setCapturedImage(null)
    setIsCameraActive(true)
  }

  // ゴミを分析する
  const analyzeImage = () => {
    setIsProcessing(true)

    // 実際のアプリでは画像認識APIを呼び出す
    // ここではモックデータを使用
    setTimeout(() => {
      // ランダムにゴミの種類を選択（デモ用）
      const trashTypes: TrashType[] = ["burnable", "non-burnable", "recyclable", "hazardous"]
      const randomType = trashTypes[Math.floor(Math.random() * trashTypes.length)]

      setTrashResult(randomType)
      router.push("/result")
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
        {!isCameraActive && !capturedImage && (
          <>
            <div className="text-center mb-8">{t("scan.take.photo")}</div>

            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <div
                  className="w-24 h-24 border-4 border-red-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setIsCameraActive(true)}
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

        {isCameraActive && (
          <>
            <div className="relative w-full max-w-sm">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />

              <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none"></div>
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
                disabled={isProcessing}
              >
                {isProcessing ? t("scan.processing") : t("scan.analyze")}
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

