"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../contexts/language-context";
import { useTrash } from "../contexts/trash-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const RegionForm: React.FC = () => {
  const [postalCode, setPostalCode] = useState("");
  const [areaCandidates, setAreaCandidates] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();
  const { setRegion } = useTrash();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/area_search/areas?postal_code=${postalCode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch area candidates");
      }
      const data = await response.json();
      setAreaCandidates(data.areas);
    } catch (error: any) {
      console.error("Error fetching area candidates:", error);
      setError(error.message || t("scan.error.unknown")); // エラーメッセージを表示
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaSelect = () => {
    if (selectedArea) {
      setRegion(selectedArea);
      router.push("/calendar");
    } else {
      setError(t("scan.error.area_select")); //エリアを選択してくださいのエラーメッセージ
    }
  };

  return (
    <div className="-mt-32">
      <Card className="w-full p-6 h-full">
        <CardHeader className="px-6">
          <CardTitle>{t("nav.region.settings")}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form className="space-y-4" onSubmit={handleSearch}>
            <div>
              <Label htmlFor="postalCode">{t("main.postalCode")}</Label>
              <input
                type="text"
                id="postalCode"
                placeholder={t("main.postalCodeExample")}
                className="w-full p-2 border rounded-md bg-white"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                className="bg-[#8ebac1] hover:bg-[#789ea3] text-white px-8"
                disabled={isLoading} //ローディング中はボタンを無効にする
              >
                {isLoading ? t("scan.loading") : t("main.search")}
              </Button>
            </div>
          </form>

          {error && <p className="text-red-500">{error}</p>} {/* エラーメッセージを表示 */}

          {areaCandidates.length > 0 && (
            <div>
              <Label htmlFor="area">{t("main.area")}</Label>
              <Select onValueChange={setSelectedArea} value={selectedArea}>
                <SelectTrigger id="area">
                  <SelectValue placeholder={t("main.area")} />
                </SelectTrigger>
                <SelectContent>
                  {areaCandidates.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="pt-4 flex justify-center">
                <Button
                  onClick={handleAreaSelect}
                  className="bg-[#8ebac1] hover:bg-[#789ea3] text-white px-8"
                >
                  {t("main.select")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionForm;