// Change this value when the Spring Boot API is hosted elsewhere.
export const API_BASE_URL = window.UNILIFE_API_BASE || "http://localhost:8080";

export const API_ENDPOINTS = Object.freeze({
    rooms: "/roms",
    motels: "/motels",
    universities: "/universities",
    roomImages: roomId => `/room-images/get-room-image/${encodeURIComponent(roomId)}`,
    roomServices: roomId => `/room-service/get-room-service/${encodeURIComponent(roomId)}`,
    roomAmenities: roomId => `/room-amenity/get-room-amenity/${encodeURIComponent(roomId)}`,
    signIn: "/users/auth/login",
    signUp: "/users/auth/register",
    logout: "/users/auth/logout",
    user: userId => `/users/${encodeURIComponent(userId)}`,
    userRooms: userId => `/user-room/users/${encodeURIComponent(userId)}`
});

export const STORAGE_KEYS = Object.freeze({
    token: "unitlife.token",
    userId: "unitlife.userId",
    userName: "unitlife.userName",
    favorites: "unitlife.favorites"
});
