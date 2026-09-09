import { useEffect, useState } from "react";
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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Close,
  EditOutlined,
  LocationOnOutlined,
  PeopleOutlined,
  PowerSettingsNew,
  Refresh,
  Search,
} from "@mui/icons-material";

import {
  activateCustomer,
  createCustomer,
  deactivateCustomer,
  getCustomers,
  updateCustomer,
} from "../services/customerService";

import type {
  Customer,
  CustomerCreateRequest,
} from "../types/customer";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] =
    useState("");
  const [locationFilter, setLocationFilter] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState<boolean | "">("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [customerCategory, setCustomerCategory] =
    useState("");
  const [location, setLocation] = useState("");
  const [accountStatus, setAccountStatus] =
    useState("ACTIVE");

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

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers(
        page * rowsPerPage,
        rowsPerPage,
        search,
        customerTypeFilter,
        locationFilter,
        statusFilter === ""
          ? undefined
          : statusFilter,
      );

      setCustomers(response.items);
      setTotal(response.total);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load customers.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, [
    page,
    rowsPerPage,
    search,
    customerTypeFilter,
    locationFilter,
    statusFilter,
  ]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setCustomerType("");
    setCustomerCategory("");
    setLocation("");
    setAccountStatus("ACTIVE");
  };

  const openCreateDialog = () => {
    setEditingCustomer(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);

    setName(customer.name);
    setEmail(customer.email);
    setCustomerType(customer.customer_type);
    setCustomerCategory(
      customer.customer_category || "",
    );
    setLocation(customer.location || "");
    setAccountStatus(
      customer.account_status || "ACTIVE",
    );

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!saving) {
      setDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showMessage(
        "Customer name is required.",
        "error",
      );
      return;
    }

    if (!email.trim()) {
      showMessage(
        "Customer email is required.",
        "error",
      );
      return;
    }

    if (!customerType) {
      showMessage(
        "Please select a customer type.",
        "error",
      );
      return;
    }

    try {
      setSaving(true);

      const payload: CustomerCreateRequest = {
        name: name.trim(),
        email: email.trim(),
        customer_type: customerType,
        customer_category:
          customerCategory.trim() || null,
        location: location.trim() || null,
        account_status: accountStatus,
      };

      if (editingCustomer) {
        await updateCustomer(
          editingCustomer.id,
          payload,
        );

        showMessage(
          "Customer updated successfully.",
        );
      } else {
        await createCustomer(payload);

        showMessage(
          "Customer created successfully.",
        );
      }

      setDialogOpen(false);
      await loadCustomers();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to save customer.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (
    customer: Customer,
  ) => {
    try {
      if (customer.is_active) {
        await deactivateCustomer(customer.id);

        showMessage(
          "Customer deactivated.",
        );
      } else {
        await activateCustomer(customer.id);

        showMessage(
          "Customer activated.",
        );
      }

      await loadCustomers();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to update customer status.",
        "error",
      );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case "PREMIUM":
        return "Premium";

      case "BUSINESS":
        return "Business";

      case "WHOLESALE":
        return "Wholesale";

      case "REGULAR":
        return "Regular";

      default:
        return type;
    }
  };

  const getTypeBackground = (type: string) => {
    switch (type.toUpperCase()) {
      case "PREMIUM":
        return "#EEF2FF";

      case "BUSINESS":
        return "#ECFEFF";

      case "WHOLESALE":
        return "#FFF7ED";

      default:
        return "#F1F5F9";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "PREMIUM":
        return "#4F46E5";

      case "BUSINESS":
        return "#0891B2";

      case "WHOLESALE":
        return "#EA580C";

      default:
        return "#475569";
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
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
            Customers
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Manage customers and pricing
            profiles.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateDialog}
          sx={{
            height: 44,
            px: 2.5,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#64748B",
              fontWeight: 600,
            }}
          >
            Total Customers
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mt: 0.5,
            }}
          >
            {total}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#64748B",
              fontWeight: 600,
            }}
          >
            Active
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mt: 0.5,
              color: "#059669",
            }}
          >
            {
              customers.filter(
                (customer) =>
                  customer.is_active,
              ).length
            }
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#64748B",
              fontWeight: 600,
            }}
          >
            Premium
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mt: 0.5,
              color: "#4F46E5",
            }}
          >
            {
              customers.filter(
                (customer) =>
                  customer.customer_type.toUpperCase() ===
                  "PREMIUM",
              ).length
            }
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 4px 20px rgba(15,23,42,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
            borderBottom:
              "1px solid #E2E8F0",
          }}
        >
          <TextField
            size="small"
            placeholder="Search name or email..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 250,
              },
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                background: "#F8FAFC",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      sx={{
                        color: "#94A3B8",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 160,
            }}
          >
            <InputLabel>
              Customer Type
            </InputLabel>

            <Select
              label="Customer Type"
              value={customerTypeFilter}
              onChange={(event) => {
                setCustomerTypeFilter(
                  event.target.value as string,
                );
                setPage(0);
              }}
            >
              <MenuItem value="">
                All Types
              </MenuItem>

              <MenuItem value="REGULAR">
                Regular
              </MenuItem>

              <MenuItem value="PREMIUM">
                Premium
              </MenuItem>

              <MenuItem value="BUSINESS">
                Business
              </MenuItem>

              <MenuItem value="WHOLESALE">
                Wholesale
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Location..."
            value={locationFilter}
            onChange={(event) => {
              setLocationFilter(
                event.target.value,
              );
              setPage(0);
            }}
            sx={{
              minWidth: 160,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlined
                      sx={{
                        color: "#94A3B8",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 130,
            }}
          >
            <InputLabel>Status</InputLabel>

            <Select
              label="Status"
              value={
                statusFilter === ""
                  ? ""
                  : String(statusFilter)
              }
              onChange={(event) => {
                const value =
                  event.target.value as string;

                setStatusFilter(
                  value === ""
                    ? ""
                    : value === "true",
                );

                setPage(0);
              }}
            >
              <MenuItem value="">
                All
              </MenuItem>

              <MenuItem value="true">
                Active
              </MenuItem>

              <MenuItem value="false">
                Inactive
              </MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={() => void loadCustomers()}
            disabled={loading}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 2,
            }}
          >
            <Refresh />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "#F8FAFC",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Customer
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Type
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Category
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Location
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CircularProgress
                      size={30}
                    />
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <PeopleOutlined
                      sx={{
                        fontSize: 50,
                        color: "#CBD5E1",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                      }}
                    >
                      No customers found
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#94A3B8",
                        mt: 0.5,
                      }}
                    >
                      Try changing your filters
                      or add a new customer.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* Customer */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "center",
                            background: "#EEF2FF",
                            color: "#4F46E5",
                            fontWeight: 800,
                          }}
                        >
                          {customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {customer.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#94A3B8",
                            }}
                          >
                            {customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Chip
                        label={getTypeLabel(
                          customer.customer_type,
                        )}
                        size="small"
                        sx={{
                          background:
                            getTypeBackground(
                              customer.customer_type,
                            ),
                          color: getTypeColor(
                            customer.customer_type,
                          ),
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#475569",
                          fontWeight: 600,
                        }}
                      >
                        {customer.customer_category ||
                          "—"}
                      </Typography>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <LocationOnOutlined
                          sx={{
                            fontSize: 16,
                            color: "#94A3B8",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          {customer.location ||
                            "—"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={
                          customer.is_active
                            ? "Active"
                            : "Inactive"
                        }
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background:
                            customer.is_active
                              ? "#ECFDF5"
                              : "#FEF2F2",
                          color:
                            customer.is_active
                              ? "#059669"
                              : "#DC2626",
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() =>
                          openEditDialog(
                            customer,
                          )
                        }
                        sx={{
                          mr: 0.5,
                          color: "#4F46E5",
                        }}
                      >
                        <EditOutlined
                          fontSize="small"
                        />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          void handleToggleStatus(
                            customer,
                          )
                        }
                        sx={{
                          color:
                            customer.is_active
                              ? "#DC2626"
                              : "#059669",
                        }}
                      >
                        <PowerSettingsNew
                          fontSize="small"
                        />
                      </IconButton>
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
          onPageChange={(_, newPage) =>
            setPage(newPage)
          }
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(
              parseInt(
                event.target.value,
                10,
              ),
            );
            setPage(0);
          }}
          rowsPerPageOptions={[
            5,
            10,
            25,
          ]}
        />
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          {editingCustomer
            ? "Edit Customer"
            : "Create Customer"}

          <IconButton
            onClick={closeDialog}
            disabled={saving}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Customer Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            margin="normal"
            required
          />

          <FormControl
            fullWidth
            margin="normal"
            required
          >
            <InputLabel>
              Customer Type
            </InputLabel>

            <Select
              label="Customer Type"
              value={customerType}
              onChange={(event) =>
                setCustomerType(
                  event.target.value as string,
                )
              }
            >
              <MenuItem value="REGULAR">
                Regular
              </MenuItem>

              <MenuItem value="PREMIUM">
                Premium
              </MenuItem>

              <MenuItem value="BUSINESS">
                Business
              </MenuItem>

              <MenuItem value="WHOLESALE">
                Wholesale
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Customer Category"
            placeholder="e.g. VIP, Retail, Enterprise"
            value={customerCategory}
            onChange={(event) =>
              setCustomerCategory(
                event.target.value,
              )
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Location"
            placeholder="e.g. Chennai"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            margin="normal"
          />

          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>
              Account Status
            </InputLabel>

            <Select
              label="Account Status"
              value={accountStatus}
              onChange={(event) =>
                setAccountStatus(
                  event.target.value as string,
                )
              }
            >
              <MenuItem value="ACTIVE">
                Active
              </MenuItem>

              <MenuItem value="INACTIVE">
                Inactive
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 1,
          }}
        >
          <Button
            onClick={closeDialog}
            disabled={saving}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              void handleSave()
            }
            disabled={saving}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            {saving
              ? "Saving..."
              : editingCustomer
                ? "Save Changes"
                : "Create Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((current) => ({
            ...current,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((current) => ({
              ...current,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Customers;