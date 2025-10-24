# Tourism and Travel Management System - Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Validation Mechanisms](#validation-mechanisms)
3. [CRUD Operations](#crud-operations)
4. [Design Patterns](#design-patterns)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Security Implementation](#security-implementation)
8. [Database Design](#database-design)

---

## Project Overview

The Tourism and Travel Management System is a full-stack web application built with:
- **Backend**: Spring Boot (Java) with JPA/Hibernate
- **Frontend**: React.js with modern UI components
- **Database**: MySQL with JPA entities
- **Authentication**: JWT-based security
- **Architecture**: RESTful API with MVC pattern

---

## Validation Mechanisms

### Backend Validation

#### 1. **Bean Validation (Jakarta Validation)**
```java
// BookingRequestDTO.java
@NotNull
private Long packageId;

@NotBlank @Email
private String email;

@NotBlank
private String firstName;

@NotNull @DecimalMin(value = "0.0", inclusive = false)
private BigDecimal amount;
```

#### 2. **Business Logic Validation**
```java
// BookingServiceImpl.java
// Date validation
boolean invalidDates = request.getStartDate() == null || 
    request.getEndDate() == null || 
    request.getEndDate().isBefore(request.getStartDate());

// Overlap validation
boolean overlap = reservationRepository.existsActiveOverlap(
    pkg.getPackageID(), 
    request.getStartDate(), 
    request.getEndDate()
);
```

#### 3. **Authentication Validation**
```java
// AuthController.java
// Email uniqueness check
if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
}

// NIC uniqueness check
if (clientRepository.findByNic(request.getNic()).isPresent()) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, "NIC already registered");
}
```

### Frontend Validation

#### 1. **Form Validation**
```javascript
// CustomerRegister.jsx
const validateForm = () => {
    // Required field validation
    if (!form.firstName.trim()) {
        setError("First Name is required!");
        return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        setError("Invalid email format!");
        return false;
    }
    
    // Password strength validation
    if (form.password.length < 6) {
        setError("Password must be at least 6 characters!");
        return false;
    }
};
```

#### 2. **Real-time Validation**
```javascript
// Book.jsx - Booking form validation
const validateBooking = () => {
    // Authentication check
    if (!token || !user) {
        setError("Authentication Required! Please login to make a booking.");
        return false;
    }
    
    // Date validation
    if (new Date(form.endDate) <= new Date(form.startDate)) {
        setError("End date must be after start date!");
        return false;
    }
    
    // Amount validation
    if (!form.amount || Number(form.amount) <= 0) {
        setError("Valid amount is required!");
        return false;
    }
};
```

#### 3. **Custom Validation Components**
```javascript
// TravelAvailabilityValidation.jsx
const TravelAvailabilityValidation = ({ available, dates }) => {
    return (
        <div className={`alert ${available ? 'alert-success' : 'alert-danger'}`}>
            <div className="d-flex align-items-center">
                <div className="rounded-circle">
                    {available ? '✓' : '✗'}
                </div>
                <div>
                    <h5>{available ? 'Travel Available!' : 'Cannot Place Travel'}</h5>
                    <p>{available ? 
                        `✅ Package available for ${dates.startDate} to ${dates.endDate}` :
                        `❌ Package not available for selected dates`
                    }</p>
                </div>
            </div>
        </div>
    );
};
```

---

## CRUD Operations

### Entity Management

#### 1. **Client Entity**
```java
@Entity
@Table(name = "Client")
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;
    
    @Column(unique = true)
    private String email;
    
    @OneToMany(mappedBy = "client")
    private List<Reservation> reservations;
}
```

**CRUD Operations:**
- **Create**: `POST /api/customer/register` - Register new client
- **Read**: `GET /api/customer/profile` - Get client profile
- **Update**: `PUT /api/customer/profile` - Update client profile
- **Delete**: `DELETE /api/customer/{id}` - Delete client account

#### 2. **Reservation Entity**
```java
@Entity
@Table(name = "Reservation")
public class Reservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationID;
    
    @ManyToOne
    private Client client;
    
    @ManyToOne
    private Packages package;
    
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
}
```

**CRUD Operations:**
- **Create**: `POST /api/customer/bookings` - Create new booking
- **Read**: `GET /api/customer/bookings` - Get booking history
- **Update**: `PATCH /api/customer/bookings/{id}/cancel` - Cancel booking
- **Delete**: `DELETE /api/customer/bookings/{id}` - Delete booking

#### 3. **Payment Entity**
```java
@Entity
@Table(name = "Payment")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentID;
    
    @ManyToOne
    private Client client;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
}
```

**CRUD Operations:**
- **Create**: `POST /api/customer/payments` - Process payment
- **Read**: `GET /api/customer/payments` - Get payment history
- **Update**: `PUT /api/customer/payments/{id}` - Update payment status
- **Delete**: `DELETE /api/customer/payments/{id}` - Refund payment

#### 4. **Admin Entity**
```java
@Entity
@Table(name = "Admin")
public class Admin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminID;
    
    @Enumerated(EnumType.STRING)
    private AdminRole role;
}
```

**CRUD Operations:**
- **Create**: `POST /api/admin/register` - Register admin
- **Read**: `GET /api/admin/profile` - Get admin profile
- **Update**: `PUT /api/admin/profile` - Update admin profile
- **Delete**: `DELETE /api/admin/{id}` - Delete admin account

---

## Design Patterns

### 1. **Repository Pattern**
```java
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByNic(String nic);
    boolean existsByEmail(String email);
}

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsActiveOverlap(Long packageId, LocalDate startDate, LocalDate endDate);
    List<Reservation> findByClientEmail(String email);
}
```

### 2. **Service Layer Pattern**
```java
public interface BookingService {
    Reservation createBooking(BookingRequestDTO request);
    Reservation cancelBooking(Long reservationId);
    void deleteBooking(Long reservationId);
}

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    
    @Override
    @Transactional
    public Reservation createBooking(BookingRequestDTO request) {
        // Business logic implementation
    }
}
```

### 3. **DTO Pattern**
```java
@Data
public class BookingRequestDTO {
    @NotNull
    private Long packageId;
    
    @NotBlank @Email
    private String email;
    
    @NotBlank
    private String firstName;
    
    @NotNull
    private LocalDate startDate;
}

@Data
public class AdminProfileDto {
    private Long adminID;
    private String fName;
    private String lName;
    private AdminRole role;
    private String email;
}
```

### 4. **MVC Pattern**
```java
@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping("/bookings")
    public ResponseEntity<Reservation> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        Reservation reservation = bookingService.createBooking(request);
        return ResponseEntity.ok(reservation);
    }
}
```

### 5. **Factory Pattern (JWT Service)**
```java
@Service
public class JwtService {
    
    public String generateToken(String email, String role) {
        return Jwts.builder()
            .setSubject(email)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
}
```

### 6. **Strategy Pattern (Authentication)**
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        // JWT authentication strategy
    }
}
```

### 7. **Observer Pattern (Frontend State Management)**
```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
    };
    
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };
    
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
```

### 8. **Component Pattern (Frontend)**
```javascript
// Reusable form components
const TextField = ({ label, value, onChange, error, required }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <input 
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={value}
            onChange={onChange}
            required={required}
        />
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);

const SelectField = ({ label, options, value, onChange, error }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <select 
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={value}
            onChange={onChange}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);
```

---

## Frontend Architecture

### 1. **Component Structure**
```
src/
├── components/           # Reusable UI components
│   ├── BigErrorAlert.jsx
│   ├── TravelAvailabilityValidation.jsx
│   ├── FormControls/
│   │   ├── TextField.jsx
│   │   └── SelectField.jsx
│   └── Navigation/
│       ├── TopNav.jsx
│       └── SideNav.jsx
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── customer/        # Customer-specific pages
│   ├── adminprofile/    # Admin profile pages
│   └── dashboard/       # Dashboard pages
├── context/            # React Context
│   └── AuthContext.jsx
├── services/           # API services
│   ├── api.js
│   └── auth.js
└── utils/              # Utility functions
    └── storage.js
```

### 2. **State Management**
```javascript
// Context-based state management
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Local state management
const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
});
```

### 3. **Routing and Navigation**
```javascript
// Protected routes
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, token } = useAuth();
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return children;
};
```

---

## Backend Architecture

### 1. **Layered Architecture**
```
com.backend/
├── controller/         # REST Controllers (Presentation Layer)
├── service/           # Business Logic Layer
│   └── impl/         # Service Implementations
├── repository/        # Data Access Layer
├── entity/           # JPA Entities (Domain Layer)
├── dto/              # Data Transfer Objects
├── config/           # Configuration Classes
└── filter/           # Security Filters
```

### 2. **Dependency Injection**
```java
@RestController
@RequiredArgsConstructor  // Lombok generates constructor
public class BookingController {
    
    private final BookingService bookingService;  // Injected dependency
    
    @PostMapping("/bookings")
    public ResponseEntity<Reservation> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }
}
```

### 3. **Transaction Management**
```java
@Service
@Transactional  // Class-level transaction
public class BookingServiceImpl implements BookingService {
    
    @Override
    @Transactional  // Method-level transaction
    public Reservation createBooking(BookingRequestDTO request) {
        // Transactional operations
        Reservation reservation = new Reservation();
        Payment payment = new Payment();
        
        reservation = reservationRepository.save(reservation);
        payment = paymentRepository.save(payment);
        
        return reservation;
    }
}
```

---

## Security Implementation

### 1. **JWT Authentication**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/customer/**").hasRole("CUSTOMER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### 2. **Password Encryption**
```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// Usage in service
@Service
public class AuthService {
    
    public Client registerClient(ClientRegistrationDTO request) {
        Client client = new Client();
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        return clientRepository.save(client);
    }
}
```

### 3. **CORS Configuration**
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## Database Design

### 1. **Entity Relationships**
```java
// One-to-Many: Client -> Reservations
@OneToMany(mappedBy = "client")
private List<Reservation> reservations;

// Many-to-One: Reservation -> Client
@ManyToOne
@JoinColumn(name = "userID")
private Client client;

// One-to-One: Reservation -> Payment
@OneToOne
@JoinColumn(name = "paymentID")
private Payment payment;
```

### 2. **Database Indexes**
```java
@Entity
@Table(name = "Client", indexes = {
    @Index(name = "IX_User_Email", columnList = "email"),
    @Index(name = "IX_User_NIC", columnList = "NIC")
})
public class Client {
    // Entity definition
}
```

### 3. **Enum Types**
```java
public enum ReservationStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED
}

public enum PaymentStatus {
    PENDING, COMPLETED, FAILED, REFUNDED
}

public enum AdminRole {
    SUPER_ADMIN, ADMIN, MANAGER
}
```

---

## API Documentation

### 1. **Authentication Endpoints**
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/admin/login` - Admin login

### 2. **Customer Endpoints**
- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update customer profile
- `POST /api/customer/bookings` - Create booking
- `GET /api/customer/bookings` - Get booking history
- `PATCH /api/customer/bookings/{id}/cancel` - Cancel booking

### 3. **Admin Endpoints**
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile
- `GET /api/admin/dashboard` - Get dashboard statistics

### 4. **Payment Endpoints**
- `POST /api/customer/payments` - Process payment
- `GET /api/customer/payments` - Get payment history
- `PUT /api/customer/payments/{id}` - Update payment status

---

## Error Handling

### 1. **Backend Error Handling**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ErrorResponse error = new ErrorResponse(ex.getStatusCode().value(), ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }
}
```

### 2. **Frontend Error Handling**
```javascript
// BigErrorAlert.jsx
const BigErrorAlert = ({ title, message, type, onClose }) => {
    return (
        <div className={`alert alert-${type} alert-dismissible fade show`}>
            <h4 className="alert-heading">{title}</h4>
            <p>{message}</p>
            <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
    );
};
```

---

## Performance Optimizations

### 1. **Database Optimizations**
- Indexed columns for frequently queried fields
- Lazy loading for entity relationships
- Transaction management for data consistency

### 2. **Frontend Optimizations**
- Component memoization with React.memo
- Lazy loading for route components
- Efficient state management with Context API

### 3. **Caching Strategy**
- JWT token caching in localStorage
- API response caching where appropriate
- Database query optimization

---

## Testing Strategy

### 1. **Backend Testing**
- Unit tests for service layer
- Integration tests for repository layer
- Controller tests for API endpoints

### 2. **Frontend Testing**
- Component testing with React Testing Library
- Integration tests for user workflows
- E2E tests for critical user journeys

---

## Deployment Considerations

### 1. **Environment Configuration**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/tourism_db
spring.jpa.hibernate.ddl-auto=update
spring.security.jwt.secret=your-secret-key
```

### 2. **Production Optimizations**
- Database connection pooling
- JWT token expiration management
- CORS configuration for production domains
- Error logging and monitoring

---

## Conclusion

This Tourism and Travel Management System demonstrates modern software architecture principles with:

- **Clean Architecture**: Separation of concerns with layered approach
- **SOLID Principles**: Single responsibility, dependency inversion
- **Design Patterns**: Repository, Service Layer, DTO, MVC, Observer
- **Security**: JWT authentication, password encryption, CORS
- **Validation**: Multi-layer validation (frontend, backend, database)
- **CRUD Operations**: Complete entity lifecycle management
- **Modern Frontend**: React with hooks, context, and component patterns

The system provides a robust foundation for tourism business management with scalable architecture and maintainable code structure.
