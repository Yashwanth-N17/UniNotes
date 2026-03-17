import * as authService from "../services/auth.service.js"; 

export async function register(req, res) {
  try {
    const { user, accessToken, refreshToken } =
      await authService.registerUser(req.body, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await authService.getUserProfile(req.user.id);

    res.json({
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function refreshToken(req, res) {
  try {
    const { accessToken, newRefreshToken } =
      await authService.refreshUserToken(req.cookies.refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: accessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } =
      await authService.loginUser(email, password, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token: accessToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function logout(req, res) {
  try {
    await authService.logoutUser(req.cookies.refreshToken);

    res.clearCookie("refreshToken");

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


export async function updateUser(req, res) {
  try {
    const user = await authService.updateUserProfile(req.user.id, req.body);

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}