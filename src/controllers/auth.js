import * as authService from "../services/auth.js";

const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntil } = session;
  res.cookie('refreshToken', refreshToken, {
    //  збереження в куки, для захисту та щоб не збереглися в локалсторич
    httpOnly: true,
    expires: refreshTokenValidUntil, //  час життя куки взяли з часу життя refreshToken
  });

  res.cookie('sessionId', _id, {
    //  збереження в куки, для захисту та щоб не збереглися в локалсторич
    httpOnly: true,
    expires: refreshTokenValidUntil, //  час життя куки взяли з часу життя refreshToken
  });
}

export const registerController = async (req, res) => {
  const data = await authService.registerContact(req.body);
  const { name, email, _id } = data;
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name, email, _id },
    });
}

export const loginController = async (req, res) => {
  // const session = await authService.loginContact(req.body);
  // console.log(session); //  перевірка
  const session =
    await authService.loginContact(req.body);  //  можна достати через деструктурізацію
    
  setupSession(res, session)

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  // console.log(req.cookies);  //  перевірка cookies
  const session = await authService.refreshUserSession(req.cookies);  //  передача cookies

  setupSession(res, session);

res.json({
  status: 200,
  message: 'Successfully refresh session!',
  data: {
    accessToken: session.accessToken,
  },
});
}

export const logoutController = async (req, res) => {
  //  якщо є активна сесія, то ми передаемо id сесії і викликаємо logout
  if (req.cookies.sessionId) {
    await authService.logout(req.cookies.sessionId);
  }
  res.clearCookie("sessionId"); //  викликаємо очищення cookie
  res.clearCookie('refreshToken');

  res.status(204).send();
}


export const requestResetEmailController = async (req, res) => {
  await authService.requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
}