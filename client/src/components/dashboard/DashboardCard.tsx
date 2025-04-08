import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  actionText?: string;
  actionLink?: string;
}

const DashboardCard = ({ title, children, actionText, actionLink }: DashboardCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        
        {actionText && actionLink && (
          <Link href={actionLink}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm">
              {actionText}
              <span className="material-icons ml-1 text-sm">arrow_forward</span>
            </Button>
          </Link>
        )}
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
