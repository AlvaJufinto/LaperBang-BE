<!-- @format -->

# LaperBang API

LaperBang Backend API Documentation

---

## Server

```
http://localhost:3000
```

---

# Auth

## Google Login

**POST** `/api/v1/auth/google`

Login atau register user menggunakan Google ID Token.

### Request Body

```json
{
	"credential": "string"
}
```

### Responses

**200 - Success**

```json
{
	"success": true,
	"data": {
		"user": {},
		"token": "string"
	}
}
```

**400 - Bad Request**

```json
{
	"success": false,
	"error": "missing or invalid credential"
}
```

**500 - Server Error**

```json
{
	"success": false,
	"error": "internal server error"
}
```

---

# Clusters

## Run Clustering

**POST** `/api/v1/clusters/run`

Menjalankan proses clustering demand untuk membentuk hotspot.

### Responses

**200 - Success**

```json
{
	"success": true,
	"message": "Clustering completed"
}
```

**500 - Error**

```json
{
	"success": false,
	"error": "string"
}
```

---

# Requests

## Create Request

**POST** `/api/v1/requests`

User membuat request ke vendor dengan lokasi realtime.

### Request Body

```json
{
	"vendor_id": "uuid-vendor-id",
	"lat": -6.2,
	"lng": 106.816666
}
```

### Responses

**200 - Created**

```json
{
	"success": true,
	"data": {}
}
```

**400 - Validation Error**

```json
{
	"success": false,
	"error": "Missing fields or vendor unavailable"
}
```

**500 - Server Error**

```json
{
	"success": false,
	"error": "internal server error"
}
```

---

# Vendors

## Update Live Location

**PATCH** `/api/v1/vendors/location`

Update posisi real-time vendor.

### Request Body

```json
{
	"lat": -6.2,
	"lng": 106.816666
}
```

### Responses

**200 - Success**

```json
{
	"success": true,
	"message": "Location updated"
}
```

**400 - Invalid Input**

```json
{
	"success": false,
	"error": "invalid coordinates"
}
```

**500 - Server Error**

```json
{
	"success": false,
	"error": "internal server error"
}
```

---

## Get Nearby Vendors

**GET** `/api/v1/vendors/nearby`

Mengambil vendor terdekat berdasarkan lokasi user.

### Query Parameters

- `lat` (required): number
- `lng` (required): number
- `radius` (optional): number (meter, default 5000)

### Example

```
/api/v1/vendors/nearby?lat=-6.2&lng=106.8&radius=5000
```

### Responses

**200 - Success**

```json
{
	"success": true,
	"data": [{}]
}
```

**500 - Server Error**

```json
{
	"success": false,
	"error": "internal server error"
}
```

---

## Update Vendor Status

**PATCH** `/api/v1/vendors/status`

Mengubah status vendor.

### Request Body

```json
{
	"status": "active"
}
```

### Valid Status Example

- active
- inactive
- busy
- offline

### Responses

**200 - Success**

```json
{
	"success": true,
	"message": "Status updated"
}
```

**400 - Bad Request**

```json
{
	"success": false,
	"error": "missing status"
}
```

**500 - Server Error**

```json
{
	"success": false,
	"error": "internal server error"
}
```

---

# System Flow

1. User login via Google OAuth
2. User fetch nearby vendors
3. User sends request to vendor
4. Request masuk ke aggregation layer
5. System menjalankan clustering demand
6. Hotspot terbentuk
7. Vendor diarahkan ke hotspot
8. Vendor update lokasi real-time

---

# Architecture Notes

- Real-time location tracking required (Pusher)
- Geospatial query required for nearby vendors
- Clustering likely batch or event-driven job
- Request system acts as demand aggregator

---

# Future Improvements

- Add auth middleware documentation
- Add request schema validation detail
- Add Pusher event spec
