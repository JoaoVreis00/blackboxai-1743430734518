// IndexedDB helper functions
const DB_NAME = 'karateMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media';

// Make functions available globally
window.KarateMediaDB = {
    getAllMedia,
    deleteMedia,
    updateMedia,
    addMedia
};

// Open or create the database
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject('Error opening database');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Add media to database
async function addMedia(media) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.add(media);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error('Error adding media:', event.target.error);
                reject('Error saving media');
            };
        });
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}

// Get all media from database
async function getAllMedia() {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error('Error getting media:', event.target.error);
                reject('Error loading media');
            };
        });
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}

// Update media in database
async function updateMedia(media) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.put(media);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error('Error updating media:', event.target.error);
                reject('Error updating media');
            };
        });
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}

// Delete media from database
async function deleteMedia(id) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error('Error deleting media:', event.target.error);
                reject('Error deleting media');
            };
        });
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}

// Export not needed anymore since we're using global object
