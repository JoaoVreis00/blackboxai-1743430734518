// API client for Karate Media backend
const KarateMediaAPI = {
    // Get all media with optional filters
    async getAllMedia(filters = {}) {
        try {
            const query = new URLSearchParams();
            if (filters.belt) query.append('belt', filters.belt);
            if (filters.category) query.append('category', filters.category);
            
            const response = await fetch(`/api/media?${query.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch media');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Add new media
    async addMedia(media) {
        try {
            const response = await fetch('/api/media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(media)
            });
            if (!response.ok) throw new Error('Failed to add media');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Update existing media
    async updateMedia(id, media) {
        try {
            const response = await fetch(`/api/media/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(media)
            });
            if (!response.ok) throw new Error('Failed to update media');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Delete media
    async deleteMedia(id) {
        try {
            const response = await fetch(`/api/media/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete media');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// Make available globally
window.KarateMediaAPI = KarateMediaAPI;