import { describe, expect, it } from "vitest";

import { filterListings, listings } from "@/components/swap/data";

describe("filterListings", () => {
  it("matches listing fields without case or accent differences", () => {
    const results = filterListings(listings, "Todos", "ingles", []);

    expect(results.map((listing) => listing.id)).toEqual([3, 8]);
  });

  it("combines the selected category with the search term", () => {
    const results = filterListings(listings, "Jogos", "controle", []);

    expect(results.map((listing) => listing.id)).toEqual([6]);
  });

  it("shows only saved listings when the saved filter is selected", () => {
    const results = filterListings(listings, "Salvos", "", [2, 5]);

    expect(results.map((listing) => listing.id)).toEqual([2, 5]);
  });

  it("combines listing kind and maximum price filters", () => {
    const results = filterListings(listings, "Todos", "", [], {
      kind: "trade",
      maxPrice: 35,
    });

    expect(results.map((listing) => listing.id)).toEqual([10, 9, 1, 2, 4, 8]);
  });

  it("shows only the current demo user's non-removed listings", () => {
    const mine = { ...listings[0], owner: "Ana", status: "paused" as const };
    const removed = { ...listings[1], owner: "Ana", status: "removed" as const };
    const results = filterListings([mine, removed], "Todos", "", [], {
      view: "mine",
      owner: "Ana",
    });

    expect(results.map((listing) => listing.id)).toEqual([1]);
  });
});
