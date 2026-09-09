import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  AnalyticsOutlined,
  AssessmentOutlined,
  CalculateOutlined,
  CategoryOutlined,
  DashboardOutlined,
  Inventory2Outlined,
  LogoutOutlined,
  Menu as MenuIcon,
  PeopleOutlined,
  PriceChangeOutlined,
  RuleOutlined,
  SettingsOutlined,
  NotificationsNoneOutlined,
} from "@mui/icons-material";

import { logout } from "../services/authService";


const drawerWidth = 260;


const navigation = [
  {
    section: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardOutlined />,
      },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      {
        label: "Products",
        path: "/products",
        icon: <Inventory2Outlined />,
      },
      {
        label: "Customers",
        path: "/customers",
        icon: <PeopleOutlined />,
      },
      {
        label: "Categories",
        path: "/categories",
        icon: <CategoryOutlined />,
      },
    ],
  },
  {
    section: "PRICING",
    items: [
      {
        label: "Pricing Rules",
        path: "/pricing-rules",
        icon: <RuleOutlined />,
      },
      {
        label: "Promotions",
        path: "/promotions",
        icon: <PriceChangeOutlined />,
      },
      {
        label: "Calculator",
        path: "/pricing-calculator",
        icon: <CalculateOutlined />,
      },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      {
        label: "Pricing History",
        path: "/pricing-history",
        icon: <AssessmentOutlined />,
      },
      {
        label: "Rule Tester",
        path: "/rule-testing",
        icon: <AnalyticsOutlined />,
      },
    ],
  },
];


const AdminLayout = () => {

  const theme = useTheme();

  const mobile = useMediaQuery(
    theme.breakpoints.down("md"),
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileAnchor, setProfileAnchor] =
    useState<null | HTMLElement>(null);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const handleNavigation = (path: string) => {
    navigate(path);

    if (mobile) {
      setMobileOpen(false);
    }
  };


  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #111827 0%, #0F172A 100%)",
        color: "#fff",
      }}
    >

      {/* Brand */}

      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          px: 2.5,
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
            background:
              "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow:
              "0 8px 25px rgba(99,102,241,.35)",
          }}
        >
          <PriceChangeOutlined />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: ".08em",
            }}
          >
            DYNAMIC
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#94A3B8",
              letterSpacing: ".12em",
            }}
          >
            PRICING ENGINE
          </Typography>
        </Box>

      </Box>


      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      />


      {/* Navigation */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.5,
          py: 2,
        }}
      >

        {navigation.map((group) => (

          <Box
            key={group.section}
            sx={{ mb: 2.5 }}
          >

            <Typography
              sx={{
                px: 1.5,
                mb: 0.8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".12em",
                color: "#64748B",
              }}
            >
              {group.section}
            </Typography>


            <List disablePadding>

              {group.items.map((item) => {

                const active =
                  location.pathname === item.path;

                return (
                  <ListItemButton
                    key={item.path}
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    sx={{
                      minHeight: 46,
                      mb: 0.5,
                      borderRadius: 2,
                      color: active
                        ? "#fff"
                        : "#94A3B8",

                      backgroundColor: active
                        ? "rgba(99,102,241,.18)"
                        : "transparent",

                      border: active
                        ? "1px solid rgba(129,140,248,.18)"
                        : "1px solid transparent",

                      "&:hover": {
                        backgroundColor:
                          "rgba(255,255,255,.06)",
                        color: "#fff",
                      },

                      transition:
                        "all .2s ease",
                    }}
                  >

                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                          },
                        },
                      }}
                    />

                  </ListItemButton>
                );
              })}

            </List>

          </Box>
        ))}

      </Box>


      {/* Bottom */}

      <Box sx={{ p: 1.5 }}>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#94A3B8",
            "&:hover": {
              backgroundColor:
                "rgba(239,68,68,.1)",
              color: "#FCA5A5",
            },
          }}
        >

          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            <LogoutOutlined />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            slotProps={{
              primary: {
                sx: {
                  fontSize: 14,
                  fontWeight: 600,
                },
              },
            }}
          />

        </ListItemButton>

      </Box>

    </Box>
  );


  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >

      {/* Desktop Sidebar */}

      {!mobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}


      {/* Mobile Sidebar */}

      {mobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() =>
            setMobileOpen(false)
          }
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}


      {/* Main */}

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >

        {/* Header */}

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "rgba(255,255,255,.9)",
            backdropFilter: "blur(12px)",
            color: "#0F172A",
            borderBottom:
              "1px solid #E2E8F0",
          }}
        >

          <Toolbar
            sx={{
              minHeight: "72px !important",
              px: {
                xs: 2,
                md: 3,
              },
            }}
          >

            {mobile && (
              <IconButton
                onClick={() =>
                  setMobileOpen(true)
                }
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}


            <Box sx={{ flex: 1 }}>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#64748B",
                }}
              >
                Business Rules Engine
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Pricing Intelligence
              </Typography>

            </Box>


            <Tooltip title="Notifications">

              <IconButton sx={{ mr: 1 }}>

                <Badge
                  variant="dot"
                  color="error"
                >
                  <NotificationsNoneOutlined />
                </Badge>

              </IconButton>

            </Tooltip>


            <IconButton
              onClick={(event) =>
                setProfileAnchor(
                  event.currentTarget,
                )
              }
            >

              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: 14,
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg,#4F46E5,#7C3AED)",
                }}
              >
                A
              </Avatar>

            </IconButton>


            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() =>
                setProfileAnchor(null)
              }
            >

              <MenuItem>
                <ListItemIcon>
                  <SettingsOutlined fontSize="small" />
                </ListItemIcon>

                Settings
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
              >
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" />
                </ListItemIcon>

                Logout
              </MenuItem>

            </Menu>

          </Toolbar>

        </AppBar>


        {/* Page Content */}

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              lg: 4,
            },
          }}
        >
          <Outlet />
        </Box>

      </Box>

    </Box>
  );
};


export default AdminLayout;
