"""
Vaultheir™ Pricing Service
FastAPI microservice for real-time pricing calculations and analytics
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import redis
import json
import os
from datetime import datetime

app = FastAPI(
    title="Vaultheir™ Pricing Service",
    description="Real-time pricing engine for IP management platform",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True,
)


class PricingRequest(BaseModel):
    tier: str
    assets: int
    billing_cycle: Optional[str] = "monthly"


class ROIRequest(BaseModel):
    patents: int = 0
    trademarks: int = 0
    copyrights: int = 0
    tier: str = "professional"


class PricingResponse(BaseModel):
    tier: str
    base_price: float
    base_price_annual: float
    assets: int
    over_limit: int
    over_limit_cost: float
    total_monthly: float
    total_annual: float
    savings: float
    cached: bool = False


class ROIResponse(BaseModel):
    traditional_cost: float
    vaultheir_cost: float
    savings: float
    savings_percent: float
    roi: float


# Pricing tiers configuration
PRICING_TIERS = {
    "starter": {
        "monthly": 99,
        "annual": 990,
        "limit": 10,
        "over_limit_price": 15,
    },
    "professional": {
        "monthly": 499,
        "annual": 4990,
        "limit": 100,
        "over_limit_price": 10,
    },
    "enterprise": {
        "monthly": 2499,
        "annual": 24990,
        "limit": float("inf"),
        "over_limit_price": 0,
    },
}

# Traditional IP filing costs
TRADITIONAL_COSTS = {
    "patent": 20000,
    "trademark": 3000,
    "copyright": 500,
}


@app.get("/")
async def root():
    return {
        "service": "Vaultheir™ Pricing Service",
        "version": "1.0.0",
        "status": "operational",
    }


@app.get("/health")
async def health():
    try:
        redis_client.ping()
        redis_status = "connected"
    except:
        redis_status = "disconnected"

    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "redis": redis_status,
    }


@app.post("/calculate", response_model=PricingResponse)
async def calculate_pricing(request: PricingRequest):
    """
    Calculate pricing for a given tier and number of assets
    """
    # Check cache
    cache_key = f"pricing:{request.tier}:{request.assets}:{request.billing_cycle}"
    cached = redis_client.get(cache_key)

    if cached:
        data = json.loads(cached)
        data["cached"] = True
        return PricingResponse(**data)

    # Get tier configuration
    tier_config = PRICING_TIERS.get(request.tier.lower())
    if not tier_config:
        raise HTTPException(status_code=400, detail=f"Invalid tier: {request.tier}")

    # Calculate pricing
    over_limit = max(0, request.assets - tier_config["limit"])
    over_limit_cost = over_limit * tier_config["over_limit_price"]

    base_price = tier_config["monthly"]
    base_price_annual = tier_config["annual"]
    total_monthly = base_price + over_limit_cost
    total_annual = base_price_annual + (over_limit_cost * 12)
    savings = base_price_annual - (base_price * 12)

    response_data = {
        "tier": request.tier,
        "base_price": base_price,
        "base_price_annual": base_price_annual,
        "assets": request.assets,
        "over_limit": over_limit,
        "over_limit_cost": over_limit_cost,
        "total_monthly": total_monthly,
        "total_annual": total_annual,
        "savings": savings,
        "cached": False,
    }

    # Cache for 1 hour
    redis_client.setex(cache_key, 3600, json.dumps(response_data))

    return PricingResponse(**response_data)


@app.post("/roi", response_model=ROIResponse)
async def calculate_roi(request: ROIRequest):
    """
    Calculate ROI compared to traditional IP filing
    """
    # Calculate traditional costs
    traditional_cost = (
        request.patents * TRADITIONAL_COSTS["patent"]
        + request.trademarks * TRADITIONAL_COSTS["trademark"]
        + request.copyrights * TRADITIONAL_COSTS["copyright"]
    )

    # Calculate Vaultheir costs
    total_assets = request.patents + request.trademarks + request.copyrights
    tier_config = PRICING_TIERS.get(request.tier.lower())
    if not tier_config:
        raise HTTPException(status_code=400, detail=f"Invalid tier: {request.tier}")

    over_limit = max(0, total_assets - tier_config["limit"])
    over_limit_cost = over_limit * tier_config["over_limit_price"]
    vaultheir_cost = tier_config["annual"] + (over_limit_cost * 12)

    # Calculate savings
    savings = traditional_cost - vaultheir_cost
    savings_percent = (savings / traditional_cost * 100) if traditional_cost > 0 else 0

    return ROIResponse(
        traditional_cost=traditional_cost,
        vaultheir_cost=vaultheir_cost,
        savings=savings,
        savings_percent=round(savings_percent, 1),
        roi=savings_percent,
    )


@app.get("/tiers")
async def get_tiers():
    """
    Get all available pricing tiers
    """
    return {
        "tiers": PRICING_TIERS,
        "traditional_costs": TRADITIONAL_COSTS,
    }


if __name__ == "__main__":
    import uvicorn
    import os

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV") != "production",
    )

