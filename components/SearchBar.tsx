"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [value, setValue] = useState(
    searchParams.get("search") ?? ""
  );

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  function handleSearch(newValue: string) {
    setValue(newValue);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newValue.trim()) {
      params.set("search", newValue);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        value={value}
        placeholder={t.dashboard.search}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-11 border-border bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}