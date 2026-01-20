"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonalityFormComponent from "@/app/ui/createForm/PersonalityFormComponent";
import { createPersonality } from "@/lib/createPersonalityAction";
import { useUser } from "@/app/context/UserContext";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function CreatePersonalityPage() {
  const router = useRouter();
  const { userData } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    achievement_title: "",
    birth_year: "",
    death_year: "",
    category: "български",
    description: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!formData.name || !formData.birth_year || !formData.death_year) {
      alert("Моля, попълнете задължителните полета: Име, Година на раждане и Година на смърт!");
      return;
    }

    setLoading(true);

    try {
      const res = await createPersonality({
        name: formData.name,
        achievement_title: formData.achievement_title,
        birth_year: formData.birth_year,
        death_year: formData.death_year,
        category: formData.category,
        description: formData.description,
        imageFile: formData.imageFile,
      });

      if (!res.success) {
        alert("Грешка при създаване на личност.");
        console.error(res.error);
        setLoading(false);
        return;
      }

      router.push("/personalities");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Възникна грешка при създаване на личност.");
      setLoading(false);
    }
  };

  return (
    <AuthGuard access="all">
      <div className="max-w-2xl mx-auto py-10">
        <PersonalityFormComponent
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </AuthGuard>
  );
}
