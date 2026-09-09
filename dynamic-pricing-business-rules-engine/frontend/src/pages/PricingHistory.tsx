import { useCallback, useEffect, useState } from "react";
import type { ComponentType } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography as MuiTypography,
} from "@mui/material";

import {
  CloseOutlined,
  FilterAltOutlined,
  HistoryOutlined,
  RefreshOutlined,
  VisibilityOutlined,
  LocalOfferOutlined,
  PersonOutlined,
  Inventory2Outlined,
  TrendingDownOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import type { PricingHistory } from "../types/pricingHistory";
import type { Product } from "../types/product";
import type { Customer } from "../types/customer";

import { getPricingHistory } from "../services/pricingHistoryService";
import { getProducts } from "../services/productService";
import { getCustomers } from "../services/customerService";

const Typography = MuiTypography as ComponentType<any>;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function PricingHistoryPage() {
  const [history, setHistory] = useState<PricingHistory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [productFilter, setProductFilter] = useState<number | "">("");
  const [customerFilter, setCustomerFilter] = useState<number | "">("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCalculation, setSelectedCalculation] =
    useState<PricingHistory | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showMessage = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const loadFilters = useCallback(async () => {
    try {
      const [productsResponse, customersResponse] = await Promise.all([
        getProducts(0, 100, "", undefined, true, "name", "asc"),
        getCustomers(0, 100, "", "", "", true),
      ]);

      setProducts(productsResponse.items);
      setCustomers(customersResponse.items);
    } catch {
      showMessage("Unable to load filter data.", "error");
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getPricingHistory(
        page * rowsPerPage,
        rowsPerPage,
        productFilter === "" ? undefined : productFilter,
        customerFilter === "" ? undefined : customerFilter,
      );

      setHistory(response.items);
      setTotal(response.total);
    } catch {
      showMessage("Unable to load pricing history.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, productFilter, customerFilter]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleProductFilter = (value: string) => {
    setProductFilter(value === "" ? "" : Number(value));
    setPage(0);
  };

  const handleCustomerFilter = (value: string) => {
    setCustomerFilter(value === "" ? "" : Number(value));
    setPage(0);
  };

  const clearFilters = () => {
    setProductFilter("");
    setCustomerFilter("");
    setPage(0);
  };

  const openDetails = (calculation: PricingHistory) => {
    setSelectedCalculation(calculation);
    setDetailsOpen(true);
  };

  const getProductName = (productId: number) => {
    return products.find((product) => product.id === productId)?.name ??
      `Product #${productId}`;
  };

  const getCustomerName = (customerId: number) => {
    return customers.find((customer) => customer.id === customerId)?.name ??
      `Customer #${customerId}`;
  };

  const totalDiscount = history.reduce(
    (sum, item) => sum + Number(item.discount_amount),
    0,
  );

  const totalRevenue = history.reduce(
    (sum, item) => sum + Number(item.final_price),
    0,
  );

  const totalTax = history.reduce(
    (sum, item) => sum + Number(item.tax_amount),
    0,
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 0.5,
            }}
          >
            <HistoryOutlined sx={{ fontSize: 30 }} />
            <Typography variant="h4" fontWeight={800}>
              Pricing History
            </Typography>
          </Box>

          <Typography color="text.secondary">
            Review previous pricing calculations, discounts, taxes and applied
            business rules.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshOutlined />}
          onClick={loadHistory}
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Calculations
              </Typography>
              <Typography variant="h5" fontWeight={800} mt={0.5}>
                {total}
              </Typography>
            </Box>

            <HistoryOutlined color="primary" />
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Discount
              </Typography>
              <Typography variant="h5" fontWeight={800} mt={0.5}>
                {formatCurrency(totalDiscount)}
              </Typography>
            </Box>

            <TrendingDownOutlined color="success" />
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tax
              </Typography>
              <Typography variant="h5" fontWeight={800} mt={0.5}>
                {formatCurrency(totalTax)}
              </Typography>
            </Box>

            <ReceiptLongOutlined color="warning" />
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Final Value
              </Typography>
              <Typography variant="h5" fontWeight={800} mt={0.5}>
                {formatCurrency(totalRevenue)}
              </Typography>
            </Box>

            <ReceiptLongOutlined color="primary" />
          </Box>
        </Paper>
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <FilterAltOutlined fontSize="small" />
          <Typography fontWeight={700}>Filter History</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr auto",
            },
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Product"
            value={productFilter === "" ? "" : String(productFilter)}
            onChange={(event) => handleProductFilter(event.target.value)}
            fullWidth
          >
            <MenuItem value="">All Products</MenuItem>

            {products.map((product) => (
              <MenuItem key={product.id} value={String(product.id)}>
                {product.name} ({product.sku})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Customer"
            value={customerFilter === "" ? "" : String(customerFilter)}
            onChange={(event) => handleCustomerFilter(event.target.value)}
            fullWidth
          >
            <MenuItem value="">All Customers</MenuItem>

            {customers.map((customer) => (
              <MenuItem key={customer.id} value={String(customer.id)}>
                {customer.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ minHeight: 56 }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 800,
                    backgroundColor: "action.hover",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell>ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Original</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Final Price</TableCell>
                <TableCell>Promotion</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11}>
                    <Box
                      sx={{
                        minHeight: 250,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11}>
                    <Box sx={{ py: 8, textAlign: "center" }}>
                      <HistoryOutlined
                        sx={{
                          fontSize: 50,
                          color: "text.disabled",
                          mb: 1,
                        }}
                      />

                      <Typography fontWeight={700}>
                        No pricing history found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
                        Pricing calculations will appear here after they are
                        created.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow
                    key={item.calculation_id}
                    hover
                    sx={{
                      "& td": {
                        py: 1.7,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={700}>
                        #{item.calculation_id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Inventory2Outlined
                          fontSize="small"
                          color="primary"
                        />

                        <Box>
                          <Typography fontWeight={600}>
                            {getProductName(item.product_id)}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            ID: {item.product_id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PersonOutlined
                          fontSize="small"
                          color="action"
                        />

                        <Box>
                          <Typography fontWeight={600}>
                            {getCustomerName(item.customer_id)}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            ID: {item.customer_id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`× ${item.quantity}`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      {formatCurrency(Number(item.original_price))}
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={700}
                        sx={{
                          color:
                            Number(item.discount_amount) > 0
                              ? "success.main"
                              : "text.secondary",
                        }}
                      >
                        -{formatCurrency(Number(item.discount_amount))}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {formatCurrency(Number(item.tax_amount))}
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={800}>
                        {formatCurrency(Number(item.final_price))}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {item.promotional_code ? (
                        <Chip
                          icon={<LocalOfferOutlined />}
                          label={item.promotional_code}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(item.calculated_at)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="View calculation details">
                        <IconButton
                          color="primary"
                          onClick={() => openDetails(item)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Pricing Calculation #{selectedCalculation?.calculation_id}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Detailed pricing breakdown
            </Typography>
          </Box>

          <IconButton onClick={() => setDetailsOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedCalculation && (
            <Box>
              {/* Calculation Info */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Product
                  </Typography>

                  <Typography fontWeight={700}>
                    {getProductName(selectedCalculation.product_id)}
                  </Typography>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Customer
                  </Typography>

                  <Typography fontWeight={700}>
                    {getCustomerName(selectedCalculation.customer_id)}
                  </Typography>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Quantity
                  </Typography>

                  <Typography fontWeight={700}>
                    {selectedCalculation.quantity}
                  </Typography>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>

                  <Typography fontWeight={700}>
                    {selectedCalculation.location || "—"}
                  </Typography>
                </Paper>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Price Breakdown */}
              <Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                Price Breakdown
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography>Original Price</Typography>
                  <Typography fontWeight={700}>
                    {formatCurrency(
                      Number(selectedCalculation.original_price),
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography color="success.main">
                    Rule Discounts
                  </Typography>

                  <Typography
                    fontWeight={700}
                    color="success.main"
                  >
                    -
                    {formatCurrency(
                      Number(selectedCalculation.discount_amount),
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography>Tax</Typography>

                  <Typography fontWeight={700}>
                    {formatCurrency(
                      Number(selectedCalculation.tax_amount),
                    )}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography fontWeight={800}>
                    Final Price
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                    color="primary.main"
                  >
                    {formatCurrency(
                      Number(selectedCalculation.final_price),
                    )}
                  </Typography>
                </Box>
              </Paper>

              {/* Promotion */}
              {selectedCalculation.promotional_code && (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    mb={1.5}
                  >
                    Promotion
                  </Typography>

                  <Chip
                    icon={<LocalOfferOutlined />}
                    label={selectedCalculation.promotional_code}
                    color="success"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </>
              )}

              {/* Applied Rules */}
              <Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                Applied Pricing Rules
              </Typography>

              {selectedCalculation.applied_rules.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography color="text.secondary">
                    No pricing rules were applied.
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {selectedCalculation.applied_rules.map((rule) => (
                    <Paper
                      key={`${rule.rule_id}-${rule.rule_name}`}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography fontWeight={700}>
                          {rule.rule_name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Rule #{rule.rule_id} • {rule.action_type}
                        </Typography>
                      </Box>

                      <Typography
                        fontWeight={800}
                        color="success.main"
                      >
                        -{formatCurrency(Number(rule.discount_amount))}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={3}
              >
                Calculated on {formatDate(selectedCalculation.calculated_at)}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}