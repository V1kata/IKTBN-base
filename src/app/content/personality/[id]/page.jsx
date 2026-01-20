"use server";
import { getPersonalityById } from "@/lib/personalitiesRequests";
import { PersonalitySkeleton } from "@/app/ui/personalities/PersonalitySkeleton";

export default async function PersonalityPage({ params }) {
  const { id } = await params;
  
  const personality = await getPersonalityById(id);
  return (
    <PersonalitySkeleton personality={personality} />
  );
}
