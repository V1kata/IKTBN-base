"use client";

import { useEffect, useState } from "react";
import { deletePersonality, getSession } from "@/lib/clientRequests";
import { getAllPersonalities } from "@/lib/personalitiesRequests";
import Link from "next/link";

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [personalitiesData, userData] = await Promise.all([
        getAllPersonalities(),
        getSession(),
      ]);
      setPersonalities(personalitiesData);
      if (userData && !userData.error) {
        setUser(userData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (e, personalityId) => {
    e.stopPropagation();
    if (!confirm("Сигурни ли сте, че искате да изтриете тази личност?")) return;

    const result = await deletePersonality(personalityId);
    if (result.success) {
      setPersonalities((prev) => prev.filter((p) => p.id !== personalityId));
    } else {
      alert("Възникна грешка при изтриването.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-black">
        Личности
      </h1>
      
      <div className="text-center mb-8">
        {user && (
          <Link href="/content/create-personality">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              + Добави личност
            </button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : personalities.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          Няма намерени личности.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {personalities.map((personality) => (
            <Link key={personality.id} href={`/content/personality/${personality.id}`}>
              <div className="group relative h-64 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {personality.image_path && (
                  <img
                    src={personality.image_path}
                    alt={personality.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-md transform transition-transform duration-300 group-hover:translate-x-1">
                    {personality.name}
                  </h3>
                  {personality.achievement_title && (
                    <p className="text-gray-200 text-sm mt-1 drop-shadow-md">
                      {personality.achievement_title}
                    </p>
                  )}
                  <p className="text-gray-300 text-xs mt-2 drop-shadow-md">
                    {personality.birth_year} - {personality.death_year}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
