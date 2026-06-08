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

## Login

**POST** `/api/v1/auth/register`

Login with username and password.

### Request Body

```json
{
	"credential": "string"
}
```

## Register

**POST** `/api/v1/auth/register`

## Edit Profile

**PUT** `/api/v1/auth/profile`

## Get Self Profile

**GET** `/api/v1/auth/me`

---

# Consumer

## Request (call) Vendor

**POST** `/api/v1/requests`

## Get Nearby Vendor Location

**GET** `/api/v1/vendors/nearby`

---

# Vendor

## Update Vendor Location

**PATCH** `/api/v1/vendors/location`

## Update Vendor Status

**PATCH** `/api/v1/vendors/status`

## Accept Available Cluster

**POST** `/api/v1/clusters/:cluster_id/accept`

## Reject Available Cluster

**POST** `/api/v1/clusters/:cluster_id/reject`

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
