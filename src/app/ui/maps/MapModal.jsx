import { createPortal } from "react-dom";

export function MapModal({ map, onClose }) {
    if (!map) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10  w-12 h-12 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                >
                    ✕
                </button>

                <img
                    src={map.imageUrl}
                    alt={map.title}
                    className="
                        w-[50vw]
                        h-[50vh]
                        object-contain
                        rounded-xl
                        shadow-2xl
                    "
                />
            </div>
        </div>,
        document.body
    );
}
