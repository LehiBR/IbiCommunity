import { users, posts, events, forumPosts, forumComments, resources, messages, photoAlbums, bibleStudyResources } from "@shared/schema";
import type { User, InsertUser, Post, InsertPost, Event, InsertEvent, ForumPost, InsertForumPost, ForumComment, InsertForumComment, Resource, InsertResource, Message, InsertMessage, PhotoAlbum, InsertPhotoAlbum, BibleStudyResource, InsertBibleStudyResource } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<Omit<User, "id">>): Promise<User | undefined>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getPosts(limit?: number, offset?: number, category?: string, published?: boolean): Promise<Post[]>;
  updatePost(id: number, post: Partial<Omit<Post, "id">>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(
    limit?: number, 
    offset?: number, 
    startDate?: Date, 
    endDate?: Date, 
    category?: string
  ): Promise<Event[]>;
  updateEvent(id: number, event: Partial<Omit<Event, "id">>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Forum post operations
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  getForumPosts(limit?: number, offset?: number, category?: string): Promise<ForumPost[]>;
  updateForumPost(id: number, post: Partial<Omit<ForumPost, "id">>): Promise<ForumPost | undefined>;
  deleteForumPost(id: number): Promise<boolean>;
  
  // Forum comment operations
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  getForumComments(postId: number): Promise<ForumComment[]>;
  deleteForumComment(id: number): Promise<boolean>;
  
  // Resource operations
  createResource(resource: InsertResource): Promise<Resource>;
  getResource(id: number): Promise<Resource | undefined>;
  getResources(limit?: number, offset?: number, category?: string, isPublic?: boolean): Promise<Resource[]>;
  updateResource(id: number, resource: Partial<Omit<Resource, "id">>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(limit?: number, offset?: number, isRead?: boolean): Promise<Message[]>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Photo album operations
  createPhotoAlbum(album: InsertPhotoAlbum): Promise<PhotoAlbum>;
  getPhotoAlbum(id: number): Promise<PhotoAlbum | undefined>;
  getPhotoAlbums(limit?: number, offset?: number): Promise<PhotoAlbum[]>;
  updatePhotoAlbum(id: number, album: Partial<Omit<PhotoAlbum, "id">>): Promise<PhotoAlbum | undefined>;
  deletePhotoAlbum(id: number): Promise<boolean>;
  
  // Bible study resource operations
  createBibleStudyResource(resource: InsertBibleStudyResource): Promise<BibleStudyResource>;
  getBibleStudyResource(id: number): Promise<BibleStudyResource | undefined>;
  getBibleStudyResources(
    limit?: number, 
    offset?: number, 
    category?: string, 
    contentType?: string,
    isPublished?: boolean
  ): Promise<BibleStudyResource[]>;
  updateBibleStudyResource(id: number, resource: Partial<Omit<BibleStudyResource, "id">>): Promise<BibleStudyResource | undefined>;
  deleteBibleStudyResource(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private events: Map<number, Event>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  private resources: Map<number, Resource>;
  private messages: Map<number, Message>;
  private photoAlbums: Map<number, PhotoAlbum>;
  private bibleStudyResources: Map<number, BibleStudyResource>;
  
  private userIdCounter: number;
  private postIdCounter: number;
  private eventIdCounter: number;
  private forumPostIdCounter: number;
  private forumCommentIdCounter: number;
  private resourceIdCounter: number;
  private messageIdCounter: number;
  private photoAlbumIdCounter: number;
  private bibleStudyResourceIdCounter: number;
  
  public sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.events = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.resources = new Map();
    this.messages = new Map();
    this.photoAlbums = new Map();
    this.bibleStudyResources = new Map();
    
    this.userIdCounter = 1;
    this.postIdCounter = 1;
    this.eventIdCounter = 1;
    this.forumPostIdCounter = 1;
    this.forumCommentIdCounter = 1;
    this.resourceIdCounter = 1;
    this.messageIdCounter = 1;
    this.photoAlbumIdCounter = 1;
    this.bibleStudyResourceIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$vOQQkZZxZpKNUc51s5kVxO.qM9BztHQ4T./7NrHbVQIoQXQrX5e1q", // "admin123"
      email: "admin@ibiparnaiba.org",
      name: "Administrador"
    }).then(user => {
      this.updateUser(user.id, { role: "admin" });
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username.toLowerCase() === username.toLowerCase());
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email.toLowerCase() === email.toLowerCase());
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      id,
      ...userData,
      role: "member",
      avatar: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<Omit<User, "id">>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Post methods
  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    const post: Post = {
      id,
      ...postData,
      createdAt: now,
      updatedAt: now
    };
    this.posts.set(id, post);
    return post;
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPosts(limit = 100, offset = 0, category?: string, published?: boolean): Promise<Post[]> {
    let posts = Array.from(this.posts.values());
    
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    
    if (published !== undefined) {
      posts = posts.filter(post => post.isPublished === published);
    }
    
    // Sort by createdAt (newest first)
    posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return posts.slice(offset, offset + limit);
  }
  
  async updatePost(id: number, postData: Partial<Omit<Post, "id">>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      ...postData,
      updatedAt: new Date()
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }
  
  // Event methods
  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = {
      id,
      ...eventData,
      createdAt: new Date()
    };
    this.events.set(id, event);
    return event;
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEvents(
    limit = 100, 
    offset = 0, 
    startDate?: Date, 
    endDate?: Date, 
    category?: string
  ): Promise<Event[]> {
    let events = Array.from(this.events.values());
    
    if (startDate) {
      events = events.filter(event => event.startDate >= startDate);
    }
    
    if (endDate) {
      events = events.filter(event => event.startDate <= endDate);
    }
    
    if (category) {
      events = events.filter(event => event.category === category);
    }
    
    // Sort by startDate (closest first)
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    return events.slice(offset, offset + limit);
  }
  
  async updateEvent(id: number, eventData: Partial<Omit<Event, "id">>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  // Forum post methods
  async createForumPost(postData: InsertForumPost): Promise<ForumPost> {
    const id = this.forumPostIdCounter++;
    const now = new Date();
    const post: ForumPost = {
      id,
      ...postData,
      createdAt: now,
      updatedAt: now
    };
    this.forumPosts.set(id, post);
    return post;
  }
  
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }
  
  async getForumPosts(limit = 100, offset = 0, category?: string): Promise<ForumPost[]> {
    let posts = Array.from(this.forumPosts.values());
    
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    
    // Sort by updatedAt (newest first)
    posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    return posts.slice(offset, offset + limit);
  }
  
  async updateForumPost(id: number, postData: Partial<Omit<ForumPost, "id">>): Promise<ForumPost | undefined> {
    const post = this.forumPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      ...postData,
      updatedAt: new Date() 
    };
    
    this.forumPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteForumPost(id: number): Promise<boolean> {
    return this.forumPosts.delete(id);
  }
  
  // Forum comment methods
  async createForumComment(commentData: InsertForumComment): Promise<ForumComment> {
    const id = this.forumCommentIdCounter++;
    const now = new Date();
    const comment: ForumComment = {
      id,
      ...commentData,
      createdAt: now,
      updatedAt: now
    };
    this.forumComments.set(id, comment);
    return comment;
  }
  
  async getForumComments(postId: number): Promise<ForumComment[]> {
    const comments = Array.from(this.forumComments.values())
      .filter(comment => comment.postId === postId);
    
    // Sort by createdAt (oldest first for comments)
    comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    return comments;
  }
  
  async deleteForumComment(id: number): Promise<boolean> {
    return this.forumComments.delete(id);
  }
  
  // Resource methods
  async createResource(resourceData: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = {
      id,
      ...resourceData,
      createdAt: new Date()
    };
    this.resources.set(id, resource);
    return resource;
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async getResources(limit = 100, offset = 0, category?: string, isPublic?: boolean): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());
    
    if (category) {
      resources = resources.filter(resource => resource.category === category);
    }
    
    if (isPublic !== undefined) {
      resources = resources.filter(resource => resource.isPublic === isPublic);
    }
    
    // Sort by createdAt (newest first)
    resources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return resources.slice(offset, offset + limit);
  }
  
  async updateResource(id: number, resourceData: Partial<Omit<Resource, "id">>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { ...resource, ...resourceData };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }
  
  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }
  
  // Message methods
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = {
      id,
      ...messageData,
      isRead: false,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }
  
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessages(limit = 100, offset = 0, isRead?: boolean): Promise<Message[]> {
    let messages = Array.from(this.messages.values());
    
    if (isRead !== undefined) {
      messages = messages.filter(message => message.isRead === isRead);
    }
    
    // Sort by createdAt (newest first)
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return messages.slice(offset, offset + limit);
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
  
  // Photo album methods
  async createPhotoAlbum(albumData: InsertPhotoAlbum): Promise<PhotoAlbum> {
    const id = this.photoAlbumIdCounter++;
    const now = new Date();
    const album: PhotoAlbum = {
      id,
      ...albumData,
      createdAt: now,
      updatedAt: now
    };
    this.photoAlbums.set(id, album);
    return album;
  }
  
  async getPhotoAlbum(id: number): Promise<PhotoAlbum | undefined> {
    return this.photoAlbums.get(id);
  }
  
  async getPhotoAlbums(limit = 100, offset = 0): Promise<PhotoAlbum[]> {
    const albums = Array.from(this.photoAlbums.values());
    
    // Sort by createdAt (newest first)
    albums.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return albums.slice(offset, offset + limit);
  }
  
  async updatePhotoAlbum(id: number, albumData: Partial<Omit<PhotoAlbum, "id">>): Promise<PhotoAlbum | undefined> {
    const album = this.photoAlbums.get(id);
    if (!album) return undefined;
    
    const updatedAlbum = { 
      ...album, 
      ...albumData,
      updatedAt: new Date() 
    };
    
    this.photoAlbums.set(id, updatedAlbum);
    return updatedAlbum;
  }
  
  async deletePhotoAlbum(id: number): Promise<boolean> {
    return this.photoAlbums.delete(id);
  }
  
  // Bible study resource methods
  async createBibleStudyResource(resourceData: InsertBibleStudyResource): Promise<BibleStudyResource> {
    const id = this.bibleStudyResourceIdCounter++;
    const now = new Date();
    const resource: BibleStudyResource = {
      id,
      ...resourceData,
      createdAt: now,
      updatedAt: now,
      viewCount: 0
    };
    this.bibleStudyResources.set(id, resource);
    return resource;
  }
  
  async getBibleStudyResource(id: number): Promise<BibleStudyResource | undefined> {
    return this.bibleStudyResources.get(id);
  }
  
  async getBibleStudyResources(
    limit = 100, 
    offset = 0, 
    category?: string, 
    contentType?: string,
    isPublished?: boolean
  ): Promise<BibleStudyResource[]> {
    let resources = Array.from(this.bibleStudyResources.values());
    
    if (category) {
      resources = resources.filter(resource => resource.category === category);
    }
    
    if (contentType) {
      resources = resources.filter(resource => resource.contentType === contentType);
    }
    
    if (isPublished !== undefined) {
      resources = resources.filter(resource => resource.isPublished === isPublished);
    }
    
    // Sort by createdAt (newest first)
    resources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return resources.slice(offset, offset + limit);
  }
  
  async updateBibleStudyResource(id: number, resourceData: Partial<Omit<BibleStudyResource, "id">>): Promise<BibleStudyResource | undefined> {
    const resource = this.bibleStudyResources.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { 
      ...resource, 
      ...resourceData,
      updatedAt: new Date() 
    };
    
    this.bibleStudyResources.set(id, updatedResource);
    return updatedResource;
  }
  
  async deleteBibleStudyResource(id: number): Promise<boolean> {
    return this.bibleStudyResources.delete(id);
  }
}

export const storage = new MemStorage();
