"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export type Results = { results: { short_response: string; link: string }[] };
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ollama?prompt=${query}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json() as Promise<Results>;
    },
    enabled: false,
  });
  console.log(data);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await refetch();
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tech Boilerplate AI Assistant</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-4"
      >
        <Input
          type="text"
          placeholder="Ask about a tech boilerplate..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button className="max-w-[98px]" type="submit" disabled={isLoading}>
          <SearchIcon className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>AI Response</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : data ? (
            data.results.map((item, i) => (
              <div className="my-4" key={i}>
                <p>{item.short_response}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <Link
                      href={item.link}
                      className="text-blue-500 hover:underline flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.link}
                      <ExternalLinkIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              Ask a question to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
