import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import {
  CalculateOutlined,
  CheckCircleOutlined,
  LocalOfferOutlined,
  ReceiptLongOutlined,
  Refresh,
  ShoppingCartOutlined,
} from "@mui/icons-material";

import { getProducts } from "../services/productService";
import { getCustomers } from "../services/customerService";
import { calculatePricing } from "../services/pricingCalculationService";

import type { Product } from "../types/product";
import type { Customer } from "../types/customer";
import type {
  PricingCalculationResponse,
} from "../types/pricingCalculation";

function PricingCalculator() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [productId, setProductId] =
    useState<number | "">("");

  const [customerId, setCustomerId] =
    useState<number | "">("");

  const [quantity, setQuantity] =
    useState("1");

  const [location, setLocation] =
    useState("");

  const [promotionCode, setPromotionCode] =
    useState("");

  const [taxRate, setTaxRate] =
    useState("0");

  const [result, setResult] =
    useState<PricingCalculationResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [loadingData, setLoadingData] =
    useState(true);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity:
        "success" as "success" | "error",
    });

  const showMessage = (
    message: string,
    severity:
      | "success"
      | "error" = "success",
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const loadData = async () => {
    try {
      setLoadingData(true);

      const [
        productsResponse,
        customersResponse,
      ] = await Promise.all([
        getProducts(
          0,
          100,
          "",
          undefined,
          true,
          "name",
          "asc",
        ),
        getCustomers(
          0,
          100,
          "",
          "",
          "",
          true,
        ),
      ]);

      setProducts(
        productsResponse.items,
      );

      setCustomers(
        customersResponse.items,
      );
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load products or customers.",
        "error",
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedProduct =
    products.find(
      (product) =>
        product.id === productId,
    );

  const selectedCustomer =
    customers.find(
      (customer) =>
        customer.id === customerId,
    );

  const handleCalculate = async () => {
    if (productId === "") {
      showMessage(
        "Please select a product.",
        "error",
      );
      return;
    }

    if (customerId === "") {
      showMessage(
        "Please select a customer.",
        "error",
      );
      return;
    }

    if (
      !quantity ||
      Number(quantity) < 1
    ) {
      showMessage(
        "Quantity must be at least 1.",
        "error",
      );
      return;
    }

    if (
      !taxRate ||
      Number(taxRate) < 0 ||
      Number(taxRate) > 100
    ) {
      showMessage(
        "Tax rate must be between 0 and 100.",
        "error",
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await calculatePricing({
          product_id: productId,
          customer_id: customerId,
          quantity: Number(quantity),
          location:
            location.trim() || null,
          promotional_code:
            promotionCode.trim()
              ? promotionCode
                  .trim()
                  .toUpperCase()
              : null,
          tax_rate: Number(taxRate),
        });

      setResult(response);

      showMessage(
        "Pricing calculated successfully.",
      );
    } catch (error: any) {
      setResult(null);

      showMessage(
        error?.response?.data?.detail ||
          "Unable to calculate pricing.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setProductId("");
    setCustomerId("");
    setQuantity("1");
    setLocation("");
    setPromotionCode("");
    setTaxRate("0");
    setResult(null);
  };

  const formatCurrency = (
    value: number,
  ) =>
    `₹${Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}`;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 28,
                md: 34,
              },
              fontWeight: 800,
              letterSpacing: -1,
              color: "#111827",
            }}
          >
            Pricing Calculator
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Preview the final price using
            your dynamic pricing rules.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={resetCalculator}
          sx={{
            height: 44,
            px: 2.5,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Main layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) minmax(380px, 0.8fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Input panel */}
        <Paper
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            borderRadius: 4,
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 4px 20px rgba(15,23,42,0.04)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                background: "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <ShoppingCartOutlined />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Pricing Inputs
              </Typography>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: 12,
                }}
              >
                Enter the transaction details.
              </Typography>
            </Box>
          </Box>

          {loadingData ? (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel>
                  Product
                </InputLabel>

                <Select
                  label="Product"
                  value={
                    productId === ""
                      ? ""
                      : String(productId)
                  }
                  onChange={(event) => {
                    const value =
                      event.target
                        .value as string;

                    setProductId(
                      value === ""
                        ? ""
                        : Number(value),
                    );

                    setResult(null);
                  }}
                >
                  {products.map(
                    (product) => (
                      <MenuItem
                        key={product.id}
                        value={String(
                          product.id,
                        )}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            width: "100%",
                            gap: 2,
                          }}
                        >
                          <span>
                            {product.name}
                          </span>

                          <Typography
                            sx={{
                              color:
                                "#64748B",
                              fontSize: 13,
                            }}
                          >
                            {formatCurrency(
                              Number(
                                product.base_price,
                              ),
                            )}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>

              {selectedProduct && (
                <Box
                  sx={{
                    mt: 1,
                    mb: 1,
                    p: 1.5,
                    borderRadius: 2,
                    background:
                      "#F8FAFC",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color:
                        "#64748B",
                    }}
                  >
                    Base price
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      color:
                        "#111827",
                    }}
                  >
                    {formatCurrency(
                      Number(
                        selectedProduct.base_price,
                      ),
                    )}
                  </Typography>
                </Box>
              )}

              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel>
                  Customer
                </InputLabel>

                <Select
                  label="Customer"
                  value={
                    customerId === ""
                      ? ""
                      : String(
                          customerId,
                        )
                  }
                  onChange={(event) => {
                    const value =
                      event.target
                        .value as string;

                    setCustomerId(
                      value === ""
                        ? ""
                        : Number(value),
                    );

                    setResult(null);
                  }}
                >
                  {customers.map(
                    (customer) => (
                      <MenuItem
                        key={
                          customer.id
                        }
                        value={String(
                          customer.id,
                        )}
                      >
                        {customer.name}
                        {" — "}
                        {
                          customer.customer_type
                        }
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>

              {selectedCustomer && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                    flexWrap:
                      "wrap",
                  }}
                >
                  <Chip
                    label={
                      selectedCustomer.customer_type
                    }
                    size="small"
                    sx={{
                      fontWeight: 700,
                    }}
                  />

                  {selectedCustomer.customer_category && (
                    <Chip
                      label={
                        selectedCustomer.customer_category
                      }
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                  mt: 1,
                }}
              >
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(
                      event.target
                        .value,
                    );
                    setResult(null);
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  value={taxRate}
                  onChange={(event) => {
                    setTaxRate(
                      event.target
                        .value,
                    );
                    setResult(null);
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 100,
                      step: "0.01",
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Location"
                placeholder="e.g. Chennai"
                value={location}
                onChange={(event) => {
                  setLocation(
                    event.target
                      .value,
                  );
                  setResult(null);
                }}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Promotion Code"
                placeholder="e.g. PREMIUM10"
                value={promotionCode}
                onChange={(event) => {
                  setPromotionCode(
                    event.target
                      .value
                      .toUpperCase(),
                  );
                  setResult(null);
                }}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <LocalOfferOutlined
                        sx={{
                          color:
                            "#94A3B8",
                          mr: 1,
                        }}
                      />
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={
                  <CalculateOutlined />
                }
                onClick={() =>
                  void handleCalculate()
                }
                disabled={loading}
                sx={{
                  mt: 3,
                  height: 50,
                  borderRadius: 2.5,
                  textTransform:
                    "none",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                {loading
                  ? "Calculating..."
                  : "Calculate Price"}
              </Button>
            </>
          )}
        </Paper>

        {/* Result panel */}
        <Paper
          sx={{
            borderRadius: 4,
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 4px 20px rgba(15,23,42,0.04)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              background:
                "linear-gradient(135deg, #111827, #1E293B)",
              color: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                opacity: 0.7,
                fontWeight: 600,
                textTransform:
                  "uppercase",
                letterSpacing: 1,
              }}
            >
              Final Price
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 36,
                  md: 44,
                },
                fontWeight: 900,
                mt: 0.5,
                letterSpacing: -1.5,
              }}
            >
              {result
                ? formatCurrency(
                    Number(
                      result.final_price,
                    ),
                  )
                : "₹0.00"}
            </Typography>

            {result && (
              <Chip
                icon={
                  <CheckCircleOutlined />
                }
                label="Calculation completed"
                size="small"
                sx={{
                  mt: 1,
                  color: "#FFFFFF",
                  background:
                    "rgba(255,255,255,0.12)",
                  fontWeight: 700,
                }}
              />
            )}
          </Box>

          <Box sx={{ p: 3 }}>
            {!result ? (
              <Box
                sx={{
                  py: 7,
                  textAlign: "center",
                }}
              >
                <ReceiptLongOutlined
                  sx={{
                    fontSize: 56,
                    color: "#CBD5E1",
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  No calculation yet
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color:
                      "#94A3B8",
                    mt: 0.5,
                  }}
                >
                  Enter the pricing inputs
                  and calculate a price.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Price breakdown */}
                <Typography
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  Price Breakdown
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#64748B",
                        fontSize: 14,
                      }}
                    >
                      Base Price
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      {formatCurrency(
                        Number(
                          result.base_price,
                        ),
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#64748B",
                        fontSize: 14,
                      }}
                    >
                      Quantity
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      ×{" "}
                      {result.quantity}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#64748B",
                        fontSize: 14,
                      }}
                    >
                      Original Price
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      {formatCurrency(
                        Number(
                          result.original_price,
                        ),
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#059669",
                        fontSize: 14,
                      }}
                    >
                      Rule Discounts
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          800,
                        color:
                          "#059669",
                      }}
                    >
                      −{" "}
                      {formatCurrency(
                        Number(
                          result.discount_amount,
                        ),
                      )}
                    </Typography>
                  </Box>

                  {result.promotion_discount >
                    0 && (
                    <Box
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "#0891B2",
                          fontSize:
                            14,
                        }}
                      >
                        Promotion
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight:
                            800,
                          color:
                            "#0891B2",
                        }}
                      >
                        −{" "}
                        {formatCurrency(
                          Number(
                            result.promotion_discount,
                          ),
                        )}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#64748B",
                        fontSize: 14,
                      }}
                    >
                      Tax (
                      {result.tax_rate}
                      %)
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      +{" "}
                      {formatCurrency(
                        Number(
                          result.tax_amount,
                        ),
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 2.5,
                      background:
                        "#F8FAFC",
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight:
                          800,
                      }}
                    >
                      Final Price
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight:
                          900,
                        color:
                          "#4F46E5",
                      }}
                    >
                      {formatCurrency(
                        Number(
                          result.final_price,
                        ),
                      )}
                    </Typography>
                  </Box>
                </Box>

                {/* Applied rules */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    sx={{
                      fontWeight:
                        800,
                      mb: 1.5,
                    }}
                  >
                    Applied Pricing Rules
                  </Typography>

                  {result.applied_rules
                    .length === 0 ? (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color:
                          "#94A3B8",
                      }}
                    >
                      No pricing rules
                      matched.
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: 1,
                      }}
                    >
                      {result.applied_rules.map(
                        (rule) => (
                          <Box
                            key={
                              rule.rule_id
                            }
                            sx={{
                              p: 1.5,
                              border:
                                "1px solid #E2E8F0",
                              borderRadius:
                                2,
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              gap: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  fontSize:
                                    13,
                                  fontWeight:
                                    700,
                                }}
                              >
                                {
                                  rule.rule_name
                                }
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize:
                                    11,
                                  color:
                                    "#94A3B8",
                                }}
                              >
                                Rule #
                                {
                                  rule.rule_id
                                }
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                fontWeight:
                                  800,
                                color:
                                  "#059669",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              −{" "}
                              {formatCurrency(
                                Number(
                                  rule.discount_amount,
                                ),
                              )}
                            </Typography>
                          </Box>
                        ),
                      )}
                    </Box>
                  )}
                </Box>

                {/* Promotion */}
                {result.promotional_code && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 1.5,
                      borderRadius: 2,
                      background:
                        "#ECFEFF",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 1,
                    }}
                  >
                    <LocalOfferOutlined
                      sx={{
                        color:
                          "#0891B2",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight:
                          700,
                        color:
                          "#0E7490",
                      }}
                    >
                      Promotion{" "}
                      {
                        result.promotional_code
                      }{" "}
                      applied
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar(
            (current) => ({
              ...current,
              open: false,
            }),
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={() =>
            setSnackbar(
              (current) => ({
                ...current,
                open: false,
              }),
            )
          }
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PricingCalculator;