import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  FileDown, 
  BookOpen 
} from "lucide-react";

interface StatsData {
  counts: {
    users: number;
    posts: number;
    events: number;
    forumPosts: number;
    resources: number;
    bibleStudies: number;
  };
  usersByRole: Record<string, number>;
  resourcesByType: Record<string, number>;
  recentActivity: {
    posts: any[];
    events: any[];
    forumPosts: any[];
  };
}

interface DashboardStatsProps {
  stats: StatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Usuários
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.users}</div>
          <p className="text-xs text-muted-foreground">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <span key={role} className="mr-2">{role}: {count}</span>
            ))}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Notícias/Postagens
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.posts}</div>
          <p className="text-xs text-muted-foreground">
            Postagens do site
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Eventos
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.events}</div>
          <p className="text-xs text-muted-foreground">
            Eventos cadastrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tópicos do Fórum
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.forumPosts}</div>
          <p className="text-xs text-muted-foreground">
            Tópicos de discussão
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recursos/Downloads
          </CardTitle>
          <FileDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.resources}</div>
          <p className="text-xs text-muted-foreground">
            {Object.entries(stats.resourcesByType).map(([type, count]) => (
              <span key={type} className="mr-2">{type}: {count}</span>
            ))}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Estudos Bíblicos
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.bibleStudies}</div>
          <p className="text-xs text-muted-foreground">
            Materiais de estudo
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimas atualizações em seu sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Postagens recentes</h3>
            <ul className="space-y-1 text-sm">
              {stats.recentActivity.posts.length > 0 ? (
                stats.recentActivity.posts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))
              ) : (
                <li className="text-muted-foreground">Sem postagens recentes</li>
              )}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Eventos próximos</h3>
            <ul className="space-y-1 text-sm">
              {stats.recentActivity.events.length > 0 ? (
                stats.recentActivity.events.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))
              ) : (
                <li className="text-muted-foreground">Sem eventos próximos</li>
              )}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tópicos recentes do fórum</h3>
            <ul className="space-y-1 text-sm">
              {stats.recentActivity.forumPosts.length > 0 ? (
                stats.recentActivity.forumPosts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))
              ) : (
                <li className="text-muted-foreground">Sem tópicos recentes</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}