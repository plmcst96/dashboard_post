/* eslint-disable @typescript-eslint/no-explicit-any */
import travel1 from "../assets/posts/travel1.jpg";
import travel2 from "../assets/posts/travel2.jpg";
import food1 from "../assets/posts/food1.jpg";
import food2 from "../assets/posts/food2.jpg";
import fashion1 from "../assets/posts/fashion1.jpg";
import fashion2 from "../assets/posts/fashion2.jpg";
import tech1 from "../assets/posts/tech1.jpg";
import tech2 from "../assets/posts/tech2.jpg";
import health1 from "../assets/posts/health1.jpg";
import health2 from "../assets/posts/health2.jpg";
import type { Post } from "../store/post";

export const handleCardColor = (category: string) => {
  switch (category) {
    case "Travel":
      return "#F4D55D";
    case "Food":
      return "#FFACA0";
    case "Fashion":
      return "#b1e89b";
    case "Technology":
      return "#cccefd";
    case "Health":
      return "#b6ebfc";
    default:
      return "#fdd58b";
  }
};

export const extractTextFromSlate = (content: string): string => {
  try {
    const nodes = JSON.parse(content);
    return nodes
      .map((n: any) => n.children?.map((c: any) => c.text).join(""))
      .join(" ");
  } catch {
    return "";
  }
};

export const slateToText = (nodes: any[]): string => {
  return nodes
    .map((n) => {
      if (n.text) return n.text;
      if (n.children) return slateToText(n.children);
      return '';
    })
    .join('\n');
};


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > 50 * 1024) {
      // 50 KB max
      alert("Image too large for local server. Use smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
};

export const formatDate1 = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const categoryColors: Record<Post["category"], string> = {
  Travel: "#F4D55D",
  Food: "#FFACA0",
  Fashion: "#b1e89b",
  Technology: "#cccefd",
  Health: "#b6ebfc",
};

export const imageMap: Record<string, string> = {
  "travel1.jpg": travel1,
  "travel2.jpg": travel2,
  "food1.jpg": food1,
  "food2.jpg": food2,
  "fashion1.jpg": fashion1,
  "fashion2.jpg": fashion2,
  "tech1.jpg": tech1,
  "tech2.jpg": tech2,
  "health1.jpg": health1,
  "health2.jpg": health2,
};

export const getPostImage = (image?: string) => {
  if (!image) return health1;

  // ✅ Caso Base64
  if (image.startsWith("data:image")) {
    return image;
  }

  // ✅ Caso path del db: "../assets/posts/health2.jpg"
  const fileName = image.split("/").pop() || "";

  if (imageMap[fileName]) {
    return imageMap[fileName];
  }

  // ❌ fallback finale
  return health1;
};