import jwt from "jsonwebtoken";

// ACCESS TOKEN
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// REFRESH TOKEN
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};