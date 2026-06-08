<!-- @format -->

# LaperBang API

LaperBang Backend API Documentation

---

## Server

```
http://localhost:3000
```

Base URL: `http://localhost:3000/api/v1`

---

# Authentication

All endpoints (kecuali Register & Login) memerlukan **Bearer Token** di header:

```
Authorization: Bearer {JWT_TOKEN}
```

---

# Endpoints

## 1. Auth Module

### Register User

**POST** `/api/v1/auth/register`

Register user baru dengan email, password, dan role.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "consumer" | "vendor"
}
```

| Field    | Type   | Required | Description                    |
| -------- | ------ | -------- | ------------------------------ |
| email    | string | ✓        | Email user                     |
| password | string | ✓        | Password min 6 chars           |
| role     | string | ✓        | Role: `consumer` atau `vendor` |

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"user": {
			"id": "uuid-string",
			"email": "user@example.com",
			"name": null,
			"role": "consumer",
			"vendor_status": null,
			"additional_info": {},
			"created_at": "2024-01-15T10:30:00Z"
		},
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	}
}
```

#### Response (400 Bad Request)

```json
{
	"success": false,
	"error": "Missing fields"
}
```

---

### Login User

**POST** `/api/v1/auth/login`

Login dengan email dan password.

#### Request Body

```json
{
	"email": "user@example.com",
	"password": "password123"
}
```

| Field    | Type   | Required | Description   |
| -------- | ------ | -------- | ------------- |
| email    | string | ✓        | Email user    |
| password | string | ✓        | User password |

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"user": {
			"id": "uuid-string",
			"email": "user@example.com",
			"name": "John Doe",
			"role": "consumer",
			"vendor_status": null,
			"additional_info": {},
			"created_at": "2024-01-15T10:30:00Z"
		},
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	}
}
```

#### Response (401 Unauthorized)

```json
{
	"success": false,
	"error": "Invalid credentials"
}
```

---

### Get Self Profile

**GET** `/api/v1/auth/me`

Ambil data profile user yang sedang login.

#### Authentication

✓ Required (Bearer Token)

#### Parameters

None

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "uuid-string",
		"email": "user@example.com",
		"name": "John Doe",
		"role": "consumer",
		"vendor_status": null,
		"additional_info": {
			"phone": "08123456789"
		},
		"created_at": "2024-01-15T10:30:00Z"
	}
}
```

#### Response (404 Not Found)

```json
{
	"success": false,
	"error": "User not found"
}
```

---

### Update Profile User

**PUT** `/api/v1/auth/profile`

Update profile user (name, vendor_status, additional_info).

#### Authentication

✓ Required (Bearer Token)

#### Request Body

```json
{
	"name": "John Doe Updated",
	"vendor_status": "active",
	"additional_info": {
		"phone": "08123456789",
		"address": "Jl. Example No. 123"
	}
}
```

| Field           | Type   | Required | Description                                        |
| --------------- | ------ | -------- | -------------------------------------------------- |
| name            | string | ✗        | Nama user                                          |
| vendor_status   | string | ✗        | Status vendor: `active`, `moving`, `idle`, `close` |
| additional_info | object | ✗        | Data tambahan (custom object)                      |

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "uuid-string",
		"email": "user@example.com",
		"name": "John Doe Updated",
		"role": "vendor",
		"vendor_status": "active",
		"additional_info": {
			"phone": "08123456789",
			"address": "Jl. Example No. 123"
		},
		"created_at": "2024-01-15T10:30:00Z"
	}
}
```

---

## 2. Vendor Module

### Get Nearby Vendors

**GET** `/api/v1/vendors/nearby`

Ambil list vendor yang terdekat dari lokasi consumer.

#### Authentication

✗ Not required

#### Query Parameters

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| lat       | number | ✓        | Latitude lokasi consumer                     |
| lng       | number | ✓        | Longitude lokasi consumer                    |
| radius    | number | ✗        | Radius pencarian dalam meter (default: 5000) |

#### Example Request

```
GET /api/v1/vendors/nearby?lat=-6.200000&lng=106.816666&radius=5000
```

#### Response (200 OK)

```json
{
	"success": true,
	"data": [
		{
			"id": "vendor-uuid-1",
			"email": "vendor1@example.com",
			"name": "Vendor Warung Nasi",
			"role": "vendor",
			"vendor_status": "active",
			"additional_info": {
				"lat": -6.2,
				"lng": 106.816666
			},
			"created_at": "2024-01-15T10:30:00Z"
		},
		{
			"id": "vendor-uuid-2",
			"email": "vendor2@example.com",
			"name": "Vendor Toko Kelontong",
			"role": "vendor",
			"vendor_status": "active",
			"additional_info": {
				"lat": -6.202,
				"lng": 106.818666
			},
			"created_at": "2024-01-15T10:30:00Z"
		}
	]
}
```

#### Response (400 Bad Request)

```json
{
	"success": false,
	"error": "Missing coordinates"
}
```

---

### Update Vendor Location

**PATCH** `/api/v1/vendors/location`

Update lokasi real-time vendor (hanya untuk vendor).

#### Authentication

✓ Required (Bearer Token) - Vendor only

#### Request Body

```json
{
	"lat": -6.2,
	"lng": 106.816666
}
```

| Field | Type   | Required | Description              |
| ----- | ------ | -------- | ------------------------ |
| lat   | number | ✓        | Latitude (-90 s/d 90)    |
| lng   | number | ✓        | Longitude (-180 s/d 180) |

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "vendor-uuid",
		"email": "vendor@example.com",
		"name": "Vendor Warung Nasi",
		"additional_info": {
			"lat": -6.2,
			"lng": 106.816666
		}
	}
}
```

#### Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid coordinates" | "Coordinates out of range"
}
```

---

### Update Vendor Status

**PATCH** `/api/v1/vendors/status`

Update status vendor (active, moving, idle, close).

#### Authentication

✓ Required (Bearer Token) - Vendor only

#### Request Body

```json
{
	"status": "active"
}
```

| Field  | Type   | Required | Description                                 |
| ------ | ------ | -------- | ------------------------------------------- |
| status | string | ✓        | Status: `active`, `moving`, `idle`, `close` |

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "vendor-uuid",
		"email": "vendor@example.com",
		"name": "Vendor Warung Nasi",
		"role": "vendor",
		"vendor_status": "active"
	}
}
```

#### Response (400 Bad Request)

```json
{
	"success": false,
	"error": "Invalid status"
}
```

---

## 3. Request Module (Consumer)

### Create Request to Vendor

**POST** `/api/v1/requests`

Consumer membuat request ke vendor dengan lokasi real-time. Ini akan trigger clustering process.

#### Authentication

✓ Required (Bearer Token) - Consumer only

#### Request Body

```json
{
	"vendor_id": "uuid-vendor-id",
	"lat": -6.2,
	"lng": 106.816666
}
```

| Field     | Type   | Required | Description                            |
| --------- | ------ | -------- | -------------------------------------- |
| vendor_id | string | ✓        | UUID vendor yang dituju                |
| lat       | number | ✓        | Latitude lokasi consumer saat request  |
| lng       | number | ✓        | Longitude lokasi consumer saat request |

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "request-uuid",
		"user_id": "consumer-uuid",
		"vendor_id": "vendor-uuid",
		"lat": -6.2,
		"lng": 106.816666,
		"status": "pending",
		"created_at": "2024-01-15T10:30:00Z"
	}
}
```

#### Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Missing fields" | "Vendor unavailable"
}
```

---

## 4. Cluster Module

### Run Clustering Process

**POST** `/api/v1/clusters/run`

Jalankan proses clustering untuk membentuk hotspot dan mengelompokkan demand.

#### Authentication

✗ Not required

#### Parameters

None

#### Response (200 OK)

```json
{
	"success": true,
	"message": "Clustering completed"
}
```

#### Response (500 Server Error)

```json
{
	"success": false,
	"error": "Error message"
}
```

---

### Accept Cluster

**POST** `/api/v1/clusters/:cluster_id/accept`

Vendor menerima penawaran cluster.

#### Authentication

✓ Required (Bearer Token) - Vendor only

#### Path Parameters

| Parameter  | Type   | Required | Description  |
| ---------- | ------ | -------- | ------------ |
| cluster_id | string | ✓        | UUID cluster |

#### Example Request

```
POST /api/v1/clusters/cluster-uuid-123/accept
```

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "cluster-uuid",
		"vendor_id": "vendor-uuid",
		"status": "accepted",
		"requests": [
			{
				"id": "request-uuid-1",
				"user_id": "consumer-uuid-1",
				"lat": -6.2,
				"lng": 106.816666
			},
			{
				"id": "request-uuid-2",
				"user_id": "consumer-uuid-2",
				"lat": -6.201,
				"lng": 106.817666
			}
		]
	}
}
```

---

### Reject Cluster

**POST** `/api/v1/clusters/:cluster_id/reject`

Vendor menolak penawaran cluster.

#### Authentication

✓ Required (Bearer Token)

#### Path Parameters

| Parameter  | Type   | Required | Description  |
| ---------- | ------ | -------- | ------------ |
| cluster_id | string | ✓        | UUID cluster |

#### Example Request

```
POST /api/v1/clusters/cluster-uuid-123/reject
```

#### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "cluster-uuid",
		"vendor_id": "vendor-uuid",
		"status": "rejected"
	}
}
```

# System Flow

1. User Register or login
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
