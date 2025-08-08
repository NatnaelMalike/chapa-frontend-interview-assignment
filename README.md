# Chapa Frontend Test Project 

A Next.js application demonstrating integration with Chapa's payment API, featuring payment initialization, bank transfers, and transaction management with role-based authentication.

## 🌐 Live Demo

**Live Application**: [https://chapa-frontend-mk.vercel.app](https://chapa-frontend-mk.vercel.app)

> Access the live demo using the test credentials provided in the testing section below.

## 🚀 Features

- **Payment Processing**: Initialize payments using Chapa's payment gateway
- **Bank Transfers**: Initiate transfers to Ethiopian banks
- **Bank Directory**: Fetch and display available banks
- **Authentication System**: Role-based access control (User, Admin, SuperAdmin)
- **Transaction History**: View and manage payment transactions
- **Responsive Design**: Mobile-first responsive UI with dark/light theme support

## 🔗 Chapa API Endpoints Used

This application integrates with **3 main Chapa API endpoints** plus additional webhook and callback handlers:

### 1. Payment Initialize (`/v1/transaction/initialize`)
- **Purpose**: Initialize payment transactions
- **Method**: POST
- **Implementation**: `app/api/chapa/initialize/route.ts`
- **Frontend Usage**: Payment form in user dashboard
- **Request Body**:
  ```json
  {
    "amount": "100.00",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "0912345678",
    "tx_ref": "tx-1234567890-abc123",
    "callback_url": "https://yourapp.com/api/chapa/payment/callback",
    "return_url": "https://yourapp.com/thank-you"
  }
  ```

### 2. Banks List (`/v1/banks`)
- **Purpose**: Fetch available Ethiopian banks for transfers
- **Method**: GET
- **Implementation**: `app/api/chapa/banks/route.ts`
- **Frontend Usage**: Bank selection dropdown in transfer form
- **Response**: Array of bank objects with id, name, and code

### 3. Transfer Initialize (`/v1/transfers`)
- **Purpose**: Initiate bank transfers
- **Method**: POST
- **Implementation**: `app/api/chapa/transfers/initiate/route.ts`
- **Frontend Usage**: Transfer form in admin/superadmin dashboards
- **Request Body**:
  ```json
  {
    "account_number": "1234567890",
    "account_name": "Natnael Malike",
    "amount": "1000.00",
    "bank_code": "bank_id"
  }
  ```

### Additional API Routes

#### 4. Payment Callback Handler
- **Purpose**: Handle payment completion callbacks from Chapa
- **Method**: GET
- **Implementation**: `app/api/chapa/payment/callback/route.ts`
- **Usage**: Processes payment verification and status updates

#### 5. Webhook Handler
- **Purpose**: Receive real-time payment notifications from Chapa
- **Method**: POST
- **Implementation**: `app/api/chapa/webhook/route.ts`
- **Usage**: Handles webhook events for payment status changes

## 🏗️ Project Structure

```
chapa-frontend-interview-assignment/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts    # User login
│   │   │   ├── logout/route.ts   # User logout
│   │   │   └── me/route.ts       # Get current user
│   │   └── chapa/               # Chapa API proxy endpoints
│   │       ├── initialize/route.ts      # Payment initialization
│   │       ├── banks/route.ts           # Banks list
│   │       ├── transfers/initiate/route.ts  # Transfer initiation
│   │       ├── payment/callback/route.ts    # Payment callback
│   │       └── webhook/route.ts         # Webhook handler
│   ├── dashboard/page.tsx        # User dashboard
│   ├── admin/page.tsx            # Admin dashboard
│   ├── superadmin/page.tsx       # SuperAdmin dashboard
│   ├── thank-you/page.tsx        # Payment success page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing/Login page
├── components/                   # React Components
│   ├── forms/                    # Form components
│   │   ├── login-form.tsx        # Authentication form
│   │   ├── payment-form.tsx      # Payment initialization
│   │   ├── transfer-form.tsx     # Bank transfer form
│   │   └── add-admin-form.tsx    # Admin management form
│   ├── ui/                       # Reusable UI components (shadcn/ui)
│   ├── dashboard-sidebar.tsx     # Navigation sidebar
│   ├── transaction-history.tsx   # Transaction display
│   ├── role-guard.tsx            # Route protection
│   └── [other components]
├── hooks/                        # Custom React hooks
│   ├── useApiCall.ts             # Generic API call hook
│   └── useChapaApi.ts            # Chapa-specific API hooks
├── store/                        # State management
│   └── auth-store.ts             # Zustand authentication store
├── services/                     # API service layer
│   └── chapa-api.ts              # Chapa API integration
├── schemas/                      # Zod validation schemas
│   ├── login-schema.ts           # Login form validation
│   ├── payment-schema.ts         # Payment form validation
│   └── transfer-schema.ts        # Transfer form validation
├── data/                         # Mock data
│   ├── users.ts                  # Test users and credentials
│   └── transactions.ts           # Sample transactions
├── types/                        # TypeScript type definitions
├── .env                          # Environment variables
└── package.json                  # Dependencies and scripts
```

## 🔐 Authentication Flow

The application implements a secure authentication system with HTTP-only cookies:

### Authentication Process
1. **User Login**: User submits credentials via login form
2. **Server Validation**: API validates credentials against mock user database
3. **Cookie Creation**: Server sets HTTP-only cookie with user ID
4. **User Data Return**: Sanitized user data (without password) returned to frontend
5. **State Management**: User data stored in Zustand store (no persistent browser storage)

### Key Security Features
- **HTTP-Only Cookies**: Authentication token stored in secure HTTP-only cookie
- **No Client-Side Storage**: No sensitive data persisted in localStorage/sessionStorage
- **Password Sanitization**: Passwords never sent to frontend
- **Session Management**: Configurable session duration with "Remember Me" option
- **Role-Based Access**: Route protection based on user roles

### Authentication API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user retrieval

### Test Credentials
```javascript
// Regular User
Email: gelila.y@email.com
Password: g@user

// Admin User  
Email: samrawit.a@admin.com
Password: s@admin

// Super Admin
Email: kebede.s@superadmin.com
Password: k@superadmin
```

### State Management
- **Authentication**: Zustand store (`store/auth-store.ts`)
- **API Calls**: Custom hooks with error handling (`hooks/useChapaApi.ts`)
- **Form Validation**: React Hook Form with Zod schemas

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Chapa API credentials (test/live)

### 1. Clone the Repository
```bash
git clone <https://github.com/NatnaelMalike/chapa-frontend-interview-assignment.git>
cd chapa-frontend-interview-assignment
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Chapa API Configuration
CHAPA_SECRET_KEY=CHASECK_TEST-your-secret-key-here

# Callback URLs (update with your domain)
CALLBACK_URL=http://localhost:3000/api/chapa/payment/callback
RETURN_URL=http://localhost:3000/thank-you
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing the Application

### Authentication
The application includes test credentials for different user roles:


### Testing Payment Flow

1. **Login** as any user role
2. **Navigate** to the dashboard
3. **Fill Payment Form**:
   - Amount: Fixed at 100 ETB
   - Enter your email, first name, last name
   - Add phone number (optional)
4. **Click "Initialize Payment"**
5. **Redirect** to Chapa checkout page
6. **Complete Payment** using test card details
7. **Return** to thank you page

### Testing Bank Transfer (ASuperAdmin only)

1. **Login** as superadmin
2. **Navigate** to transfer section
3. **Select Bank** from dropdown (auto-populated from Chapa API)
4. **Enter Account Details**:
   - Account number
   - Account name
   - Amount (fixed at 1000 ETB)
5. **Submit Transfer**
6. **View Response** with transfer status

### Testing Bank List API

The banks dropdown automatically fetches from Chapa's banks endpoint when the transfer form loads. You can verify this by:

1. Opening browser dev tools
2. Going to Network tab
3. Loading the admin/superadmin page
4. Observing the `/api/chapa/banks` request

## 🔧 API Integration Details

### Error Handling
- All API calls include comprehensive error handling
- Loading states are managed for better UX
- Error messages are displayed to users

### Security
- API keys are stored securely in environment variables
- All Chapa API calls are proxied through Next.js API routes

### Response Handling
- Payment initialization redirects to Chapa checkout
- Transfer responses display status and confirmation details
- Callback handling for payment verification

## 📱 User Roles & Permissions

- **User**: Can initialize payments and view transaction history
- **Admin**: view users, view payments, and view banks
- **SuperAdmin**: Full access including admin management

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Loading States**: Visual feedback during API calls
- **Form Validation**: Real-time validation with error messages
- **Transaction History**: Paginated transaction display

## 🚀 Deployment

### Environment Variables for Production
```env
CHAPA_SECRET_KEY=CHASECK_LIVE-your-live-secret-key
CALLBACK_URL=https://yourdomain.com/api/chapa/payment/callback
RETURN_URL=https://yourdomain.com/thank-you
```

### Build Commands
```bash
npm run build
npm start
```

## 📝 Notes on Integration

### Chapa API Considerations
- **Test Mode**: Uses test credentials for development
- **Webhook Security**: Implement signature verification for production
- **Rate Limiting**: Consider implementing rate limiting for API calls
- **Error Codes**: Handle specific Chapa error codes appropriately

### Known Limitations
- Transfer functionality requires live API key for testing
- Some bank codes may not be available in test mode
- Webhook verification is simplified for demo purposes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for demonstration purposes as part of the Chapa frontend interview assignment.

---

**Built with**: Next.js 15, TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod