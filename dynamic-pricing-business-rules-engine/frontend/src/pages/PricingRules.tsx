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
  DeleteOutlined,
  EditOutlined,
  PowerSettingsNew,
  Refresh,
  RuleOutlined,
} from "@mui/icons-material";

import {
  activatePricingRule,
  createPricingRule,
  deactivatePricingRule,
  getPricingRules,
  updatePricingRule,
} from "../services/pricingRuleService";

import type {
  PricingRule,
  PricingRuleCreateRequest,
  RuleActionRequest,
  RuleConditionRequest,
} from "../types/pricingRule";

const CONDITION_FIELDS = [
  { value: "customer_type", label: "Customer Type" },
  { value: "customer_category", label: "Customer Category" },
  { value: "location", label: "Location" },
  { value: "quantity", label: "Quantity" },
  { value: "category_id", label: "Category ID" },
  { value: "product_id", label: "Product ID" },
  { value: "base_price", label: "Base Price" },
  { value: "promotion_code", label: "Promotion Code" },
];

const OPERATORS = [
  "=",
  "!=",
  ">",
  ">=",
  "<",
  "<=",
  "IN",
  "NOT_IN",
  "CONTAINS",
];

const EXECUTION_TYPES = [
  "COMBINABLE",
  "EXCLUSIVE",
  "OVERRIDE",
];

const ACTION_TYPES = [
  "DISCOUNT",
  "SURCHARGE",
  "OVERRIDE_PRICE",
];

const DISCOUNT_TYPES = [
  "PERCENTAGE",
  "FIXED",
];

const emptyCondition = (): RuleConditionRequest => ({
  field: "customer_type",
  operator: "=",
  value: "",
  condition_group: 1,
  logical_operator: "AND",
});

const emptyAction = (): RuleActionRequest => ({
  action_type: "DISCOUNT",
  discount_type: "PERCENTAGE",
  value: 0,
});

function PricingRules() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<boolean | "">("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] =
    useState<PricingRule | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] = useState("100");
  const [executionType, setExecutionType] =
    useState("COMBINABLE");
  const [maximumDiscount, setMaximumDiscount] =
    useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [conditions, setConditions] = useState<
    RuleConditionRequest[]
  >([emptyCondition()]);

  const [actions, setActions] = useState<
    RuleActionRequest[]
  >([emptyAction()]);

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

  const loadRules = async () => {
    try {
      setLoading(true);

      const response = await getPricingRules(
        page * rowsPerPage,
        rowsPerPage,
        search,
        statusFilter === ""
          ? undefined
          : statusFilter,
      );

      setRules(response.items);
      setTotal(response.total);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Failed to load pricing rules.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRules();
  }, [
    page,
    rowsPerPage,
    search,
    statusFilter,
  ]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPriority("100");
    setExecutionType("COMBINABLE");
    setMaximumDiscount("");
    setStartDate("");
    setEndDate("");
    setConditions([emptyCondition()]);
    setActions([emptyAction()]);
  };

  const openCreateDialog = () => {
    setEditingRule(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (rule: PricingRule) => {
    setEditingRule(rule);

    setName(rule.name);
    setDescription(rule.description || "");
    setPriority(String(rule.priority));
    setExecutionType(rule.execution_type);
    setMaximumDiscount(
      rule.maximum_discount !== null
        ? String(rule.maximum_discount)
        : "",
    );

    setStartDate(
      rule.start_date
        ? rule.start_date.slice(0, 16)
        : "",
    );

    setEndDate(
      rule.end_date
        ? rule.end_date.slice(0, 16)
        : "",
    );

    setConditions(
      rule.conditions.length > 0
        ? rule.conditions.map((condition) => ({
            field: condition.field,
            operator: condition.operator,
            value: condition.value,
            condition_group:
              condition.condition_group,
            logical_operator:
              condition.logical_operator,
          }))
        : [emptyCondition()],
    );

    setActions(
      rule.actions.length > 0
        ? rule.actions.map((action) => ({
            action_type: action.action_type,
            discount_type:
              action.discount_type,
            value: Number(action.value),
          }))
        : [emptyAction()],
    );

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!saving) {
      setDialogOpen(false);
    }
  };

  const updateCondition = (
    index: number,
    field: keyof RuleConditionRequest,
    value: string | number,
  ) => {
    setConditions((current) =>
      current.map((condition, conditionIndex) =>
        conditionIndex === index
          ? {
              ...condition,
              [field]: value,
            }
          : condition,
      ),
    );
  };

  const addCondition = () => {
    setConditions((current) => [
      ...current,
      {
        ...emptyCondition(),
        condition_group:
          current.length + 1,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions((current) =>
      current.filter(
        (_, conditionIndex) =>
          conditionIndex !== index,
      ),
    );
  };

  const updateAction = (
    index: number,
    field: keyof RuleActionRequest,
    value: string | number | null,
  ) => {
    setActions((current) =>
      current.map((action, actionIndex) =>
        actionIndex === index
          ? {
              ...action,
              [field]: value,
            }
          : action,
      ),
    );
  };

  const addAction = () => {
    setActions((current) => [
      ...current,
      emptyAction(),
    ]);
  };

  const removeAction = (index: number) => {
    setActions((current) =>
      current.filter(
        (_, actionIndex) =>
          actionIndex !== index,
      ),
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showMessage(
        "Rule name is required.",
        "error",
      );
      return;
    }

    if (
      !priority ||
      Number(priority) < 1
    ) {
      showMessage(
        "Priority must be greater than 0.",
        "error",
      );
      return;
    }

    if (conditions.length === 0) {
      showMessage(
        "At least one condition is required.",
        "error",
      );
      return;
    }

    const invalidCondition = conditions.some(
      (condition) =>
        !condition.field ||
        !condition.operator ||
        !condition.value.trim(),
    );

    if (invalidCondition) {
      showMessage(
        "Please complete all rule conditions.",
        "error",
      );
      return;
    }

    if (actions.length === 0) {
      showMessage(
        "At least one action is required.",
        "error",
      );
      return;
    }

    const invalidAction = actions.some(
      (action) =>
        !action.action_type ||
        action.value < 0 ||
        (action.action_type ===
          "DISCOUNT" &&
          !action.discount_type),
    );

    if (invalidAction) {
      showMessage(
        "Please complete all rule actions.",
        "error",
      );
      return;
    }

    if (
      startDate &&
      endDate &&
      new Date(startDate) >
        new Date(endDate)
    ) {
      showMessage(
        "End date must be after start date.",
        "error",
      );
      return;
    }

    try {
      setSaving(true);

      const payload: PricingRuleCreateRequest =
        {
          name: name.trim(),
          description:
            description.trim() || null,
          priority: Number(priority),
          execution_type: executionType,
          maximum_discount:
            maximumDiscount === ""
              ? null
              : Number(maximumDiscount),
          start_date:
            startDate || null,
          end_date:
            endDate || null,
          conditions,
          actions,
        };

      if (editingRule) {
        await updatePricingRule(
          editingRule.id,
          payload,
        );

        showMessage(
          "Pricing rule updated successfully.",
        );
      } else {
        await createPricingRule(payload);

        showMessage(
          "Pricing rule created successfully.",
        );
      }

      setDialogOpen(false);
      await loadRules();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to save pricing rule.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (
    rule: PricingRule,
  ) => {
    try {
      if (rule.is_active) {
        await deactivatePricingRule(rule.id);

        showMessage(
          "Pricing rule deactivated.",
        );
      } else {
        await activatePricingRule(rule.id);

        showMessage(
          "Pricing rule activated.",
        );
      }

      await loadRules();
    } catch (error: any) {
      showMessage(
        error?.response?.data?.detail ||
          "Unable to update rule status.",
        "error",
      );
    }
  };

  const getActionLabel = (
    action: PricingRule["actions"][number],
  ) => {
    if (action.action_type === "DISCOUNT") {
      return `${action.value}${action.discount_type === "PERCENTAGE" ? "%" : " fixed"}`;
    }

    if (action.action_type === "SURCHARGE") {
      return `+${action.value}${action.discount_type === "PERCENTAGE" ? "%" : " fixed"}`;
    }

    return `₹${Number(action.value).toLocaleString(
      "en-IN",
    )}`;
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
            Pricing Rules
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Configure dynamic pricing logic
            without changing source code.
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
          Create Rule
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
            Total Rules
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
            Active Rules
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
              rules.filter(
                (rule) =>
                  rule.is_active,
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
            Highest Priority
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mt: 0.5,
              color: "#4F46E5",
            }}
          >
            {rules.length
              ? Math.min(
                  ...rules.map(
                    (rule) =>
                      rule.priority,
                  ),
                )
              : "—"}
          </Typography>
        </Paper>
      </Box>

      {/* Main table */}
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
            placeholder="Search pricing rules..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 280,
              },
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                background: "#F8FAFC",
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 140,
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
              void loadRules()
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
                    color: "#475569",
                  }}
                >
                  Rule
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Priority
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Conditions
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Actions
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                  }}
                >
                  Execution
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
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CircularProgress
                      size={30}
                    />
                  </TableCell>
                </TableRow>
              ) : rules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <RuleOutlined
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
                      No pricing rules
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
                      Create a rule
                      to start
                      configuring
                      dynamic pricing.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow
                    key={rule.id}
                    hover
                    sx={{
                      "&:last-child td":
                        {
                          borderBottom:
                            0,
                        },
                    }}
                  >
                    {/* Rule */}
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
                              "#EEF2FF",
                            color:
                              "#4F46E5",
                          }}
                        >
                          <RuleOutlined
                            fontSize="small"
                          />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight:
                                700,
                              fontSize:
                                14,
                            }}
                          >
                            {rule.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize:
                                11,
                              color:
                                "#94A3B8",
                            }}
                          >
                            ID #{rule.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <Chip
                        label={rule.priority}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          background:
                            "#F1F5F9",
                          color:
                            "#334155",
                        }}
                      />
                    </TableCell>

                    {/* Conditions */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color:
                            "#475569",
                        }}
                      >
                        {rule.conditions
                          .length}{" "}
                        condition
                        {rule.conditions
                          .length !== 1
                          ? "s"
                          : ""}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box
                        sx={{
                          display:
                            "flex",
                          flexWrap:
                            "wrap",
                          gap: 0.5,
                        }}
                      >
                        {rule.actions.map(
                          (
                            action,
                            index,
                          ) => (
                            <Chip
                              key={
                                index
                              }
                              label={getActionLabel(
                                action,
                              )}
                              size="small"
                              sx={{
                                fontWeight:
                                  700,
                                background:
                                  "#ECFDF5",
                                color:
                                  "#059669",
                              }}
                            />
                          ),
                        )}
                      </Box>
                    </TableCell>

                    {/* Execution */}
                    <TableCell>
                      <Chip
                        label={
                          rule.execution_type
                        }
                        size="small"
                        sx={{
                          fontWeight:
                            700,
                          background:
                            rule.execution_type ===
                            "OVERRIDE"
                              ? "#FEF2F2"
                              : rule.execution_type ===
                                  "EXCLUSIVE"
                                ? "#FFF7ED"
                                : "#EEF2FF",
                          color:
                            rule.execution_type ===
                            "OVERRIDE"
                              ? "#DC2626"
                              : rule.execution_type ===
                                  "EXCLUSIVE"
                                ? "#EA580C"
                                : "#4F46E5",
                        }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={
                          rule.is_active
                            ? "Active"
                            : "Inactive"
                        }
                        size="small"
                        sx={{
                          fontWeight:
                            700,
                          background:
                            rule.is_active
                              ? "#ECFDF5"
                              : "#FEF2F2",
                          color:
                            rule.is_active
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
                            rule,
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
                            rule,
                          )
                        }
                        sx={{
                          color:
                            rule.is_active
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
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          {editingRule
            ? "Edit Pricing Rule"
            : "Create Pricing Rule"}

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
          {/* Basic Information */}
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 15,
              mt: 1,
              mb: 1,
            }}
          >
            Rule Configuration
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "2fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Rule Name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              required
              fullWidth
            />

            <TextField
              label="Priority"
              type="number"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value,
                )
              }
              required
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            margin="normal"
            multiline
            rows={2}
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
                Execution Type
              </InputLabel>

              <Select
                label="Execution Type"
                value={executionType}
                onChange={(event) =>
                  setExecutionType(
                    event.target
                      .value as string,
                  )
                }
              >
                {EXECUTION_TYPES.map(
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
            />

            <TextField
              label="End Date"
              type="datetime-local"
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          {/* Conditions */}
          <Box
            sx={{
              mt: 4,
              mb: 2,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                Conditions
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color:
                    "#64748B",
                  mt: 0.3,
                }}
              >
                Define when this rule
                should apply.
              </Typography>
            </Box>

            <Button
              size="small"
              startIcon={<Add />}
              onClick={
                addCondition
              }
              sx={{
                textTransform:
                  "none",
                fontWeight: 700,
              }}
            >
              Add Condition
            </Button>
          </Box>

          {conditions.map(
            (
              condition,
              index,
            ) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2.5,
                  background:
                    "#FAFAFC",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      {
                        xs: "1fr",
                        sm: "1.2fr 1fr 1.5fr 0.8fr auto",
                      },
                    gap: 1.5,
                    alignItems:
                      "center",
                  }}
                >
                  <FormControl
                    size="small"
                    fullWidth
                  >
                    <InputLabel>
                      Field
                    </InputLabel>

                    <Select
                      label="Field"
                      value={
                        condition.field
                      }
                      onChange={(
                        event,
                      ) =>
                        updateCondition(
                          index,
                          "field",
                          event
                            .target
                            .value as string,
                        )
                      }
                    >
                      {CONDITION_FIELDS.map(
                        (field) => (
                          <MenuItem
                            key={
                              field.value
                            }
                            value={
                              field.value
                            }
                          >
                            {
                              field.label
                            }
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    fullWidth
                  >
                    <InputLabel>
                      Operator
                    </InputLabel>

                    <Select
                      label="Operator"
                      value={
                        condition.operator
                      }
                      onChange={(
                        event,
                      ) =>
                        updateCondition(
                          index,
                          "operator",
                          event
                            .target
                            .value as string,
                        )
                      }
                    >
                      {OPERATORS.map(
                        (operator) => (
                          <MenuItem
                            key={
                              operator
                            }
                            value={
                              operator
                            }
                          >
                            {operator}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Value"
                    value={
                      condition.value
                    }
                    onChange={(
                      event,
                    ) =>
                      updateCondition(
                        index,
                        "value",
                        event.target
                          .value,
                      )
                    }
                  />

                  <FormControl
                    size="small"
                    fullWidth
                  >
                    <InputLabel>
                      Logic
                    </InputLabel>

                    <Select
                      label="Logic"
                      value={
                        condition.logical_operator
                      }
                      onChange={(
                        event,
                      ) =>
                        updateCondition(
                          index,
                          "logical_operator",
                          event
                            .target
                            .value as string,
                        )
                      }
                    >
                      <MenuItem value="AND">
                        AND
                      </MenuItem>

                      <MenuItem value="OR">
                        OR
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <IconButton
                    disabled={
                      conditions.length ===
                      1
                    }
                    onClick={() =>
                      removeCondition(
                        index,
                      )
                    }
                    sx={{
                      color:
                        "#DC2626",
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              </Paper>
            ),
          )}

          {/* Actions */}
          <Box
            sx={{
              mt: 4,
              mb: 2,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                Actions
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color:
                    "#64748B",
                  mt: 0.3,
                }}
              >
                Define what happens when
                the rule matches.
              </Typography>
            </Box>

            <Button
              size="small"
              startIcon={<Add />}
              onClick={addAction}
              sx={{
                textTransform:
                  "none",
                fontWeight: 700,
              }}
            >
              Add Action
            </Button>
          </Box>

          {actions.map(
            (action, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2.5,
                  background:
                    "#FAFAFC",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      {
                        xs: "1fr",
                        sm: "1.3fr 1.3fr 1fr auto",
                      },
                    gap: 1.5,
                    alignItems:
                      "center",
                  }}
                >
                  <FormControl
                    size="small"
                    fullWidth
                  >
                    <InputLabel>
                      Action
                    </InputLabel>

                    <Select
                      label="Action"
                      value={
                        action.action_type
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAction(
                          index,
                          "action_type",
                          event
                            .target
                            .value as string,
                        )
                      }
                    >
                      {ACTION_TYPES.map(
                        (type) => (
                          <MenuItem
                            key={
                              type
                            }
                            value={
                              type
                            }
                          >
                            {type}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    fullWidth
                    disabled={
                      action.action_type !==
                      "DISCOUNT"
                    }
                  >
                    <InputLabel>
                      Discount Type
                    </InputLabel>

                    <Select
                      label="Discount Type"
                      value={
                        action.discount_type ||
                        ""
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAction(
                          index,
                          "discount_type",
                          event
                            .target
                            .value as string,
                        )
                      }
                    >
                      {DISCOUNT_TYPES.map(
                        (type) => (
                          <MenuItem
                            key={
                              type
                            }
                            value={
                              type
                            }
                          >
                            {type}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Value"
                    type="number"
                    value={action.value}
                    onChange={(
                      event,
                    ) =>
                      updateAction(
                        index,
                        "value",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: "0.01",
                      },
                    }}
                  />

                  <IconButton
                    disabled={
                      actions.length ===
                      1
                    }
                    onClick={() =>
                      removeAction(
                        index,
                      )
                    }
                    sx={{
                      color:
                        "#DC2626",
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              </Paper>
            ),
          )}
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
              : editingRule
                ? "Save Changes"
                : "Create Rule"}
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

export default PricingRules;