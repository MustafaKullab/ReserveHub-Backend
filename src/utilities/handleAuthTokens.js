const production = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: "lax",
  path: "/",
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);

  res.clearCookie("refreshToken", cookieOptions);
};

module.exports = {setAuthCookies , clearAuthCookies};
