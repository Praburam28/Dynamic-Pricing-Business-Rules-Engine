import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography as MuiTypography,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  AttachMoneyOutlined,
  AutoGraphOutlined,
  CalculateOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  PercentOutlined,
  RefreshOutlined,
  RuleOutlined,
  TrendingDownOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

import api from "../api/axios";

const Typography = MuiTypography as ComponentType<any>;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTooltip,
  Legend,
  Filler,
);

interface DashboardSummary {
  total_calculations: number;
  total_original_value: number;
  total_discount: number;
  total_tax: number;
  total_final_value: number;
  active_products: number;
  active_customers: number;
  active_pricing_rules: number;
}

interface RecentCalculation {
  calculation_id: number;
  product_id: number;
  customer_id: number;
  quantity: number;
  original_price: number;
  discount_amount: number;
  tax_amount: number;
  final_price: number;
  calculated_at: string;
}

interface RuleUsage {
  rule_id: number;
  rule_name: string;
  usage_count: number;
}

interface DashboardAnalytics {
  summary: DashboardSummary;
  recent_calculations: RecentCalculation[];
  rule_usage: RuleUsage[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const [analytics, setAnalytics] =
    useState<DashboardAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const response = await api.get<DashboardAnalytics>(
        "/dashboard/analytics",
      );

      setAnalytics(response.data);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load dashboard analytics.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const summary = analytics?.summary;

  const discountPercentage = useMemo(() => {
    if (!summary || summary.total_original_value <= 0) {
      return 0;
    }

    return (
      (summary.total_discount /
        summary.total_original_value) *
      100
    );
  }, [summary]);

  const revenuePercentage = useMemo(() => {
    if (!summary || summary.total_original_value <= 0) {
      return 0;
    }

    return (
      (summary.total_final_value /
        summary.total_original_value) *
      100
    );
  }, [summary]);

  const topRules = useMemo(() => {
    if (!analytics?.rule_usage) {
      return [];
    }

    return [...analytics.rule_usage]
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5);
  }, [analytics]);

  const maxRuleUsage = useMemo(() => {
    if (!topRules.length) {
      return 1;
    }

    return Math.max(...topRules.map((rule) => rule.usage_count), 1);
  }, [topRules]);

  const trendData = useMemo(() => {
    const calculations =
      analytics?.recent_calculations || [];

    const sorted = [...calculations]
      .sort(
        (a, b) =>
          new Date(a.calculated_at).getTime() -
          new Date(b.calculated_at).getTime(),
      )
      .slice(-10);

    return {
      labels: sorted.map((item) =>
        new Date(item.calculated_at).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          },
        ),
      ),
      datasets: [
        {
          label: "Original Value",
          data: sorted.map((item) => item.original_price),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(79, 70, 229, 0.08)",
          borderColor: "#4F46E5",
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Final Value",
          data: sorted.map((item) => item.final_price),
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          borderColor: "#7C3AED",
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [analytics]);

  const ruleChartData = useMemo(() => {
  return {
    labels: topRules.map((rule) => rule.rule_name),
    datasets: [
      {
        label: "Rule Usage",
        data: topRules.map((rule) => rule.usage_count),
        backgroundColor: [
          "#4F46E5",
          "#7C3AED",
          "#8B5CF6",
          "#A855F7",
          "#C084FC",
        ],
        hoverBackgroundColor: [
          "#4338CA",
          "#6D28D9",
          "#7C3AED",
          "#9333EA",
          "#A855F7",
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
}, [topRules]);

  const discountChartData = useMemo(() => {
  return {
    labels: [
      "Final Value",
      "Discount",
      "Tax",
    ],
    datasets: [
      {
        data: [
          Number(summary?.total_final_value || 0),
          Number(summary?.total_discount || 0),
          Number(summary?.total_tax || 0),
        ],
        backgroundColor: [
          "#4F46E5",
          "#F97316",
          "#10B981",
        ],
        hoverBackgroundColor: [
          "#4338CA",
          "#EA580C",
          "#059669",
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };
}, [summary]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={42} />
        <Typography
          sx={{
            color: "#64748B",
            fontSize: 14,
          }}
        >
          Loading pricing intelligence...
        </Typography>
      </Box>
    );
  }

  if (error && !analytics) {
    return (
      <Box>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
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
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#6366F1",
              textTransform: "uppercase",
              letterSpacing: ".1em",
              mb: 0.6,
            }}
          >
            Pricing Intelligence
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: 28,
                md: 34,
              },
              fontWeight: 850,
              color: "#0F172A",
              letterSpacing: "-0.035em",
            }}
          >
            Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: "#64748B",
              fontSize: 14,
            }}
          >
            Monitor pricing activity, discounts, rules and
            business performance.
          </Typography>
        </Box>

        <Tooltip title="Refresh dashboard">
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              width: 44,
              height: 44,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              borderRadius: 2,
            }}
          >
            {refreshing ? (
              <CircularProgress size={20} />
            ) : (
              <RefreshOutlined />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#EEF2FF",
                    color: "#4F46E5",
                  }}
                >
                  <CalculateOutlined />
                </Box>

                <Chip
                  label="Activity"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                Total Calculations
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 28,
                  fontWeight: 850,
                  color: "#0F172A",
                }}
              >
                {formatNumber(
                  summary?.total_calculations || 0,
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F0FDF4",
                    color: "#16A34A",
                  }}
                >
                  <AttachMoneyOutlined />
                </Box>

                <TrendingUpOutlined
                  sx={{
                    color: "#16A34A",
                    fontSize: 21,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                Final Value
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 25,
                  fontWeight: 850,
                  color: "#0F172A",
                }}
              >
                {formatCurrency(
                  summary?.total_final_value || 0,
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FFF7ED",
                    color: "#EA580C",
                  }}
                >
                  <PercentOutlined />
                </Box>

                <TrendingDownOutlined
                  sx={{
                    color: "#EA580C",
                    fontSize: 21,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                Total Discount
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 25,
                  fontWeight: 850,
                  color: "#0F172A",
                }}
              >
                {formatCurrency(
                  summary?.total_discount || 0,
                )}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "#EA580C",
                  fontWeight: 700,
                }}
              >
                {discountPercentage.toFixed(1)}% of original
                value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F5F3FF",
                    color: "#7C3AED",
                  }}
                >
                  <AutoGraphOutlined />
                </Box>

                <Chip
                  label={`${revenuePercentage.toFixed(1)}%`}
                  size="small"
                  color="secondary"
                  sx={{
                    height: 24,
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                Tax Collected
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 25,
                  fontWeight: 850,
                  color: "#0F172A",
                }}
              >
                {formatCurrency(
                  summary?.total_tax || 0,
                )}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                Across all calculations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Business Stats */}
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#EFF6FF",
                  color: "#2563EB",
                }}
              >
                <Inventory2Outlined />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Active Products
                </Typography>

                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 850,
                    color: "#0F172A",
                  }}
                >
                  {formatNumber(
                    summary?.active_products || 0,
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F0FDF4",
                  color: "#16A34A",
                }}
              >
                <GroupsOutlined />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Active Customers
                </Typography>

                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 850,
                    color: "#0F172A",
                  }}
                >
                  {formatNumber(
                    summary?.active_customers || 0,
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F5F3FF",
                  color: "#7C3AED",
                }}
              >
                <RuleOutlined />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Active Pricing Rules
                </Typography>

                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 850,
                    color: "#0F172A",
                  }}
                >
                  {formatNumber(
                    summary?.active_pricing_rules || 0,
                  )}
                </Typography>
              </Box>

              <Chip
                label="Live"
                size="small"
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#0F172A",
                    }}
                  >
                    Pricing Value Trend
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 12,
                      color: "#64748B",
                    }}
                  >
                    Original vs final pricing value
                  </Typography>
                </Box>

                <Chip
                  icon={<AutoGraphOutlined />}
                  label="Recent activity"
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ height: 310 }}>
                {trendData.labels.length > 0 ? (
                  <Line
                    data={trendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        intersect: false,
                        mode: "index",
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          align: "end",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 7,
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          border: {
                            display: false,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          border: {
                            display: false,
                          },
                          grid: {
                            color: "rgba(148,163,184,.12)",
                          },
                          ticks: {
                            callback: (value) =>
                              `₹${Number(value).toLocaleString(
                                "en-IN",
                              )}`,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState message="No calculation activity available yet." />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                Value Distribution
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                Pricing calculation composition
              </Typography>

              <Box
                sx={{
                  height: 250,
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {(summary?.total_final_value || 0) > 0 ? (
                  <Doughnut
                    data={discountChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "70%",
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 18,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState message="No pricing values available yet." />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Original Value
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 750,
                  }}
                >
                  {formatCurrency(
                    summary?.total_original_value || 0,
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Final Value
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#4F46E5",
                  }}
                >
                  {formatCurrency(
                    summary?.total_final_value || 0,
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Rule Usage */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#0F172A",
                  }}
                >
                  Most Used Rules
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Rules driving the most pricing decisions
                </Typography>
              </Box>

              {topRules.length === 0 ? (
                <EmptyState message="No rule usage data available yet." />
              ) : (
                <Box>
                  {topRules.map((rule, index) => (
                    <Box
                      key={rule.rule_id}
                      sx={{
                        mb:
                          index === topRules.length - 1
                            ? 0
                            : 2.2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          mb: 0.8,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#334155",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {rule.rule_name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#4F46E5",
                          }}
                        >
                          {formatNumber(
                            rule.usage_count,
                          )}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={
                          (rule.usage_count /
                            maxRuleUsage) *
                          100
                        }
                        sx={{
                          height: 7,
                          borderRadius: 5,
                          background: "#EEF2FF",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            background:
                              "linear-gradient(90deg,#4F46E5,#7C3AED)",
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Rule Bar Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                Rule Performance
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  mb: 2,
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                Number of times each pricing rule was applied
              </Typography>

              <Box sx={{ height: 260 }}>
                {topRules.length > 0 ? (
                  <Bar
                    data={ruleChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          border: {
                            display: false,
                          },
                          ticks: {
                            maxRotation: 35,
                            minRotation: 0,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          border: {
                            display: false,
                          },
                          grid: {
                            color: "rgba(148,163,184,.12)",
                          },
                          ticks: {
                            precision: 0,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState message="No rule performance data available yet." />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Calculations */}
      <Card
        elevation={0}
        sx={{
          mt: 2.5,
          border: "1px solid #E2E8F0",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
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
              gap: 1,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                Recent Pricing Calculations
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                Latest pricing engine activity
              </Typography>
            </Box>

            <Chip
              label={`${analytics?.recent_calculations.length || 0} recent`}
              size="small"
              variant="outlined"
            />
          </Box>

          <Divider />

          {analytics?.recent_calculations.length ? (
            <Box
              sx={{
                overflowX: "auto",
              }}
            >
              <Box
                sx={{
                  minWidth: 760,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr 1fr 1.2fr 1.2fr 1.2fr",
                    px: 3,
                    py: 1.5,
                    background: "#F8FAFC",
                  }}
                >
                  {[
                    "Calculation",
                    "Product",
                    "Customer",
                    "Original",
                    "Discount",
                    "Final",
                  ].map((heading) => (
                    <Typography
                      key={heading}
                      sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      {heading}
                    </Typography>
                  ))}
                </Box>

                {analytics.recent_calculations
                  .slice(0, 8)
                  .map((calculation) => (
                    <Box
                      key={calculation.calculation_id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr 1fr 1.2fr 1.2fr 1.2fr",
                        px: 3,
                        py: 2,
                        borderTop:
                          "1px solid #F1F5F9",
                        alignItems: "center",
                        "&:hover": {
                          background: "#FAFAFF",
                        },
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 750,
                            color: "#0F172A",
                          }}
                        >
                          #{calculation.calculation_id}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#94A3B8",
                            mt: 0.2,
                          }}
                        >
                          {formatDate(
                            calculation.calculated_at,
                          )}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        #{calculation.product_id}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        #{calculation.customer_id}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#334155",
                        }}
                      >
                        {formatCurrency(
                          calculation.original_price,
                        )}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 750,
                          color: "#EA580C",
                        }}
                      >
                        -
                        {formatCurrency(
                          calculation.discount_amount,
                        )}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 850,
                          color: "#4F46E5",
                        }}
                      >
                        {formatCurrency(
                          calculation.final_price,
                        )}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          ) : (
            <EmptyState message="No pricing calculations have been recorded yet." />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const EmptyState = ({
  message,
}: {
  message: string;
}) => (
  <Box
    sx={{
      height: "100%",
      minHeight: 180,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      px: 3,
    }}
  >
    <Typography
      sx={{
        color: "#94A3B8",
        fontSize: 13,
      }}
    >
      {message}
    </Typography>
  </Box>
);

export default Dashboard;