import { authService } from "./auth.service.js";

export const getMe = async (req, res) => {
  const authMe = await authService.getMe({ id: req.user.id });

  res.json({
    data: authMe,
  });
};

export const register = async (req, res) => {
  const { email, username, password } = req.body;
  const result = await authService.register({ email, username, password });

  res.status(201).json({
    message: result.message,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.json({
    message: result.message,
    data: result.data,
  });
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await authService.deleteAdmin({ id });
    res.json({ message: result.message });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
