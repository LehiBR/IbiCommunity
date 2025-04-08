import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@shared/schema";

interface NewsCardProps {
  post: Post & { author: { name: string } };
}

const NewsCard = ({ post }: NewsCardProps) => {
  // Format the date
  const formattedDate = format(
    new Date(post.createdAt), 
    "d 'de' MMMM, yyyy", 
    { locale: ptBR }
  );
  
  // Get placeholder image based on category
  const getImageUrl = (category: string, imageUrl?: string | null) => {
    if (imageUrl) return imageUrl;
    
    // Default placeholder images by category
    const images: Record<string, string> = {
      "event": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      "news": "https://images.unsplash.com/photo-1617502323766-3c53aae03766?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
      "study": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
    };
    
    return images[category] || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80";
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getImageUrl(post.category, post.imageUrl)})` 
        }}
      />
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="material-icons text-sm mr-1">calendar_today</span>
          <span>{formattedDate}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 font-heading text-gray-800">{post.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">
          {post.content.length > 120 
            ? post.content.substring(0, 120) + "..." 
            : post.content}
        </p>
        <Link 
          href={`/news/${post.id}`} 
          className="text-primary font-semibold hover:text-blue-700 inline-flex items-center"
        >
          Leia mais <span className="material-icons text-sm ml-1">arrow_forward</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
