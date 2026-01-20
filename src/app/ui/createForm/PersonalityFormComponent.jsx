import { Upload, X } from "lucide-react";

export default function PersonalityFormComponent({
  formData,
  setFormData,
  handleSubmit,
  loading,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birth_year" || name === "death_year" ? parseInt(value) || "" : value,
    }));
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: null }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-4">
      <h2 className="text-2xl font-semibold text-center">Добави нова личност</h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Име <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Въведи име"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
        />
      </div>

      {/* Achievement Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Достижение / Титла</label>
        <input
          type="text"
          name="achievement_title"
          value={formData.achievement_title}
          onChange={handleChange}
          placeholder="Напр: Революционер, Писател, Художник"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
        />
      </div>

      {/* Birth Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Година на раждане <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="birth_year"
          value={formData.birth_year}
          onChange={handleChange}
          placeholder="Напр: 1850"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
        />
      </div>

      {/* Death Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Година на смърт <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="death_year"
          value={formData.death_year}
          onChange={handleChange}
          placeholder="Напр: 1920"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Категория</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
        >
          <option value="български">български</option>
          <option value="бесарабски">бесарабски</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Въведи детайлна информация за личността"
          rows="6"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border resize-none"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="flex items-center justify-center w-full h-12 px-5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition space-x-2">
          <Upload size={20} className="hidden md:block" />
          <span>Качи изображение</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        {formData.imageFile && (
          <div className="mt-2 flex items-center gap-2">
            <div className="bg-gray-100 rounded p-2 text-sm break-all flex-1">{formData.imageFile.name}</div>
            <button type="button" onClick={removeImage} className="text-red-500 hover:text-red-700 font-bold">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          {loading ? "Създаване..." : "Създай личност"}
        </button>
      </div>
    </form>
  );
}
