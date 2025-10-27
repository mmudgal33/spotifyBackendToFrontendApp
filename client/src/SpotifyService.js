// SpotifyService.js - Service layer

import { config } from './Constants';
const API = config.api;




class SpotifyService {
    constructor() {
      // this.baseURL = 'http://127.0.0.1:5000';
      this.baseURL = 'https://spotifybackendtofrontendapp.onrender.com';
      // this.baseURL = `${API}`;
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  
    async request(endpoint, options = {}) {
      const config = {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
  
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        await this.refreshAccessToken();
        return this.request(endpoint, options);
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.json();
    }
  
    async refreshAccessToken() {
      try {
        const response = await fetch(`${this.baseURL}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
  
        const data = await response.json();
        
        if (data.accessToken) {
          this.setAccessToken(data.accessToken);
          return data.accessToken;
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    }
  
    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem('spotify_access_token', token);
    }
  
    setRefreshToken(token) {
      this.refreshToken = token;
      localStorage.setItem('spotify_refresh_token', token);
    }
  
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
    }
  
    // User methods
    async getCurrentUser() {
      return this.request('/me');
    }
  
    // Search methods
    async search(query, types = ['track']) {
      return this.request(`/search?q=${encodeURIComponent(query)}&type=${types.join(',')}`);
    }
  
    // Playlist methods
    async getUserPlaylists() {
      return this.request('/playlists');
    }
  
    async createPlaylist(name, description = '', isPublic = false) {
      return this.request('/playlists', {
        method: 'POST',
        body: JSON.stringify({ name, description, public: isPublic }),
      });
    }
  
    // Player methods
    async getPlaybackState() {
      return this.request('/player');
    }
  
    async play() {
      return this.request('/player/play', { method: 'PUT' });
    }
  
    async pause() {
      return this.request('/player/pause', { method: 'PUT' });
    }
  
    // Track methods
    async getTrack(id) {
      return this.request(`/tracks/${id}`);
    }
  
    // Top items
    async getTopTracks(limit = 20, timeRange = 'medium_term') {
      return this.request(`/top/tracks?limit=${limit}&time_range=${timeRange}`);
    }
  
    async getTopArtists(limit = 20, timeRange = 'medium_term') {
      return this.request(`/top/artists?limit=${limit}&time_range=${timeRange}`);
    }
  }
  
  export const spotifyService = new SpotifyService();