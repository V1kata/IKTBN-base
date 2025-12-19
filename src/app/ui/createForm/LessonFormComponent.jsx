import GradeSelect from "@/app/ui/createForm/GradeSelect";
import LessonTitleInput from "@/app/ui/createForm/LessonTitleInput";
import LessonContentTextarea from "@/app/ui/createForm/LessonContentTextarea";
import FileUploader from "@/app/ui/createForm/FileUploader";

export default function LessonFormComponent({ lessonData, setLessonData, handleSubmit, loading }) {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setLessonData((prev) => ({ ...prev, [name]: val }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-4"
        >
            <h2 className="text-2xl font-semibold text-center">Създай нов урок</h2>

            <GradeSelect lessonData={lessonData} handleChange={handleChange} />

            <LessonTitleInput lessonData={lessonData} handleChange={handleChange} />

            <LessonContentTextarea lessonData={lessonData} handleChange={handleChange} />

            <FileUploader lessonData={lessonData} setLessonData={setLessonData} />

            <div className="flex items-center gap-3">
                <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={!!lessonData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">Публичен урок (видим за всички)</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded text-white transition ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "Качва се..." : "Създай урок"}
            </button>
        </form>
    )
}