import { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireAdmin } from './auth';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obter caminho atual para substituir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    
    // Verifica se o diretório existe, senão cria
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Filtro para arquivos de imagem
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Aceita imagens - jpeg, png, etc.
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Por favor, envie apenas imagens.'));
  }
};

// Filtro para qualquer tipo de arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Rejeitar arquivos muito grandes ou com extensões perigosas
  const dangerousExtensions = ['.exe', '.php', '.sh', '.html', '.js', '.jsx', '.ts', '.tsx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (dangerousExtensions.includes(fileExt)) {
    cb(new Error('Tipo de arquivo não permitido.'));
  } else {
    cb(null, true);
  }
};

const uploadImage = multer({ 
  storage, 
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadFile = multer({ 
  storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export function setupUploads(app: Express) {
  // Certificar que a pasta uploads existe
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Servir arquivos estáticos da pasta uploads
  app.use('/uploads', express.static(uploadDir));
  
  // Endpoint para upload de imagens
  app.post('/api/upload', requireAuth, uploadImage.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }
    
    // Construir URL relativa
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({ 
      message: 'Upload realizado com sucesso',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
  
  // Endpoint para upload de arquivos
  app.post('/api/upload-file', requireAuth, uploadFile.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    
    // Construir URL relativa
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({ 
      message: 'Upload realizado com sucesso',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
  
  // Rota para excluir arquivo (apenas administradores)
  app.delete('/api/uploads/:filename', requireAdmin, (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Arquivo excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Arquivo não encontrado' });
    }
  });
  
  // Middleware de tratamento de erros para o multer
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Arquivo muito grande' });
      }
      return res.status(400).json({ message: err.message });
    }
    
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    next();
  });
}