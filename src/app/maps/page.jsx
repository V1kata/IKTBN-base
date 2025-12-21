"use client";

import { useEffect, useState } from "react";
import { getMaps, deleteMap, getSession } from "@/lib/clientRequests";
import { MapModal } from "../ui/maps/MapModal";

export default function MapsPage() {
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [mapsData, userData] = await Promise.all([
        getMaps(),
        getSession(), // This attempts to get the current logged-in user
      ]);
      setMaps(mapsData);
      if (userData && !userData.error) {
        setUser(userData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (e, mapId) => {
    e.stopPropagation(); // Prevent opening modal
    if (!confirm("Сигурни ли сте, че искате да изтриете тази карта?")) return;

    const success = await deleteMap(mapId);
    if (success) {
      setMaps((prev) => prev.filter((m) => m.id !== mapId));
    } else {
      alert("Възникна грешка при изтриването.");
    }
  };

  const openModal = (map) => {
    setSelectedMap(map);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedMap(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center  bg-clip-text text-black">
        Интерактивни Карти
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : maps.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          Няма намерени карти.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {maps.map((map) => (
            <div
              key={map.id}
              className="group relative h-64 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openModal(map)}
            >
              <img
                src={map.imageUrl}
                alt={map.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />

              {/* Delete Button for Creator */}
              {user &&
                (user.id === map.user_id || user.id === map.creator_id) && (
                  <button
                    onClick={(e) => handleDelete(e, map.id)}
                    className="absolute top-4 right-4 z-20 
                             bg-red-600 hover:bg-red-700 text-white 
                             p-2 rounded-full shadow-lg 
                             opacity-0 group-hover:opacity-100 transition-all duration-300 
                             transform hover:scale-110"
                    title="Изтрий картата"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}

              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-md transform transition-transform duration-300 group-hover:translate-x-1">
                  {map.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedMap && <MapModal map={selectedMap} onClose={closeModal} />}
    </div>
  );
}
