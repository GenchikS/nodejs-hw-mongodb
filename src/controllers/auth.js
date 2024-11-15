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
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      name: data.name,
      email: data.email
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
