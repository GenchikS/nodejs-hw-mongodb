import * as authService from "../services/auth.js"

export const registerController = async (req, res) => {
    const data = await authService.registerContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      name: data.name,
      email: data.email
    });
}

export const loginController = async (req, res) => {
  const session = await authService.loginContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    name: session.name,
    email: session.email,
  });
};
