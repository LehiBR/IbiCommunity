import { Server, createServer } from "http";
import { Express, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { hash } from "bcrypt";
import {
  insertPostSchema,
  insertEventSchema,
  insertForumPostSchema,
  insertForumCommentSchema,
  insertResourceSchema,
  insertMessageSchema,
  insertPhotoAlbumSchema,
  insertBibleStudyResourceSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Set up authentication routes
  setupAuth(app);
  
  // Rota temporária para criar o primeiro administrador (remover em produção)
  app.post("/api/setup-admin", async (req, res, next) => {
    try {
      const username = req.body.username || "admin";
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      const updatedUser = await storage.updateUser(user.id, { 
        role: "admin"
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Erro ao atualizar usuário" });
      }
      
      // Remove password from response
      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitiveInfo } = updatedUser;
      res.json({
        ...userWithoutSensitiveInfo,
        message: "Usuário promovido a administrador com sucesso!"
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Listar todos os usuários sem autenticação (apenas para depuração)
  app.get("/api/list-users", async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const safeUsers = users.map(user => {
        const { password, resetToken, resetTokenExpiry, ...userWithoutSensitiveInfo } = user;
        return userWithoutSensitiveInfo;
      });
      res.json(safeUsers);
    } catch (error) {
      next(error);
    }
  });

  // Rota alternativa para configurar administrador pelo ID (mais fácil para testes)
  app.get("/api/make-admin/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      const updatedUser = await storage.updateUser(id, { 
        role: "admin"
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Erro ao atualizar usuário" });
      }
      
      // Remove password from response
      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitiveInfo } = updatedUser;
      res.json({
        ...userWithoutSensitiveInfo,
        message: "Usuário promovido a administrador com sucesso!"
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Admin routes for user management
  app.get("/api/admin/users", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const safeUsers = users.map(user => {
        const { password, resetToken, resetTokenExpiry, ...userWithoutSensitiveInfo } = user;
        return userWithoutSensitiveInfo;
      });
      res.json(safeUsers);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/admin/users/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Remove password from response
      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitiveInfo } = user;
      res.json(userWithoutSensitiveInfo);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/admin/users/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Prevent changing your own role if you're an admin (safety measure)
      if (id === req.user.id && req.body.role && req.body.role !== user.role) {
        return res.status(400).json({ message: "Você não pode alterar seu próprio nível de acesso" });
      }
      
      const updatedUser = await storage.updateUser(id, req.body);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Erro ao atualizar usuário" });
      }
      
      // Remove password from response
      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitiveInfo } = updatedUser;
      res.json(userWithoutSensitiveInfo);
    } catch (error) {
      next(error);
    }
  });
  
  // Admin dashboard statistics
  app.get("/api/admin/stats", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      const posts = await storage.getPosts();
      const events = await storage.getEvents();
      const forumPosts = await storage.getForumPosts();
      const resources = await storage.getResources();
      const bibleStudies = await storage.getBibleStudyResources();
      
      // Count users by role
      const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Count resources by type
      const resourcesByType = resources.reduce((acc, resource) => {
        acc[resource.fileType] = (acc[resource.fileType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Get recent activity
      const recentPosts = posts.slice(0, 5);
      const recentEvents = events.slice(0, 5);
      const recentForumPosts = forumPosts.slice(0, 5);
      
      res.json({
        counts: {
          users: users.length,
          posts: posts.length,
          events: events.length,
          forumPosts: forumPosts.length,
          resources: resources.length,
          bibleStudies: bibleStudies.length
        },
        usersByRole,
        resourcesByType,
        recentActivity: {
          posts: recentPosts,
          events: recentEvents,
          forumPosts: recentForumPosts
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // API routes
  // Posts (News/Updates)
  app.get("/api/posts", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string | undefined;
      
      // Only published posts for non-admin users
      const isPublished = !req.isAuthenticated() || req.user.role !== "admin" ? true : undefined;
      
      const posts = await storage.getPosts(limit, offset, category, isPublished);
      
      // Get author info for each post
      const postsWithAuthor = await Promise.all(
        posts.map(async (post) => {
          const author = await storage.getUser(post.authorId);
          const { password, ...authorWithoutPassword } = author || { 
            id: 0, 
            username: "unknown", 
            email: "", 
            name: "Usuário Desconhecido", 
            role: "unknown",
            avatar: null,
            createdAt: new Date()
          };
          
          return {
            ...post,
            author: authorWithoutPassword
          };
        })
      );
      
      res.json(postsWithAuthor);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/posts/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      
      // Only admins can see unpublished posts
      if (!post.isPublished && (!req.isAuthenticated() || req.user.role !== "admin")) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      
      const author = await storage.getUser(post.authorId);
      const { password, ...authorWithoutPassword } = author || { 
        id: 0, 
        username: "unknown", 
        email: "", 
        name: "Usuário Desconhecido", 
        role: "unknown",
        avatar: null,
        createdAt: new Date()
      };
      
      res.json({
        ...post,
        author: authorWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/posts", requireAdmin, async (req, res, next) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost({
        ...postData,
        authorId: req.user!.id
      });
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/posts/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      
      const updatedPost = await storage.updatePost(id, req.body);
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/posts/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Events
  app.get("/api/events", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string | undefined;
      
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }
      
      const events = await storage.getEvents(limit, offset, startDate, endDate, category);
      
      res.json(events);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/events/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Evento não encontrado" });
      }
      
      res.json(event);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events", requireAdmin, async (req, res, next) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({
        ...eventData,
        creatorId: req.user!.id
      });
      
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/events/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Evento não encontrado" });
      }
      
      const updatedEvent = await storage.updateEvent(id, req.body);
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Evento não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Forum Posts - requires authentication
  app.get("/api/forum", requireAuth, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string | undefined;
      
      const posts = await storage.getForumPosts(limit, offset, category);
      
      // Get author info and comment count for each post
      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          const author = await storage.getUser(post.authorId);
          const comments = await storage.getForumComments(post.id);
          
          const { password, ...authorWithoutPassword } = author || { 
            id: 0, 
            username: "unknown", 
            email: "", 
            name: "Usuário Desconhecido", 
            role: "unknown",
            avatar: null,
            createdAt: new Date()
          };
          
          return {
            ...post,
            author: authorWithoutPassword,
            commentCount: comments.length
          };
        })
      );
      
      res.json(postsWithDetails);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/forum/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getForumPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
      
      const author = await storage.getUser(post.authorId);
      const comments = await storage.getForumComments(post.id);
      
      // Get author info for each comment
      const commentsWithAuthor = await Promise.all(
        comments.map(async (comment) => {
          const commentAuthor = await storage.getUser(comment.authorId);
          const { password, ...authorWithoutPassword } = commentAuthor || { 
            id: 0, 
            username: "unknown", 
            email: "", 
            name: "Usuário Desconhecido", 
            role: "unknown",
            avatar: null,
            createdAt: new Date()
          };
          
          return {
            ...comment,
            author: authorWithoutPassword
          };
        })
      );
      
      const { password, ...authorWithoutPassword } = author || { 
        id: 0, 
        username: "unknown", 
        email: "", 
        name: "Usuário Desconhecido", 
        role: "unknown",
        avatar: null,
        createdAt: new Date()
      };
      
      res.json({
        ...post,
        author: authorWithoutPassword,
        comments: commentsWithAuthor
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/forum", requireAuth, async (req, res, next) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost({
        ...postData,
        authorId: req.user.id
      });
      
      const author = {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      };
      
      res.status(201).json({
        ...post,
        author,
        commentCount: 0
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/forum/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getForumPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
      
      // Only author or admin can update
      if (post.authorId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Sem permissão para editar este tópico" });
      }
      
      const updatedPost = await storage.updateForumPost(id, req.body);
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/forum/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getForumPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
      
      // Only author or admin can delete
      if (post.authorId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Sem permissão para excluir este tópico" });
      }
      
      const success = await storage.deleteForumPost(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Forum Comments
  app.post("/api/forum/:postId/comments", requireAuth, async (req, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getForumPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
      
      const commentData = insertForumCommentSchema.parse({
        ...req.body,
        postId,
        authorId: req.user.id
      });
      
      const comment = await storage.createForumComment(commentData);
      
      // Update the last updated time of the post
      await storage.updateForumPost(postId, { updatedAt: new Date() });
      
      // Add author info to response
      const author = {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      };
      
      res.status(201).json({
        ...comment,
        author
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/forum/comments/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const comments = Array.from((await storage.forumComments).values());
      const comment = comments.find(c => c.id === id);
      
      if (!comment) {
        return res.status(404).json({ message: "Comentário não encontrado" });
      }
      
      // Only author or admin can delete
      if (comment.authorId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Sem permissão para excluir este comentário" });
      }
      
      const success = await storage.deleteForumComment(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Resources (Downloads)
  app.get("/api/resources", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string | undefined;
      
      // Non-authenticated users can only see public resources
      const isPublic = !req.isAuthenticated() ? true : undefined;
      
      const resources = await storage.getResources(limit, offset, category, isPublic);
      
      // Adicionar links do Drive para cada recurso
      const resourcesWithDriveLinks = resources.map(resource => ({
        ...resource,
        downloadUrl: resource.driveFileId ? `https://drive.google.com/uc?export=download&id=${resource.driveFileId}` : null
      }));
      
      res.json(resourcesWithDriveLinks);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/resources/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      // Check if user can access this resource
      if (!resource.isPublic && !req.isAuthenticated()) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      
      res.json(resource);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/resources", requireAdmin, async (req, res, next) => {
    try {
      const resourceData = insertResourceSchema.parse({
        ...req.body,
        uploaderId: req.user.id
      });
      
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/resources/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      const updatedResource = await storage.updateResource(id, req.body);
      res.json(updatedResource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/resources/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteResource(id);
      
      if (!success) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Contact Messages
  app.post("/api/contact", async (req, res, next) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      res.status(201).json({ 
        success: true, 
        message: "Mensagem enviada com sucesso!" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/messages", requireAdmin, async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const isRead = req.query.isRead === "true" ? true : 
                     req.query.isRead === "false" ? false : 
                     undefined;
      
      const messages = await storage.getMessages(limit, offset, isRead);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/messages/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ message: "Mensagem não encontrada" });
      }
      
      // Mark as read when accessed
      if (!message.isRead) {
        await storage.markMessageAsRead(id);
      }
      
      res.json(message);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/messages/:id/read", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ message: "Mensagem não encontrada" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(id);
      res.json(updatedMessage);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/messages/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMessage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Mensagem não encontrada" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Photo Albums
  app.get("/api/albums", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const albums = await storage.getPhotoAlbums(limit, offset);
      res.json(albums);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/albums/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getPhotoAlbum(id);
      
      if (!album) {
        return res.status(404).json({ message: "Álbum não encontrado" });
      }
      
      res.json(album);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/albums", requireAdmin, async (req, res, next) => {
    try {
      const albumData = insertPhotoAlbumSchema.parse(req.body);
      const album = await storage.createPhotoAlbum(albumData);
      
      res.status(201).json(album);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/albums/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getPhotoAlbum(id);
      
      if (!album) {
        return res.status(404).json({ message: "Álbum não encontrado" });
      }
      
      const updatedAlbum = await storage.updatePhotoAlbum(id, req.body);
      res.json(updatedAlbum);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/albums/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePhotoAlbum(id);
      
      if (!success) {
        return res.status(404).json({ message: "Álbum não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Bible Study Resources
  app.get("/api/bible-study-resources", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string | undefined;
      const contentType = req.query.contentType as string | undefined;
      
      // Non-authenticated users can only see published resources
      const isPublished = !req.isAuthenticated() || req.user.role !== "admin" ? true : undefined;
      
      const resources = await storage.getBibleStudyResources(limit, offset, category, contentType, isPublished);
      
      // Add author info
      const resourcesWithAuthor = await Promise.all(
        resources.map(async (resource) => {
          const author = await storage.getUser(resource.authorId);
          const { password, ...authorWithoutPassword } = author || { 
            id: 0, 
            username: "unknown", 
            email: "", 
            name: "Usuário Desconhecido", 
            role: "unknown",
            avatar: null,
            createdAt: new Date()
          };
          
          return {
            ...resource,
            author: authorWithoutPassword
          };
        })
      );
      
      res.json(resourcesWithAuthor);
    } catch (error) {
      next(error);
    }
  });
  
  // Alias para bible-study (usado pelo componente BibleStudyForm)
  app.get("/api/bible-study", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string | undefined;
      const contentType = req.query.contentType as string | undefined;
      
      const resources = await storage.getBibleStudyResources(limit, offset, category, contentType);
      
      // Add author info
      const resourcesWithAuthor = await Promise.all(
        resources.map(async (resource) => {
          const author = await storage.getUser(resource.authorId);
          const { password, ...authorWithoutPassword } = author || { 
            id: 0, 
            username: "unknown", 
            email: "", 
            name: "Usuário Desconhecido", 
            role: "unknown",
            avatar: null,
            createdAt: new Date()
          };
          
          return {
            ...resource,
            author: authorWithoutPassword
          };
        })
      );
      
      res.json(resourcesWithAuthor);
    } catch (error) {
      next(error);
    }
  });
  
  // Registrar visualização do estudo
  app.post("/api/bible-study/:id/view", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const resource = await storage.getBibleStudyResource(id);
      if (!resource) {
        return res.status(404).json({ message: "Estudo não encontrado" });
      }
      
      // Incrementar visualizações
      await storage.updateBibleStudyResource(id, { 
        viewCount: resource.viewCount + 1 
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bible-study-resources/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getBibleStudyResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      // Only admins can see unpublished resources
      if (!resource.isPublished && (!req.isAuthenticated() || req.user.role !== "admin")) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      // Increment view count
      await storage.updateBibleStudyResource(id, { 
        viewCount: resource.viewCount + 1 
      });
      
      const author = await storage.getUser(resource.authorId);
      const { password, ...authorWithoutPassword } = author || { 
        id: 0, 
        username: "unknown", 
        email: "", 
        name: "Usuário Desconhecido", 
        role: "unknown",
        avatar: null,
        createdAt: new Date()
      };
      
      res.json({
        ...resource,
        author: authorWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/bible-study-resources", requireAdmin, async (req, res, next) => {
    try {
      const resourceData = insertBibleStudyResourceSchema.parse({
        ...req.body,
        authorId: req.user.id
      });
      
      const resource = await storage.createBibleStudyResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });
  
  // Alias para o formulário de criação de estudos
  app.post("/api/bible-study", requireAdmin, async (req, res, next) => {
    try {
      const resourceData = insertBibleStudyResourceSchema.parse({
        ...req.body,
        authorId: req.user.id
      });
      
      const resource = await storage.createBibleStudyResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/bible-study-resources/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getBibleStudyResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      const updatedResource = await storage.updateBibleStudyResource(id, req.body);
      res.json(updatedResource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });
  
  // Alias para o formulário de edição de estudos
  app.put("/api/bible-study/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getBibleStudyResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      const updatedResource = await storage.updateBibleStudyResource(id, req.body);
      res.json(updatedResource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/bible-study-resources/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBibleStudyResource(id);
      
      if (!success) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
  
  // Alias para excluir estudos
  app.delete("/api/bible-study/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBibleStudyResource(id);
      
      if (!success) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
