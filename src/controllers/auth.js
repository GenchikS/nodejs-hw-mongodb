import { hathPassword } from "../hashpassword/hathpassword.js";
import * as authService from "../services/auth.js"

export const registerController = async (req, res) => {
    const data = await authService.registerContact(req.body);



    //  приклад хешування
    // console.log('data', data.password);
    const hath = await hathPassword(data.password);
    console.log('hath', hath);  //  перевірка паролю з salt



    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      name: data.name,
      email: data.email,
      password: hath,
    });
}
