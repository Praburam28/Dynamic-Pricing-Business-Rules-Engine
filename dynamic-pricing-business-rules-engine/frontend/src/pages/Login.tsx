import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  AutoAwesome,
  CheckCircleOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  TrendingUp,
  Tune,
  Security,
} from "@mui/icons-material";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        username,
        password,
      });

      if (rememberMe) {
        localStorage.setItem("access_token", response.access_token);
        sessionStorage.removeItem("access_token");
      } else {
        sessionStorage.setItem("access_token", response.access_token);
        localStorage.removeItem("access_token");
      }

      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        "Unable to sign in. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0B1120 0%, #111827 48%, #172554 100%)",
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "rgba(79,70,229,0.18)",
          filter: "blur(100px)",
          top: -220,
          left: -160,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "rgba(14,165,233,0.12)",
          filter: "blur(100px)",
          right: -180,
          bottom: -180,
        }}
      />

      {/* LEFT PANEL */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "55%",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          px: { lg: 7, xl: 11 },
          py: 6,
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#fff",
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              background:
                "linear-gradient(135deg,#6366F1 0%,#38BDF8 100%)",
              boxShadow: "0 12px 30px rgba(99,102,241,0.35)",
            }}
          >
            <AutoAwesome />
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              DYNAMIC
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: 2.5,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              PRICING ENGINE
            </Typography>
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ maxWidth: 650 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.8,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#34D399",
                boxShadow: "0 0 12px #34D399",
              }}
            />

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Intelligent Pricing Platform
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { lg: 46, xl: 58 },
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: -2,
              mb: 3,
            }}
          >
            Smarter pricing.
            <br />
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(90deg,#818CF8,#38BDF8)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Better decisions.
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 560,
              mb: 4,
            }}
          >
            Configure business rules, automate pricing decisions and
            understand every calculation from one intelligent platform.
          </Typography>

          {/* Feature 1 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderRadius: 3,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.05)",
                transform: "translateX(5px)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background: "rgba(99,102,241,0.18)",
                color: "#A5B4FC",
              }}
            >
              <TrendingUp />
            </Avatar>

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Dynamic Pricing
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.48)",
                  mt: 0.3,
                }}
              >
                Apply intelligent pricing based on business conditions.
              </Typography>
            </Box>
          </Box>

          {/* Feature 2 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderRadius: 3,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.05)",
                transform: "translateX(5px)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background: "rgba(14,165,233,0.15)",
                color: "#7DD3FC",
              }}
            >
              <Tune />
            </Avatar>

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Flexible Business Rules
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.48)",
                  mt: 0.3,
                }}
              >
                Configure rules without changing application code.
              </Typography>
            </Box>
          </Box>

          {/* Feature 3 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderRadius: 3,
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.05)",
                transform: "translateX(5px)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background: "rgba(16,185,129,0.15)",
                color: "#6EE7B7",
              }}
            >
              <Security />
            </Avatar>

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Secure & Controlled
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.48)",
                  mt: 0.3,
                }}
              >
                JWT authentication with role-based access control.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          © 2026 Dynamic Pricing Engine
        </Typography>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          width: { xs: "100%", lg: "45%" },
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 5,
            p: { xs: 3, sm: 5 },
            background: "rgba(255,255,255,0.97)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.28),0 8px 30px rgba(0,0,0,0.12)",
          }}
        >
          {/* Mobile brand */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 5,
            }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background:
                  "linear-gradient(135deg,#4F46E5,#0EA5E9)",
              }}
            >
              <AutoAwesome />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                DYNAMIC
              </Typography>

              <Typography
                sx={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "#64748B",
                }}
              >
                PRICING ENGINE
              </Typography>
            </Box>
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: { xs: 30, sm: 34 },
                fontWeight: 800,
                letterSpacing: -1,
                color: "#111827",
                mb: 1,
              }}
            >
              Welcome back
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                color: "#64748B",
              }}
            >
              Sign in to manage your pricing intelligence.
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2.5,
                fontSize: 13,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            {/* Username */}
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#334155",
                mb: 1,
              }}
            >
              Username
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  height: 52,
                  borderRadius: 2.5,
                  background: "#F8FAFC",
                },
              }}
            />

            {/* Password */}
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#334155",
                mb: 1,
              }}
            >
              Password
            </Typography>

            <Box sx={{ position: "relative" }}>
              <LockOutlined
                sx={{
                  position: "absolute",
                  left: 14,
                  top: 16,
                  zIndex: 2,
                  color: "#94A3B8",
                  fontSize: 20,
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: 2.5,
                    background: "#F8FAFC",
                  },
                  "& .MuiOutlinedInput-input": {
                    paddingLeft: "44px",
                    paddingRight: "50px",
                  },
                }}
              />

              <IconButton
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                disabled={loading}
                sx={{
                  position: "absolute",
                  right: 6,
                  top: 6,
                }}
              >
                {showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </Box>

            {/* Remember */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 1.5,
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    sx={{
                      "&.Mui-checked": {
                        color: "#4F46E5",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#64748B",
                    }}
                  >
                    Remember me
                  </Typography>
                }
              />

              <Button
                type="button"
                variant="text"
                sx={{
                  minWidth: 0,
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#4F46E5",
                }}
              >
                Forgot password?
              </Button>
            </Box>

            {/* Login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !username || !password}
              endIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <ArrowForward />
                )
              }
              sx={{
                height: 52,
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: 14,
                fontWeight: 700,
                background:
                  "linear-gradient(135deg,#4F46E5,#6366F1)",
                boxShadow:
                  "0 10px 25px rgba(79,70,229,0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg,#4338CA,#4F46E5)",
                  transform: "translateY(-1px)",
                  boxShadow:
                    "0 14px 30px rgba(79,70,229,0.32)",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign in to dashboard"}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Typography
              sx={{
                fontSize: 10,
                color: "#94A3B8",
                letterSpacing: 1.5,
              }}
            >
              SECURE ACCESS
            </Typography>
          </Divider>

          {/* Security card */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              borderRadius: 3,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <CheckCircleOutlined
              sx={{
                color: "#10B981",
                fontSize: 20,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                Protected workspace
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#94A3B8",
                  mt: 0.3,
                }}
              >
                Your session is secured using JWT authentication.
              </Typography>
            </Box>
          </Box>

          <Typography
            align="center"
            sx={{
              mt: 3,
              fontSize: 10,
              color: "#94A3B8",
            }}
          >
            Dynamic Pricing & Business Rules Engine
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
