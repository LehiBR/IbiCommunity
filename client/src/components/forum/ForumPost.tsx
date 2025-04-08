import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ForumPost } from "@shared/schema";

interface ForumPostProps {
  post: ForumPost & { 
    author: { 
      id: number;
      name: string;
      username: string;
      avatar?: string | null;
    };
    commentCount?: number;
    comments?: any[]; 
  };
  isDetailView: boolean;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  general: { label: "Geral", color: "bg-gray-500" },
  bible: { label: "Estudos Bíblicos", color: "bg-green-500" },
  prayer: { label: "Pedidos de Oração", color: "bg-blue-500" },
  testimony: { label: "Testemunhos", color: "bg-yellow-500" },
  events: { label: "Eventos", color: "bg-purple-500" },
};

const ForumPost = ({ post, isDetailView }: ForumPostProps) => {
  const getCategoryLabel = (category: string) => {
    return categoryLabels[category] || { label: category, color: "bg-gray-500" };
  };

  const categoryInfo = getCategoryLabel(post.category);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card>
      <CardHeader className={isDetailView ? "pb-2" : "pb-4"}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={isDetailView ? "text-2xl mb-1" : ""}>
              {post.title}
            </CardTitle>
            <CardDescription className="flex items-center flex-wrap gap-2">
              <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
              <span>•</span>
              <span>{formattedDate}</span>
            </CardDescription>
          </div>
          {!isDetailView && (
            <div className="text-center">
              <span className="block text-xl font-bold text-primary">
                {post.commentCount || 0}
              </span>
              <span className="text-xs text-gray-500">comentários</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isDetailView ? (
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
        ) : (
          <p className="text-gray-600 line-clamp-2">{post.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
            {post.author?.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{post.author?.name}</span>
        </div>
        {!isDetailView && (
          <Link href={`/forum/${post.id}`}>
            <Button variant="ghost" size="sm">
              Ver Tópico
              <span className="material-icons ml-1 text-sm">arrow_forward</span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ForumPost;
