import api from './axios';

// Auth
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getMyProfile = () => api.get('/auth/me');

// Events
export const getEvents = (params) => api.get('/events', { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const toggleEventRegistration = (id, isOpen) =>
  api.patch(`/events/${id}/toggle-registration`, { isOpen });
export const updateEventStatus = (id, status) =>
  api.patch(`/events/${id}/status`, { status });

// Multi-media Gallery Endpoints
export const addGalleryMedia = (eventId, payload) =>
  api.post(`/events/${eventId}/gallery`, payload);
export const removeGalleryMedia = (eventId, mediaId) =>
  api.delete(`/events/${eventId}/gallery/${mediaId}`);

// Registrations & Tickets
export const registerForEvent = (eventId) => api.post(`/registrations/${eventId}`);
export const getMyTickets = () => api.get('/registrations/my-tickets');
export const verifyTicket = (ticketCode) =>
  api.post('/registrations/verify-ticket', { ticketCode });
export const getEventRoster = (eventId) =>
  api.get(`/registrations/event/${eventId}/roster`);
export const getAttendanceExportUrl = (eventId) =>
  `${api.defaults.baseURL}/registrations/event/${eventId}/export-csv`;

// Certificates
export const getCertificateDownloadUrl = (eventId, rollNumber) =>
  `${api.defaults.baseURL}/certificates/download?eventId=${eventId}&rollNumber=${rollNumber}`;

// Posts / Community
export const getPosts = (params) => api.get('/posts', { params });
export const createPost = (data) => api.post('/posts', data);
export const toggleUpvote = (postId) => api.post(`/posts/${postId}/upvote`);
export const addComment = (postId, content) =>
  api.post(`/posts/${postId}/comment`, { content });

// Feedback
export const submitFeedback = (eventId, data) => api.post(`/feedback/${eventId}`, data);
export const getEventFeedback = (eventId) => api.get(`/feedback/${eventId}`);

// Gallery
export const getGallery = (params) => api.get('/gallery', { params });

// Team & Roster (Public + Admin Management)
export const getTeam = () => api.get('/team');
export const addTeamMember = (data) => api.post('/team', data);
export const deleteTeamMember = (id) => api.delete(`/team/${id}`);

// Admin Panel Roster & Role Update Endpoints
export const getAllTeamMembers = () => api.get('/team/all-members');
export const updateMemberRole = (rollNumber, payload) =>
  api.put(`/team/role/${rollNumber}`, payload);
export const updateMemberAvatar = (rollNumber, payload) =>
  api.patch(`/team/avatar/${rollNumber}`, payload);

export default api;