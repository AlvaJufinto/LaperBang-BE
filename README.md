<!-- @format -->

# LaperBang API Docs

---

## Base URL

```
http://localhost:3000
```

---

## Auth

### Google Login

**Endpoint**

```
POST /api/v1/auth/google
```

**Description**
Login atau register user menggunakan Google ID Token.

**Request Body**

```json
{
	"credential": "string"
}
```

**Success Response (200)**

```json
{
	"success": true,
	"data": {
		"user": {},
		"token": "string"
	}
}
```

**Error Responses**

- 400: Missing credential / invalid token
- 500: Server error

---

## Clusters

### Run Clustering Process

**Endpoint**

```
POST /api/v1/clusters/run
```

**Description**
Menjalankan proses clustering demand untuk membentuk hotspot.

**Response (200)**

```json
{
	"success": true,
	"message": "Clustering completed"
}
```

**Error Response (500)**

```json
{
	"success": false,
	"error": "string"
}
```

---

## Requests

### Create Request

**Endpoint**

```
POST /api/v1/requests
```

**Description**
Membuat request dari user ke vendor.

**Note**: payload detail belum didefinisikan.

---

## Vendors

### Update Live Location

**Endpoint**

```
PATCH /api/v1/vendors/location
```

**Description**
Update posisi real-time vendor untuk tracking.

---

### Get Nearby Vendors

**Endpoint**

```
GET /api/v1/vendors/nearby
```

**Description**
Mengambil vendor terdekat berdasarkan lokasi user.

**Note**: kemungkinan membutuhkan lat/lng query params.

---

### Update Vendor Status

**Endpoint**

```
PATCH /api/v1/vendors/status
```

**Description**
Mengubah status vendor (aktif / nonaktif / available / busy).

---

## System Flow

1. User login via Google OAuth
2. User melihat vendor terdekat
3. User membuat request ke vendor
4. Request masuk ke aggregation system
5. System menjalankan clustering demand
6. Hotspot terbentuk dari demand
7. Vendor diarahkan ke hotspot
8. Vendor update lokasi secara real-time

---

## Notes

- Endpoint `/requests` belum memiliki detail payload
- Sistem berbasis real-time location tracking
- Cocok untuk event-driven + geospatial architecture
- Disarankan integrasi WebSocket (Pusher / Socket.io)

---

## Future Improvements

- Real-time event broadcasting
