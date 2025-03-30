import JobFilterSidebar from "@/components/customComponents/JobFilterSidebar";
import JobResults from "@/components/customComponents/JobResult";
import { JobFilterValues } from "@/lib/validation";

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}

export default async function Home({
  searchParams: { q, type, location, remote,page },
}: PageProps) {

  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-bold">Welcome to Jobify</h1>
        <p className="text-muted-foreground">Find your dream job.</p>
      </div>

      <section className="flex flex-col gap-4 md:flex-row">
        <div>
          <JobFilterSidebar defaultValues={filterValues} />
        </div>
        <JobResults
          filterValues={filterValues}
          page={page ? parseInt(page) : undefined}
        />
      </section>
    </main>
  );
}
