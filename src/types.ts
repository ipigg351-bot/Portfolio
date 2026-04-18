export interface SiteSettings {
  siteName: string;
  slogan: string;
  heroDescription: string;
  primaryColor: string;
  contactEmail: string;
  instagramUrl: string;
  kakaoUrl: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Logo" | "Website" | "Branding" | "UI/UX";
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "New" | "Read" | "Replied";
  createdAt: string;
}
