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
  ConfirmationNumberOutlined,
  ContentCopyOutlined,
  Close,
  EditOutlined,
  PercentOutlined,
  PowerSettingsNew,
  Refresh,
  Search,
} from "@mui/icons-material";

import {
  activatePromotion,
  createPromotion,
  deactivatePromotion,
  getPromotions,
  updatePromotion,
} from "../services/promotionService";

import type {
  Promotion,
  PromotionCreateRequest,
} from "../types/promotion";

const DISCOUNT_TYPES = [
  "PERCENTAGE",
  "FIXED",
];

function Promotions() {
  const [promotions, setPromotions] =
    useState<Promotion[]>([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<boolean | "">("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingPromotion, setEditingPromotion] =
    useState<Promotion | null>(null);

  const [code, setCode] = useState("");

  const [discountType, setDiscountType] =
    useState("PERCENTAGE");

  const [discountValue, setDiscountValue] =
    useState("");

  const [minimumPurchase, setMinimumPurchase] =
    useState("");

  const [maximumDiscount, setMaximumDiscount] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [usageLimit, setUsageLimit] =
    useState("");

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

  const loadPromotions = async () => {
    try {
      setLoading(true);

      const response =
        await getPromotions(
          page * rowsPerPage,
          rowsPerPage,
          search,
          statusFilter === ""
            ? undefined
            : statusFilter,
        );

      setPromotions(response.items);
      setTotal(response.total);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load promotions.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPromotions();
  }, [
    page,
    rowsPerPage,
    search,
    statusFilter,
  ]);

  const resetForm = () => {
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinimumPurchase("");
    setMaximumDiscount("");
    setStartDate("");
    setExpiryDate("");
    setUsageLimit("");
  };

  const openCreateDialog = () => {
    setEditingPromotion(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (
    promotion: Promotion,
  ) => {
    setEditingPromotion(promotion);

    setCode(promotion.code);

    setDiscountType(
      promotion.discount_type,
    );

    setDiscountValue(
      String(promotion.discount_value),
    );

    setMinimumPurchase(
      promotion.minimum_purchase !==
        null
        ? String(
            promotion.minimum_purchase,
          )
        : "",
    );

    setMaximumDiscount(
      promotion.maximum_discount !==
        null
        ? String(
            promotion.maximum_discount,
          )
        : "",
    );

    setStartDate(
      promotion.start_date
        ? promotion.start_date.slice(0, 16)
        : "",
    );

    setExpiryDate(
      promotion.expiry_date
        ? promotion.expiry_date.slice(0, 16)
        : "",
    );

    setUsageLimit(
      promotion.usage_limit !== null
        ? String(promotion.usage_limit)
        : "",
    );

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!saving) {
      setDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!code.trim()) {
      showMessage(
        "Promotion code is required.",
        "error",
      );
      return;
    }

    if (
      !discountValue ||
      Number(discountValue) < 0
    ) {
      showMessage(
        "Enter a valid discount value.",
        "error",
      );
      return;
    }

    if (
      discountType === "PERCENTAGE" &&
      Number(discountValue) > 100
    ) {
      showMessage(
        "Percentage discount cannot exceed 100%.",
        "error",
      );
      return;
    }

    if (!startDate || !expiryDate) {
      showMessage(
        "Start and expiry dates are required.",
        "error",
      );
      return;
    }

    if (
      new Date(startDate) >=
      new Date(expiryDate)
    ) {
      showMessage(
        "Expiry date must be after start date.",
        "error",
      );
      return;
    }

    try {
      setSaving(true);

      const payload: PromotionCreateRequest =
        {
          code: code
            .trim()
            .toUpperCase(),

          discount_type:
            discountType,

          discount_value:
            Number(discountValue),

          minimum_purchase:
            minimumPurchase === ""
              ? null
              : Number(
                  minimumPurchase,
                ),

          maximum_discount:
            maximumDiscount === ""
              ? null
              : Number(
                  maximumDiscount,
                ),

          start_date: startDate,

          expiry_date: expiryDate,

          usage_limit:
            usageLimit === ""
              ? null
              : Number(usageLimit),
        };

      if (editingPromotion) {
        await updatePromotion(
          editingPromotion.id,
          payload,
        );

        showMessage(
          "Promotion updated successfully.",
        );
      } else {
        await createPromotion(
          payload,
        );

        showMessage(
          "Promotion created successfully.",
        );
      }

      setDialogOpen(false);

      await loadPromotions();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to save promotion.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (
    promotion: Promotion,
  ) => {
    try {
      if (promotion.is_active) {
        await deactivatePromotion(
          promotion.id,
        );

        showMessage(
          "Promotion deactivated.",
        );
      } else {
        await activatePromotion(
          promotion.id,
        );

        showMessage(
          "Promotion activated.",
        );
      }

      await loadPromotions();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to update promotion status.",
        "error",
      );
    }
  };

  const copyCode = async (
    promotionCode: string,
  ) => {
    try {
      await navigator.clipboard.writeText(
        promotionCode,
      );

      showMessage(
        "Promotion code copied.",
      );
    } catch {
      showMessage(
        "Unable to copy promotion code.",
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
            Promotions
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Manage promotional codes and
            discount campaigns.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={
            openCreateDialog
          }
          sx={{
            height: 44,
            px: 2.5,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Create Promotion
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
            border:
              "1px solid #E2E8F0",
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
            Total Promotions
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
            border:
              "1px solid #E2E8F0",
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
            Active Promotions
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
              promotions.filter(
                (promotion) =>
                  promotion.is_active,
              ).length
            }
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border:
              "1px solid #E2E8F0",
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
            Total Usage
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mt: 0.5,
              color: "#4F46E5",
            }}
          >
            {promotions.reduce(
              (sum, promotion) =>
                sum +
                promotion.usage_count,
              0,
            )}
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
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
            placeholder="Search promotion code..."
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value,
              );
              setPage(0);
            }}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 280,
              },
              flex: 1,
              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 2.5,
                  background:
                    "#F8FAFC",
                },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      sx={{
                        color:
                          "#94A3B8",
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
              minWidth: 140,
            }}
          >
            <InputLabel>
              Status
            </InputLabel>

            <Select
              label="Status"
              value={
                statusFilter === ""
                  ? ""
                  : String(
                      statusFilter,
                    )
              }
              onChange={(event) => {
                const value =
                  event.target
                    .value as string;

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
            onClick={() =>
              void loadPromotions()
            }
            disabled={loading}
            sx={{
              border:
                "1px solid #E2E8F0",
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
                  background:
                    "#F8FAFC",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  Promotion
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  Discount
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  Purchase Rules
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  Validity
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  Usage
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    color:
                      "#475569",
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
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CircularProgress
                      size={30}
                    />
                  </TableCell>
                </TableRow>
              ) : promotions.length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <ConfirmationNumberOutlined
                      sx={{
                        fontSize: 50,
                        color:
                          "#CBD5E1",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color:
                          "#475569",
                      }}
                    >
                      No promotions
                      found
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color:
                          "#94A3B8",
                        mt: 0.5,
                      }}
                    >
                      Create a
                      promotion to
                      offer dynamic
                      discounts.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                promotions.map(
                  (promotion) => (
                    <TableRow
                      key={
                        promotion.id
                      }
                      hover
                      sx={{
                        "&:last-child td":
                          {
                            borderBottom:
                              0,
                          },
                      }}
                    >
                      {/* Code */}
                      <TableCell>
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              background:
                                "#FFF7ED",
                              color:
                                "#EA580C",
                            }}
                          >
                            <ConfirmationNumberOutlined
                              fontSize="small"
                            />
                          </Box>

                          <Box>
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight:
                                    800,
                                  fontSize:
                                    14,
                                }}
                              >
                                {
                                  promotion.code
                                }
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() =>
                                  void copyCode(
                                    promotion.code,
                                  )
                                }
                                sx={{
                                  p: 0.3,
                                  color:
                                    "#94A3B8",
                                }}
                              >
                                <ContentCopyOutlined
                                  sx={{
                                    fontSize:
                                      14,
                                  }}
                                />
                              </IconButton>
                            </Box>

                            <Typography
                              sx={{
                                fontSize:
                                  11,
                                color:
                                  "#94A3B8",
                              }}
                            >
                              ID #
                              {
                                promotion.id
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Discount */}
                      <TableCell>
                        <Chip
                          icon={
                            promotion.discount_type ===
                            "PERCENTAGE" ? (
                              <PercentOutlined />
                            ) : undefined
                          }
                          label={
                            promotion.discount_type ===
                            "PERCENTAGE"
                              ? `${promotion.discount_value}%`
                              : `₹${Number(
                                  promotion.discount_value,
                                ).toLocaleString(
                                  "en-IN",
                                )}`
                          }
                          size="small"
                          sx={{
                            background:
                              "#ECFDF5",
                            color:
                              "#059669",
                            fontWeight:
                              800,
                          }}
                        />
                      </TableCell>

                      {/* Purchase rules */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize:
                              12,
                            color:
                              "#475569",
                          }}
                        >
                          Min:{" "}
                          {promotion.minimum_purchase !==
                          null
                            ? `₹${Number(
                                promotion.minimum_purchase,
                              ).toLocaleString(
                                "en-IN",
                              )}`
                            : "None"}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              12,
                            color:
                              "#64748B",
                          }}
                        >
                          Max:{" "}
                          {promotion.maximum_discount !==
                          null
                            ? `₹${Number(
                                promotion.maximum_discount,
                              ).toLocaleString(
                                "en-IN",
                              )}`
                            : "None"}
                        </Typography>
                      </TableCell>

                      {/* Validity */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize:
                              12,
                            fontWeight:
                              600,
                            color:
                              "#475569",
                          }}
                        >
                          {new Date(
                            promotion.start_date,
                          ).toLocaleDateString(
                            "en-IN",
                          )}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              11,
                            color:
                              "#94A3B8",
                          }}
                        >
                          to{" "}
                          {new Date(
                            promotion.expiry_date,
                          ).toLocaleDateString(
                            "en-IN",
                          )}
                        </Typography>
                      </TableCell>

                      {/* Usage */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize:
                              13,
                            fontWeight:
                              800,
                          }}
                        >
                          {
                            promotion.usage_count
                          }
                          {promotion.usage_limit !==
                          null
                            ? ` / ${promotion.usage_limit}`
                            : " / ∞"}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={
                            promotion.is_active
                              ? "Active"
                              : "Inactive"
                          }
                          size="small"
                          sx={{
                            fontWeight:
                              700,
                            background:
                              promotion.is_active
                                ? "#ECFDF5"
                                : "#FEF2F2",
                            color:
                              promotion.is_active
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
                              promotion,
                            )
                          }
                          sx={{
                            mr: 0.5,
                            color:
                              "#4F46E5",
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
                              promotion,
                            )
                          }
                          sx={{
                            color:
                              promotion.is_active
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
                  ),
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(
            _,
            newPage,
          ) => setPage(newPage)}
          rowsPerPage={
            rowsPerPage
          }
          onRowsPerPageChange={(
            event,
          ) => {
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
          }}
        >
          {editingPromotion
            ? "Edit Promotion"
            : "Create Promotion"}

          <IconButton
            onClick={closeDialog}
            disabled={saving}
            sx={{
              position:
                "absolute",
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
            label="Promotion Code"
            placeholder="e.g. PREMIUM10"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value.toUpperCase(),
              )
            }
            margin="normal"
            required
          />

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
            <FormControl fullWidth>
              <InputLabel>
                Discount Type
              </InputLabel>

              <Select
                label="Discount Type"
                value={discountType}
                onChange={(event) =>
                  setDiscountType(
                    event.target
                      .value as string,
                  )
                }
              >
                {DISCOUNT_TYPES.map(
                  (type) => (
                    <MenuItem
                      key={type}
                      value={type}
                    >
                      {type}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Discount Value"
              type="number"
              value={discountValue}
              onChange={(event) =>
                setDiscountValue(
                  event.target.value,
                )
              }
              required
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="Minimum Purchase"
              type="number"
              value={
                minimumPurchase
              }
              onChange={(event) =>
                setMinimumPurchase(
                  event.target.value,
                )
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
            />

            <TextField
              label="Maximum Discount"
              type="number"
              value={
                maximumDiscount
              }
              onChange={(event) =>
                setMaximumDiscount(
                  event.target.value,
                )
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="Start Date"
              type="datetime-local"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />

            <TextField
              label="Expiry Date"
              type="datetime-local"
              value={expiryDate}
              onChange={(event) =>
                setExpiryDate(
                  event.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />
          </Box>

          <TextField
            fullWidth
            label="Usage Limit"
            type="number"
            value={usageLimit}
            onChange={(event) =>
              setUsageLimit(
                event.target.value,
              )
            }
            margin="normal"
            helperText="Leave empty for unlimited usage."
            slotProps={{
              htmlInput: {
                min: 1,
                step: 1,
              },
            }}
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
              textTransform:
                "none",
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
              textTransform:
                "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            {saving
              ? "Saving..."
              : editingPromotion
                ? "Save Changes"
                : "Create Promotion"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Promotions;