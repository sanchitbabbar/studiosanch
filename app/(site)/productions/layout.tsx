import type { Metadata } from "next";
export const metadata: Metadata = {
  "title": {
    "absolute": "Film, Fashion & Creative Production in Paris | Studio Sanch"
  },
  "description": "Film, fashion, cultural production and art direction by Studio Sanch, the Paris creative studio founded by Sanchit Babbar.",
  "alternates": {
    "canonical": "https://studiosanch.com/productions/"
  },
  "openGraph": {
    "title": "Film, Fashion & Creative Production in Paris | Studio Sanch",
    "description": "Film, fashion, cultural production and art direction by Studio Sanch, the Paris creative studio founded by Sanchit Babbar.",
    "url": "https://studiosanch.com/productions/",
    "type": "website"
  }
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
