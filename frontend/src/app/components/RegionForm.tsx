//RegionForm
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTrash } from '../contexts/trash-context';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/language-context';
import axios from 'axios'; // axios をインポート

interface AreaData {
    area: string;
    area_en: string;
    address1: string;
    address2: string;
    connect_address: string;
    zipcode: string;
}

const RegionForm: React.FC = () => {
    const [postalCode, setPostalCode] = useState('');
    const [areaCandidates, setAreaCandidates] = useState<AreaData[]>([]);
    const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setRegion } = useTrash();
    const { t } = useLanguage();
    const storageKey = `calendarData`;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch(`http://localhost:8000/areas?postal_code=${postalCode}`);
          if (!response.ok) {
              throw new Error('Failed to fetch area candidates');
          }
          const data = await response.json();
          setAreaCandidates(data.areas);
      } catch (error: any) {
          console.error('Error fetching area candidates:', error);
          setError(error.message || 'Unknown error');
      } finally {
          setIsLoading(false);
      }
  };



  const handleAreaSelect = async () => {
    if (selectedArea) {
      try {
        const response = await axios.get(`http://localhost:8000/area/${selectedArea.area_en}`);
        const area = response.data.area;
        console.log(area);

        // setRegion の処理は必要であれば行う（ただし、遷移には直接影響させない）
        setRegion({
          area: area,
          area_en: selectedArea.area_en,
        });


        fetch(`/api?area=${encodeURIComponent(area)}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.success && data.data) {
            const newRecords = data.data;
            localStorage.setItem(storageKey, JSON.stringify(newRecords));
          } else {
            console.log("データの取得に失敗:", data);
          }
        })
        .catch((error) => {
          console.log("Fetch エラー:", error);
        });




        // クエリパラメータを使用して area を渡す
        router.push(`/calendar?area=${encodeURIComponent(area)}`);

      } catch (err) {
        console.error('APIエラー:', err);
        setError('Failed to get area information.');
      }
    } else {
      setError('Please select an area.');
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
                                disabled={isLoading}
                            >
                                {isLoading ? '読み込み中...' : t("main.go")}
                            
                            </Button>
                        </div>
                    </form>

                    {error && <p className="text-red-500">{error}</p>}

                    {areaCandidates.length > 0 && (
                        <div className='mt-7'>
                            <Label htmlFor="area">{t("main.selectAnArea")}</Label>
                            <Select onValueChange={(value) => setSelectedArea(areaCandidates.find(area => area.area_en === value) || null)} value={selectedArea?.area_en || ""}>
                                <SelectTrigger id="area">
                                    <SelectValue placeholder={t("main.areaSelect")} />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    {areaCandidates.map((area) => (
                                        <SelectItem key={area.area_en} value={area.area_en}>
                                            {area.area_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="pt-4 flex justify-center">
                                <Button
                                    onClick={handleAreaSelect}
                                    className="bg-[#8ebac1] hover:bg-[#789ea3] text-white px-8"
                                >
                                    OK
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