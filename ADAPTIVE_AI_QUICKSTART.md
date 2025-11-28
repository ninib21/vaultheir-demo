# 🚀 Adaptive AI Quick Start Guide

## ⚡ 5-Minute Setup

### **Step 1: Ensure Prerequisites**

```bash
# Check Node.js version (should be 25.1.0 or higher)
node --version

# Check PostgreSQL is running
psql --version

# Check Redis is running
redis-cli ping
# Should return: PONG
```

### **Step 2: Start Backend**

```bash
cd backend
npm install
npm run start:dev
```

You should see:
```
🚀 Vaultheir™ Backend API running on: http://localhost:4000/api
✨ Robustness framework enabled - AI-enhanced validation active
🤖 Adaptive AI-Enhanced APIs activated:
   📊 Metrics: http://localhost:4000/api/adaptive/metrics
   🔄 Circuit Breakers: http://localhost:4000/api/adaptive/circuits
   🔒 Idempotency Engine: Active
   ⏱️  Temporal Determinism: Enabled
   💚 Health Check: http://localhost:4000/api/adaptive/health
```

### **Step 3: Start Frontend**

```bash
# In the root directory
npm install
npm run dev
```

### **Step 4: Access Dashboard**

Open browser to: `http://localhost:3000/adaptive`

## 🧪 Test It Out

### **Test 1: Idempotency**

```bash
# Run this command twice - you'll get the same result both times!
curl -X POST http://localhost:4000/api/adaptive/test/idempotency \
  -H "Content-Type: application/json" \
  -d '{
    "idempotencyKey": "my-unique-key-123",
    "data": {"test": "value"}
  }'
```

**What to expect**: The `random` field in the response will be identical on both calls, proving idempotency works!

### **Test 2: Circuit Breaker**

```bash
# Trigger 6 failures to open the circuit
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/adaptive/test/circuit-breaker \
    -H "Content-Type: application/json" \
    -d '{"circuitKey": "test-circuit", "shouldFail": true}'
done

# Now try a success - it will be rejected because circuit is open
curl -X POST http://localhost:4000/api/adaptive/test/circuit-breaker \
  -H "Content-Type: application/json" \
  -d '{"circuitKey": "test-circuit", "shouldFail": false}'

# Check circuit status
curl http://localhost:4000/api/adaptive/circuits/test-circuit
```

### **Test 3: View Metrics**

```bash
# Prometheus format
curl http://localhost:4000/api/adaptive/metrics

# JSON format
curl http://localhost:4000/api/adaptive/metrics/json
```

### **Test 4: System Status**

```bash
curl http://localhost:4000/api/adaptive/status | jq
```

## 🎯 Using in Your Code

### **Backend (NestJS)**

Inject services where needed:

```typescript
import { Injectable } from '@nestjs/common';
import { IdempotencyService, TemporalContext } from './adaptive/services/idempotency.service';
import { CircuitBreakerService } from './adaptive/services/circuit-breaker.service';

@Injectable()
export class YourService {
  constructor(
    private readonly idempotency: IdempotencyService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  async processImportantOperation(data: any, idempotencyKey: string) {
    const context: TemporalContext = {
      idempotencyKey,
      processingDate: new Date().toISOString().split('T')[0],
      logicalTimestamp: Date.now(),
    };

    return await this.circuitBreaker.execute('important-operation', async () => {
      return await this.idempotency.executeIdempotent(
        async () => {
          // Your business logic here
          return { success: true, data: processedData };
        },
        context,
        data,
        '/api/your-endpoint',
        'POST',
      );
    });
  }
}
```

### **Frontend (React/Next.js)**

```typescript
// Call any API with idempotency
const response = await fetch('http://localhost:4000/api/your-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': generateUniqueKey(), // Generate UUID or similar
  },
  body: JSON.stringify(data),
});
```

## 📊 Dashboard Features

Navigate to `http://localhost:3000/adaptive` to see:

1. **System Health** - Overall status and request counts
2. **Circuit Breakers** - Real-time circuit states and error rates
3. **Idempotency Engine** - Cache hit rates and success rates
4. **Temporal Determinism** - Logical clock and execution counts
5. **Real-time Metrics** - Errors, rejections, and uptime
6. **API Endpoints** - Quick links to all adaptive endpoints

## 🔧 Common Issues

### **Issue: Backend won't start**

```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check if Redis is running
sudo service redis status

# Check if ports are available
lsof -i :4000  # Backend port
lsof -i :3000  # Frontend port
```

### **Issue: Dashboard shows errors**

Make sure backend is running and check CORS settings in `backend/src/main.ts`.

### **Issue: Idempotency not working**

Check Redis connection:
```bash
redis-cli
> ping
PONG
```

## 📚 Next Steps

1. Read the full documentation: [ADAPTIVE_AI_INTEGRATION.md](./ADAPTIVE_AI_INTEGRATION.md)
2. Explore the API endpoints in Postman or your API client
3. Check out the test suite: `backend/src/adaptive/__tests__/`
4. Integrate adaptive features into your existing APIs
5. Configure monitoring and alerting

## 🎓 Key Concepts

- **Idempotency**: Same input = same output, no matter how many times you call it
- **Circuit Breaker**: Automatically stops calling failing services to prevent cascade failures
- **Temporal Determinism**: Ensures reproducible results using logical time
- **Metrics**: Prometheus-compatible monitoring for observability

## 💡 Pro Tips

1. **Always use idempotency keys for mutations** (POST, PUT, DELETE)
2. **Monitor circuit breaker status** before critical operations
3. **Use processing dates** for financial or time-sensitive operations
4. **Check metrics regularly** to tune thresholds
5. **Set up alerts** for circuit breaker events

## 🆘 Help

- Check logs: `backend/logs/`
- View dashboard: `http://localhost:3000/adaptive`
- Check health: `http://localhost:4000/api/adaptive/health`
- Review metrics: `http://localhost:4000/api/adaptive/metrics/json`

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend dashboard loads
- [ ] Health endpoint responds
- [ ] Idempotency test works
- [ ] Circuit breaker test works
- [ ] Metrics are being collected
- [ ] Dashboard updates in real-time

---

*Ready to build the future of adaptive APIs!* 🚀✨
