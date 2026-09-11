"use client";

import { Search } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useState,
  useTransition,
} from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [value, setValue] = useState(
    searchParams.get("search") ?? ""
  );

  const [, startTransition] = useTransition();

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  function handleSearch(newValue: string) {
    setValue(newValue);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    const normalizedValue = newValue.trim();

    if (normalizedValue) {
      params.set("search", normalizedValue);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    const nextUrl = query
      ? `${pathname}?${query}`
      : pathname;

    startTransition(() => {
      router.replace(nextUrl, {
        scroll: false,
      });
    });
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
        onChange={(event) =>
          handleSearch(event.target.value)
        }
        className="h-11 border-border bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}