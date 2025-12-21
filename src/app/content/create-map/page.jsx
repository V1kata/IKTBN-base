"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapFormComponent from "@/app/ui/createForm/MapFormComponent";
import { createMap } from "@/lib/createMapAction";
import { useUser } from "@/app/context/UserContext";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function CreateMapPage() {
  const router = useRouter();
  const { userData } = useUser();

  const [mapData, setMapData] = useState({ title: "", imageFile: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (!mapData.title || !mapData.imageFile) {
        alert("Моля, попълнете заглавие и качете изображение!");
        setLoading(false);
        return;
      }

      const res = await createMap({
        title: mapData.title,
        imageFile: mapData.imageFile,
        userId: userData?.id,
      });

      if (!res?.success) {
        alert("Грешка при създаване на карта.");
        console.error(res?.error);
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard access="teacher">
      <MapFormComponent
        mapData={mapData}
        setMapData={setMapData}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </AuthGuard>
  );
}
