
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Label } from "../ui/label";
import { jobTypes } from "@/lib/job-types";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { Input } from "../ui/input";
import FormSubmitButton from "./FormSubmitButton";
import { Metadata } from "next";
import Select from "../ui/select";

interface JobFilterSidebarProps {
    defaultValues: JobFilterValues;
}

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}

function getTitle({ q, type, location, remote }: JobFilterValues) {
    const titlePrefix = q
      ? `${q} jobs`
      : type
        ? `${type} developer jobs`
        : remote
          ? "Remote developer jobs"
          : "All developer jobs";

    const titleSuffix = location ? ` in ${location}` : "";

    return `${titlePrefix}${titleSuffix}`;
  }
  
  export function generateMetadata({
    searchParams: { q, type, location, remote },
  }: PageProps): Metadata {
    return {
      title: `${getTitle({
        q,
        type,
        location,
        remote: remote === "true",
      })} | Flow Jobs`,
    };
  }

async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}


export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[350px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
                id="type"
              name="type"
              defaultValue={defaultValues.type || ""}
            >
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
                id="location"
              name="location"
              defaultValue={defaultValues.location || ""}
            >
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}