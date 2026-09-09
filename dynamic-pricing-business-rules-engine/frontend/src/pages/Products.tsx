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
  CategoryOutlined,
  Close,
  EditOutlined,
  Inventory2Outlined,
  PowerSettingsNew,
  Refresh,
  Search,
  SwapVert,
} from "@mui/icons-material";

import {
  activateProduct,
  createProduct,
  deactivateProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

import { getCategories } from "../services/categoryService";

import type { Product } from "../types/product";
import type { Category } from "../types/category";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<number | "">("");
  const [statusFilter, setStatusFilter] =
    useState<boolean | "">("");

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("asc");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");

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

  const loadCategories = async () => {
    try {
      const response = await getCategories(
        0,
        100,
        "",
      );

      setCategories(response.items);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load categories.",
        "error",
      );
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts(
        page * rowsPerPage,
        rowsPerPage,
        search,
        categoryFilter === ""
          ? undefined
          : categoryFilter,
        statusFilter === ""
          ? undefined
          : statusFilter,
        sortBy,
        sortOrder,
      );

      setProducts(response.items);
      setTotal(response.total);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load products.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [
    page,
    rowsPerPage,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  const resetForm = () => {
    setName("");
    setSku("");
    setDescription("");
    setBasePrice("");
    setCategoryId("");
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);

    setName(product.name);
    setSku(product.sku);
    setDescription(product.description || "");
    setBasePrice(String(product.base_price));
    setCategoryId(product.category_id);

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!saving) {
      setDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showMessage("Product name is required.", "error");
      return;
    }

    if (!sku.trim()) {
      showMessage("SKU is required.", "error");
      return;
    }

    if (!basePrice || Number(basePrice) < 0) {
      showMessage(
        "Please enter a valid base price.",
        "error",
      );
      return;
    }

    if (categoryId === "") {
      showMessage("Please select a category.", "error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        sku: sku.trim(),
        description: description.trim() || null,
        base_price: Number(basePrice),
        category_id: categoryId,
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          payload,
        );

        showMessage("Product updated successfully.");
      } else {
        await createProduct(payload);

        showMessage("Product created successfully.");
      }

      setDialogOpen(false);
      await loadProducts();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to save product.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (
    product: Product,
  ) => {
    try {
      if (product.is_active) {
        await deactivateProduct(product.id);
        showMessage("Product deactivated.");
      } else {
        await activateProduct(product.id);
        showMessage("Product activated.");
      }

      await loadProducts();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to update product status.",
        "error",
      );
    }
  };

  const getCategoryName = (id: number) => {
    return (
      categories.find(
        (category) => category.id === id,
      )?.name || `Category #${id}`
    );
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((current) =>
        current === "asc" ? "desc" : "asc",
      );
    } else {
      setSortBy(field);
      setSortOrder("asc");
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
              fontSize: { xs: 28, md: 34 },
              fontWeight: 800,
              letterSpacing: -1,
              color: "#111827",
            }}
          >
            Products
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Manage products, categories and base pricing.
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
          Add Product
        </Button>
      </Box>

      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3,1fr)",
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
            Total Products
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
              products.filter(
                (product) => product.is_active,
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
            Inactive
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mt: 0.5,
              color: "#DC2626",
            }}
          >
            {
              products.filter(
                (product) => !product.is_active,
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
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <TextField
            size="small"
            placeholder="Search name or SKU..."
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
              minWidth: 170,
            }}
          >
            <InputLabel>Category</InputLabel>

            <Select
              label="Category"
              value={categoryFilter === "" ? "" : String(categoryFilter)}
              onChange={(event) => {
                const value = event.target.value as string;

                setCategoryFilter(
                  value === "" ? "" : Number(value)
                );

                setPage(0);
              }}
            >
              <MenuItem value="">All Categories</MenuItem>

              {categories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
              size="small"
              sx={{
                minWidth: 140,
              }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                label="Status"
                value={statusFilter === "" ? "" : String(statusFilter)}
                onChange={(event) => {
                  const value = event.target.value as string;

                  setStatusFilter(
                    value === ""
                      ? ""
                      : value === "true",
                  );

                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>

          <IconButton
            onClick={() => void loadProducts()}
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
                <TableCell>
                  <Button
                    onClick={() => handleSort("name")}
                    endIcon={<SwapVert />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      color: "#475569",
                    }}
                  >
                    Product
                  </Button>
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  SKU
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Category
                </TableCell>

                <TableCell>
                  <Button
                    onClick={() =>
                      handleSort("base_price")
                    }
                    endIcon={<SwapVert />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      color: "#475569",
                    }}
                  >
                    Base Price
                  </Button>
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
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Inventory2Outlined
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
                      No products found
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#94A3B8",
                        mt: 0.5,
                      }}
                    >
                      Try changing your filters or add a
                      new product.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
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
                            justifyContent: "center",
                            background: "#EEF2FF",
                            color: "#4F46E5",
                          }}
                        >
                          <Inventory2Outlined
                            fontSize="small"
                          />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#94A3B8",
                            }}
                          >
                            ID #{product.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#475569",
                        }}
                      >
                        {product.sku}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={
                          <CategoryOutlined
                            sx={{
                              fontSize: "15px !important",
                            }}
                          />
                        }
                        label={getCategoryName(
                          product.category_id,
                        )}
                        size="small"
                        sx={{
                          background: "#F1F5F9",
                          color: "#475569",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        ₹
                        {Number(
                          product.base_price,
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          product.is_active
                            ? "Active"
                            : "Inactive"
                        }
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background:
                            product.is_active
                              ? "#ECFDF5"
                              : "#FEF2F2",
                          color:
                            product.is_active
                              ? "#059669"
                              : "#DC2626",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() =>
                          openEditDialog(product)
                        }
                        sx={{
                          mr: 0.5,
                          color: "#4F46E5",
                        }}
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          void handleToggleStatus(product)
                        }
                        sx={{
                          color:
                            product.is_active
                              ? "#DC2626"
                              : "#059669",
                        }}
                      >
                        <PowerSettingsNew fontSize="small" />
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
              parseInt(event.target.value, 10),
            );
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
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
          {editingProduct
            ? "Edit Product"
            : "Create Product"}

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
            label="Product Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="SKU"
            value={sku}
            onChange={(event) =>
              setSku(event.target.value)
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Base Price"
            type="number"
            value={basePrice}
            onChange={(event) =>
              setBasePrice(event.target.value)
            }
            margin="normal"
            required
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            required
          >
            <InputLabel>Category</InputLabel>

            <Select
              label="Category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(
                  Number(event.target.value),
                )
              }
            >
              {categories
                .filter(
                  (category) => category.is_active,
                )
                .map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            margin="normal"
            multiline
            rows={4}
          />
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
            onClick={() => void handleSave()}
            disabled={saving}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            {saving
              ? "Saving..."
              : editingProduct
                ? "Save Changes"
                : "Create Product"}
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

export default Products;
