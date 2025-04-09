
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { storage } from './storage';

// Configuração do cliente OAuth2
const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

// Configurar o drive
const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function uploadToDrive(file: Express.Multer.File, folder?: string) {
  try {
    const fileMetadata = {
      name: file.originalname,
      parents: folder ? [folder] : undefined
    };

    const media = {
      mimeType: file.mimetype,
      body: file.buffer
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink'
    });

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink
    };
  } catch (error) {
    console.error('Error uploading to drive:', error);
    throw error;
  }
}

export async function getFileFromDrive(fileId: string) {
  try {
    const file = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, {
      responseType: 'stream'
    });
    
    return file.data;
  } catch (error) {
    console.error('Error getting file from drive:', error);
    throw error;
  }
}
