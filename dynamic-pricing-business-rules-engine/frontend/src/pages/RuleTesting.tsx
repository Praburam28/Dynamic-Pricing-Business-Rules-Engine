import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircleOutlined,
  PlayArrowRounded,
  RestartAltRounded,
  RuleOutlined,
  ScienceOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import { getProducts } from "../services/productService";
import { getCustomers } from "../services/customerService";
import { getCategories } from "../services/categoryService";
import { getPricingRules } from "../services/pricingRuleService";
import { testPricingRule } from "../services/ruleTestingService";

import type { Product } from "../types/product";
import type { Customer } from "../types/customer";
import type { Category } from "../types/category";
import type { PricingRule } from "../types/pricingRule";
import type {
  RuleTestResponse,
} from "../types/ruleTesting";

const RuleTesting = () => {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [ruleId, setRuleId] = useState("");
  const [productId, setProductId] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [customerCategory, setCustomerCategory] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");

  const [result, setResult] = useState<RuleTestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);

        const [rulesResponse, productsResponse, customersResponse, categoriesResponse] =
          await Promise.all([
            getPricingRules(0, 100, undefined, true),
            getProducts(0, 100, undefined, undefined, true),
            getCustomers(0, 100, undefined, undefined, undefined, true),
            getCategories(0, 100, undefined),
          ]);

        setRules(rulesResponse.items);
        setProducts(productsResponse.items);
        setCustomers(customersResponse.items);
        setCategories(categoriesResponse.items);
      } catch (error) {
        console.error(error);

        setSnackbar({
          open: true,
          message: "Unable to load rule testing data.",
          severity: "error",
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === Number(productId)),
    [products, productId],
  );

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.customer_type === customerType),
    [customers, customerType],
  );

  const handleProductChange = (value: string) => {
    setProductId(value);

    const product = products.find(
      (item) => item.id === Number(value),
    );

    if (product) {
      setBasePrice(String(product.base_price));
      setCategoryId(String(product.category_id));
    }
  };

  const handleCustomerChange = (value: string) => {
    setCustomerType(value);

    const customer = customers.find(
      (item) => item.customer_type === value,
    );

    if (customer) {
      setCustomerCategory(customer.customer_category || "");
      setLocation(customer.location || "");
    }
  };

  const handleReset = () => {
    setRuleId("");
    setProductId("");
    setCustomerType("");
    setCustomerCategory("");
    setLocation("");
    setQuantity("1");
    setCategoryId("");
    setBasePrice("");
    setResult(null);
  };

  const handleTest = async () => {
    if (!ruleId || !productId || !categoryId || !basePrice) {
      setSnackbar({
        open: true,
        message: "Please complete all required fields.",
        severity: "error",
      });
      return;
    }

    if (Number(quantity) < 1 || Number(basePrice) < 0) {
      setSnackbar({
        open: true,
        message: "Enter valid quantity and base price.",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await testPricingRule({
        rule_id: Number(ruleId),
        customer_type: customerType || null,
        customer_category: customerCategory || null,
        location: location || null,
        quantity: Number(quantity),
        category_id: Number(categoryId),
        product_id: Number(productId),
        base_price: Number(basePrice),
      });

      setResult(response);
    } catch (error: any) {
      console.error(error);

      setSnackbar({
        open: true,
        message:
          error?.response?.data?.detail ||
          "Unable to test pricing rule.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 0.8,
            }}
          >
            <ScienceOutlined
              sx={{
                fontSize: 30,
                color: "#4F46E5",
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.03em",
              }}
            >
              Rule Tester
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: 15,
            }}
          >
            Test pricing rules against real-world pricing scenarios
            before applying them to live calculations.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RestartAltRounded />}
          onClick={handleReset}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Reset
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Test Configuration */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#0F172A",
                  }}
                >
                  Test Configuration
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: 13,
                    mt: 0.5,
                  }}
                >
                  Provide the input values used by the rule evaluator.
                </Typography>
              </Box>

              <Grid container spacing={2.2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    label="Pricing Rule"
                    value={ruleId}
                    onChange={(event) => setRuleId(event.target.value)}
                    required
                  >
                    <MenuItem value="">
                      Select pricing rule
                    </MenuItem>

                    {rules.map((rule) => (
                      <MenuItem
                        key={rule.id}
                        value={String(rule.id)}
                      >
                        {rule.name} — Priority {rule.priority}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Product"
                    value={productId}
                    onChange={(event) =>
                      handleProductChange(event.target.value)
                    }
                    required
                  >
                    <MenuItem value="">
                      Select product
                    </MenuItem>

                    {products.map((product) => (
                      <MenuItem
                        key={product.id}
                        value={String(product.id)}
                      >
                        {product.name} ({product.sku})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Customer Type"
                    value={customerType}
                    onChange={(event) =>
                      handleCustomerChange(event.target.value)
                    }
                  >
                    <MenuItem value="">
                      Select customer type
                    </MenuItem>

                    {Array.from(
                      new Set(
                        customers.map(
                          (customer) => customer.customer_type,
                        ),
                      ),
                    ).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Customer Category"
                    value={customerCategory}
                    onChange={(event) =>
                      setCustomerCategory(event.target.value)
                    }
                    placeholder="VIP"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    placeholder="Chennai"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    slotProps={{
                        htmlInput: {
                            min: 1,
                        },
                        }}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    value={categoryId}
                    onChange={(event) =>
                      setCategoryId(event.target.value)
                    }
                    required
                  >
                    <MenuItem value="">
                      Select category
                    </MenuItem>

                    {categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Base Price"
                    value={basePrice}
                    onChange={(event) =>
                      setBasePrice(event.target.value)
                    }
                    slotProps={{
                        htmlInput: {
                            min: 0,
                            step: "0.01",
                        },
                        }}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 0.5 }} />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={
                      loading ? (
                        <CircularProgress
                          size={20}
                          color="inherit"
                        />
                      ) : (
                        <PlayArrowRounded />
                      )
                    }
                    onClick={handleTest}
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.4,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: 15,
                      background:
                        "linear-gradient(135deg,#4F46E5,#7C3AED)",
                      boxShadow:
                        "0 10px 24px rgba(79,70,229,.25)",
                    }}
                  >
                    {loading ? "Testing Rule..." : "Test Pricing Rule"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Result */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <RuleOutlined sx={{ color: "#4F46E5" }} />

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#0F172A",
                  }}
                >
                  Test Result
                </Typography>
              </Box>

              {!result ? (
                <Box
                  sx={{
                    minHeight: 350,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#EEF2FF",
                      mb: 2,
                    }}
                  >
                    <ScienceOutlined
                      sx={{
                        fontSize: 36,
                        color: "#4F46E5",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 750,
                      color: "#334155",
                      fontSize: 17,
                    }}
                  >
                    Ready to test
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94A3B8",
                      fontSize: 13,
                      mt: 0.8,
                      maxWidth: 320,
                    }}
                  >
                    Configure the scenario and run the rule
                    tester to see whether the pricing rule matches.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      mb: 2.5,
                      background: result.matched
                        ? "#F0FDF4"
                        : "#FFF7ED",
                      border: `1px solid ${
                        result.matched
                          ? "#BBF7D0"
                          : "#FED7AA"
                      }`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      {result.matched ? (
                        <CheckCircleOutlined
                          sx={{
                            fontSize: 34,
                            color: "#16A34A",
                          }}
                        />
                      ) : (
                        <WarningAmberOutlined
                          sx={{
                            fontSize: 34,
                            color: "#EA580C",
                          }}
                        />
                      )}

                      <Typography
                        sx={{
                          fontWeight: 850,
                          fontSize: 21,
                          color: result.matched
                            ? "#166534"
                            : "#9A3412",
                        }}
                      >
                        {result.matched
                          ? "Rule Matched"
                          : "Rule Not Matched"}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#64748B",
                      }}
                    >
                      {result.message}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      sx={{
                        color: "#64748B",
                        fontSize: 12,
                        mb: 0.5,
                      }}
                    >
                      Pricing Rule
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 750,
                        color: "#0F172A",
                        fontSize: 16,
                      }}
                    >
                      {result.rule_name}
                    </Typography>
                  </Box>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#64748B",
                            mb: 0.7,
                          }}
                        >
                          Execution Type
                        </Typography>

                        <Chip
                          label={result.execution_type}
                          size="small"
                          sx={{
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#64748B",
                            mb: 0.7,
                          }}
                        >
                          Discount
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 850,
                            fontSize: 20,
                            color: "#4F46E5",
                          }}
                        >
                          ₹{Number(result.discount_amount).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      background: "#EEF2FF",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#6366F1",
                        fontWeight: 700,
                      }}
                    >
                      Evaluation
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#475569",
                        mt: 0.5,
                        lineHeight: 1.6,
                      }}
                    >
                      The supplied customer, product, quantity,
                      category and location values were evaluated
                      against the selected rule conditions.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Selected Product / Customer context */}
      {(selectedProduct || selectedCustomer) && (
        <Card
          elevation={0}
          sx={{
            mt: 3,
            border: "1px solid #E2E8F0",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                color: "#0F172A",
                mb: 1.5,
              }}
            >
              Scenario Context
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {selectedProduct && (
                <Chip
                  label={`Product: ${selectedProduct.name}`}
                  variant="outlined"
                />
              )}

              {selectedProduct && (
                <Chip
                  label={`SKU: ${selectedProduct.sku}`}
                  variant="outlined"
                />
              )}

              {selectedCustomer && (
                <Chip
                  label={`Customer: ${selectedCustomer.name}`}
                  variant="outlined"
                />
              )}

              {customerType && (
                <Chip
                  label={`Type: ${customerType}`}
                  variant="outlined"
                />
              )}

              {location && (
                <Chip
                  label={`Location: ${location}`}
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((current) => ({
            ...current,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((current) => ({
              ...current,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RuleTesting;