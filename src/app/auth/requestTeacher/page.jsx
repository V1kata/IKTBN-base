import { getAllRequestedTeachers } from "@/lib/clientRequests";
import RequestTeacherAdminClient from "./RequestTeacherAdminClient";

export default async function RequestTeacherAdminPage() {
    const teachers = await getAllRequestedTeachers();

    return (
        <RequestTeacherAdminClient teachers={teachers} />
    )
}