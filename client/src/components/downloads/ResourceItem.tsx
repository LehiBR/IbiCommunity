import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Resource } from '@shared/schema';

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem = ({ resource }: ResourceItemProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  
  // Function to handle resource download
  const handleDownload = async () => {
    // If resource is not public and user is not logged in
    if (!resource.isPublic && !user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para baixar este recurso.",
        variant: "destructive",
      });
      return;
    }
    
    setDownloading(true);
    try {
      // In a real app, we would make an API request to trigger the download
      window.open(resource.fileUrl, '_blank');
      
      toast({
        title: "Download iniciado",
        description: `O arquivo "${resource.title}" está sendo baixado.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar o arquivo. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };
  
  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      'pdf': 'picture_as_pdf',
      'doc': 'description',
      'docx': 'description',
      'ppt': 'slideshow',
      'pptx': 'slideshow',
      'xls': 'table_chart',
      'xlsx': 'table_chart',
      'mp3': 'music_note',
      'zip': 'folder_zip',
      'mp4': 'video_library',
      'jpg': 'photo',
      'jpeg': 'photo',
      'png': 'photo',
    };
    
    return icons[fileType.toLowerCase()] || 'insert_drive_file';
  };
  
  return (
    <div className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center">
        <span className={`material-icons text-primary mr-3`}>
          {getFileIcon(resource.fileType)}
        </span>
        <div>
          <h4 className="font-semibold">{resource.title}</h4>
          <p className="text-sm text-gray-600">{resource.description}</p>
        </div>
      </div>
      <Button 
        size="sm" 
        variant="default" 
        className="bg-primary text-white"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <span className="material-icons animate-spin text-sm mr-1">autorenew</span>
        ) : (
          <span className="material-icons text-sm mr-1">download</span>
        )}
        Download
      </Button>
    </div>
  );
};

export default ResourceItem;
