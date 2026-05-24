# Backend Connection Setup - COMPLETE ✅

## What's Been Done

### 1. **Authentication System** ✅
- Created `AuthContext` to manage authentication state globally
- Users are stored in localStorage after login
- Automatic token injection in all API requests
- 401 errors automatically redirect to login

### 2. **Protected Routes** ✅
- Login/Register are public pages
- All other routes require authentication
- Users trying to access protected routes without login are redirected to `/login`
- Loading state shown while checking authentication

### 3. **Login & Register Pages** ✅
- **Login Page** - Calls `/api/auth/login` with email/password
- **Register Page** - Calls `/api/auth/register` with name, email, phone, password, role
- Both pages properly validate input and show error messages
- Token is automatically saved after successful login

### 4. **Dashboard** ✅
- Removed all mock data
- Connected to real backend APIs:
  - `GET /api/analytics/dashboard-summary` - KPI cards
  - `GET /api/analytics/revenue-trend` - Revenue chart
  - `GET /api/performance/ranking` - Team performance
  - `GET /api/analytics/conversion-funnel` - Conversion funnel
- Displays logged-in user's name
- Shows loading state while fetching data

## How to Test

### Step 1: Start Backend Server
```bash
cd backend
npm start
```
Backend should be running on `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd manufacturing-crm-hub
npm run dev
```
Frontend will open on `http://localhost:5173`

### Step 3: Test the Flow
1. **You'll land on the LOGIN page** ✅
2. Enter your credentials and click "Sign In"
3. If credentials are correct, you're logged in and redirected to Dashboard
4. Dashboard shows your real data from the backend
5. Try refreshing the page - you'll stay logged in (token persisted in localStorage)
6. Click logout from settings to clear token

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Auth state management
├── config/
│   └── api.ts                    # API config & token management
├── services/
│   ├── api.ts                    # Axios instance with interceptors
│   ├── authService.ts            # Login/Register API calls
│   ├── analyticsService.ts       # Dashboard data APIs
│   └── ... (other services)
├── routes/
│   ├── __root.tsx                # Protected root layout
│   ├── login.tsx                 # Real login with API
│   ├── register.tsx              # Real registration with API
│   └── index.tsx                 # Dashboard with real data
└── types/
    └── index.ts                  # TypeScript types
```

## What Happens When User Logs In

1. User enters email/password on login page
2. `authService.login()` calls `/api/auth/login` on backend
3. Backend returns `{ token, user }`
4. Token stored in localStorage via `setAuthToken(token)`
5. User data stored in AuthContext
6. User redirected to Dashboard (`/`)
7. Dashboard automatically loads real data from APIs

## What Happens on Page Refresh

1. App loads and checks localStorage for token
2. If token exists, AuthContext is initialized with it
3. User stays logged in and can access protected routes
4. If no token, user is redirected to login

## Testing Login with Your Backend

Make sure your backend has a test user. If not, create one via the register page first:

**Register:**
- Name: `John Doe`
- Email: `john@example.com`
- Phone: `+91 98765 12345`
- Password: `password123`
- Role: `BDA Employee`

**Then Login:**
- Email: `john@example.com`
- Password: `password123`

## If You Get Errors

### "Connection refused" error
- Make sure backend is running on `http://localhost:5000`
- Check `.env.development` has correct `VITE_API_URL`

### "Invalid credentials" error
- Make sure user exists in your backend database
- Check backend auth routes are working

### "CORS error"
- Backend already has CORS enabled
- Should not be an issue

## Next Steps (What You Can Do)

1. **Update other pages** to use real APIs:
   - Leads page - use `leadService`
   - Pipeline page - use `pipelineService`
   - Followups page - use `followupService`
   - Communications page - use `communicationService`
   - Analytics page - use `analyticsService`
   - Team page - use `performanceService`
   - Reports page - use `reportService`
   - Settings page - use `settingsService`

2. **Add logout functionality**:
   ```typescript
   import { useAuth } from '@/services';
   const { logout } = useAuth();
   logout(); // Clears token and redirects to login
   ```

3. **Use auth state in components**:
   ```typescript
   import { useAuth } from '@/context/AuthContext';
   const { user, isAuthenticated } = useAuth();
   ```

## Quick Reference

**Import and use any service:**
```typescript
import { 
  authService, leadService, analyticsService, 
  performanceService, reportService, settingsService 
} from "@/services";

// Example: Get all leads
const leads = await leadService.getAll();
```

**Handle errors:**
```typescript
try {
  const data = await leadService.getAll();
} catch (error) {
  console.error("Error:", error.message);
}
```

You're all set! The app now opens on the login page and connects to your backend. 🚀
