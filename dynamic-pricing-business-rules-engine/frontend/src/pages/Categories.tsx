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
  IconButton,
  InputAdornment,
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
  Typography,
} from "@mui/material";

import {
  Add,
  Close,
  EditOutlined,
  PowerSettingsNew,
  Refresh,
  Search,
  CategoryOutlined,
} from "@mui/icons-material";

import {
  activateCategory,
  createCategory,
  deactivateCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

import type { Category } from "../types/category";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

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
      setLoading(true);

      const response = await getCategories(
        page * rowsPerPage,
        rowsPerPage,
        search,
      );

      setCategories(response.items);
      setTotal(response.total);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load categories.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, [page, rowsPerPage, search]);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!saving) {
      setDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showMessage("Category name is required.", "error");
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim() || null,
        });

        showMessage("Category updated successfully.");
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim() || null,
        });

        showMessage("Category created successfully.");
      }

      setDialogOpen(false);
      await loadCategories();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to save category.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      if (category.is_active) {
        await deactivateCategory(category.id);
        showMessage("Category deactivated.");
      } else {
        await activateCategory(category.id);
        showMessage("Category activated.");
      }

      await loadCategories();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to update category status.",
        "error",
      );
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
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: -1,
              color: "#111827",
            }}
          >
            Categories
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Organize products into manageable pricing categories.
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
          Add Category
        </Button>
      </Box>

      {/* Stats */}
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
            Total Categories
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
            {categories.filter((item) => item.is_active).length}
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
            {categories.filter((item) => !item.is_active).length}
          </Typography>
        </Paper>
      </Box>

      {/* Main table */}
      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <TextField
            size="small"
            placeholder="Search categories..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            sx={{
              flex: 1,
              maxWidth: 420,
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

          <IconButton
            onClick={() => void loadCategories()}
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
                  Category
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Description
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
                    colSpan={4}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CategoryOutlined
                      sx={{
                        fontSize: 48,
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
                      No categories found
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#94A3B8",
                        mt: 0.5,
                      }}
                    >
                      Create your first product category.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
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
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#EEF2FF",
                            color: "#4F46E5",
                          }}
                        >
                          <CategoryOutlined fontSize="small" />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {category.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#94A3B8",
                            }}
                          >
                            ID #{category.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#64748B",
                          maxWidth: 400,
                        }}
                      >
                        {category.description || "No description"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          category.is_active
                            ? "Active"
                            : "Inactive"
                        }
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background: category.is_active
                            ? "#ECFDF5"
                            : "#FEF2F2",
                          color: category.is_active
                            ? "#059669"
                            : "#DC2626",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() =>
                          openEditDialog(category)
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
                          void handleToggleStatus(category)
                        }
                        sx={{
                          color: category.is_active
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
          onPageChange={(_, newPage) => setPage(newPage)}
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

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            pb: 1,
          }}
        >
          {editingCategory
            ? "Edit Category"
            : "Create Category"}

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
            label="Category Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            margin="normal"
            required
          />

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
            startIcon={
              saving ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : undefined
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            {saving
              ? "Saving..."
              : editingCategory
                ? "Save Changes"
                : "Create Category"}
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

export default Categories;
