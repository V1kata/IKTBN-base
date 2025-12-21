import { Upload, X } from "lucide-react";

export default function MapFormComponent({ mapData, setMapData, handleSubmit, loading }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMapData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setMapData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    };

    const removeImage = () => {
        setMapData((prev) => ({ ...prev, imageFile: null }));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-center">Създай нова карта</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700">Заглавие</label>
                <input
                    name="title"
                    value={mapData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
            </div>

            <div>
                <label className="flex items-center justify-center w-50 h-12 px-5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition space-x-2">
                    <Upload size={20} className="hidden md:block" />
                    <span>Качи изображение</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {mapData.imageFile && (
                    <div className="mt-2 flex items-center gap-2">
                        <div className="bg-gray-100 rounded p-2 text-sm break-all">{mapData.imageFile.name}</div>
                        <button type="button" onClick={removeImage} className="text-red-500 hover:text-red-700 font-bold">
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded text-white transition ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "Качва се..." : "Създай карта"}
            </button>
        </form>
    );
}
