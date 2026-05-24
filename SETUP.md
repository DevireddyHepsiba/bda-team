# Manufacturing CRM Hub - Setup & Deployment Guide

## ⚡ Quick Start

### Backend Setup

```bash
cd backend
npm install
npm run dev  # or `npm start` for production
```

The backend will start on `http://localhost:5000`

✓ Check health: `http://localhost:5000/health`

### Frontend Setup

```bash
cd manufacturing-crm-hub
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
VITE_API_URL=http://localhost:5000
NODE_ENV=development
```

### Frontend (.env or .env.development)

```env
VITE_API_URL=http://localhost:5000
```

---

## 📋 Features Implemented

### Backend Improvements
✅ **Error Handling**
- Global error middleware
- Async error wrapper utilities
- Unhandled rejection handlers
- Proper HTTP status codes

✅ **Security**
- Helmet.js for secure headers
- Configurable CORS
- Password hashing with bcryptjs
- JWT authentication

✅ **Database**
- Connection pooling (maxPoolSize: 10)
- Timeout handling
- Proper connection logging

✅ **Monitoring**
- Request logging with timestamps
- Health check endpoint (`/health`)
- Performance metrics
- Detailed error logging

### Frontend Improvements
✅ **API Communication**
- Automatic retry logic (up to 3 retries)
- Exponential backoff
- Increased timeout to 15 seconds
- Request/Response interceptors

✅ **Error Handling**
- Structured error responses
- Graceful error display
- Automatic token refresh on 401
- Enhanced logging

✅ **Performance**
- Token caching
- Request debouncing
- Error boundary handling

---

## 🚀 Deployment Checklist

### Before Production

- [ ] Update `.env` with production URLs
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI
- [ ] Generate secure `JWT_SECRET`
- [ ] Update CORS origins
- [ ] Enable HTTPS
- [ ] Set up logging/monitoring
- [ ] Test all API endpoints
- [ ] Run full test suite

### Environment Variables

```env
# Production
NODE_ENV=production
MONGO_URI=mongodb+srv://prod-user:prod-password@prod-cluster/prod-db?retryWrites=true&w=majority
JWT_SECRET=generate-a-strong-secret-key
PORT=5000
VITE_API_URL=https://api.yourdomain.com
```

---

## 🐛 Troubleshooting

### Issue: "API Error: timeout of 10000ms exceeded"

**Solutions:**
1. Ensure backend is running: `npm run dev` in `backend/`
2. Check MongoDB connection in `.env`
3. Verify `VITE_API_URL` matches backend URL
4. Check firewall/network connectivity
5. Review backend logs for errors

### Issue: "Failed to load resource: 404"

**Solutions:**
1. Ensure all required routes are mounted in `server.js`
2. Check file paths in imports
3. Verify middleware order in `server.js`

### Issue: "Cannot find module"

**Solutions:**
1. Run `npm install` in the affected directory
2. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check import paths

### Issue: MongoDB connection failures

**Solutions:**
1. Verify MongoDB URI includes database name
2. Check IP whitelist in MongoDB Atlas
3. Ensure credentials are correct
4. Test connection string separately

### Issue: CORS errors

**Solutions:**
1. Update `corsOptions.origin` to your frontend URL
2. Ensure credentials flag is set correctly
3. Check allowed headers and methods

---

## 📊 API Endpoints

### Health & Status
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Business Features
- `GET/POST /api/leads` - Leads management
- `GET/POST /api/pipeline` - Pipeline management
- `GET/POST /api/followups` - Follow-ups management
- `GET/POST /api/communications` - Communications management
- `GET /api/analytics` - Analytics data
- `GET /api/performance` - Performance metrics
- `GET /api/reports` - Generate reports
- `GET/POST /api/settings` - User settings

---

## 🔍 Monitoring & Logs

### Backend Logs
- Startup confirmation
- Database connection status
- Request method, URL, and response time
- Error stack traces with timestamps

### Frontend Logs
- API request/response details
- Error messages with context
- Authentication state changes
- Performance metrics

Access frontend logs via console (DevTools F12)

---

## 🏗️ Architecture

```
backend/
├── controllers/      - Request handlers
├── middleware/       - Auth, validation
├── model/           - Mongoose schemas
├── routes/          - API endpoints
├── services/        - Business logic
├── utils/           - Helper functions
└── server.js        - Express app

manufacturing-crm-hub/
├── src/
│   ├── components/  - React components
│   ├── config/      - Configuration
│   ├── context/     - React Context
│   ├── hooks/       - Custom hooks
│   ├── routes/      - Page routes
│   ├── services/    - API services
│   ├── types/       - TypeScript types
│   └── utils/       - Utilities
```

---

## 📦 Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT auth
- bcryptjs: Password hashing
- cors: CORS middleware
- helmet: Security headers
- dotenv: Environment config

### Frontend
- @tanstack/react-router: Routing
- @tanstack/react-query: Data fetching
- axios: HTTP client
- zod: Schema validation
- tailwindcss: Styling

---

## ✅ Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd manufacturing-crm-hub
npm test
```

---

## 📝 License

ISC

---

## 💡 Tips for Scalability

1. **Database Optimization**
   - Add indexes on frequently queried fields
   - Implement pagination for large datasets
   - Use aggregation pipelines for complex queries

2. **Caching**
   - Implement Redis for session management
   - Cache API responses
   - Use React Query for client-side caching

3. **API Optimization**
   - Implement rate limiting
   - Add request validation middleware
   - Use response compression

4. **Frontend**
   - Lazy load components
   - Code splitting by route
   - Optimize bundle size

5. **Monitoring**
   - Set up application logging (Winston, Pino)
   - Monitor error rates
   - Track API performance metrics
   - Use APM tools (New Relic, DataDog)

---

Need help? Check the error logs and ensure both backend and frontend are running.
