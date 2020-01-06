import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/Users';
import File from '../models/File';
import auth from '../../config/auth';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validade fail de email' });
        }
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', ' url'],
                }
            ]
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found ' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password invalid' });
        }

        const { id, name, avatar, provider } = user;

        return res.json({
            user: {
                id,
                name,
                email,
                provider,
                avatar
            },
            token: jwt.sign({ id }, auth.secret, {
                expiresIn: auth.expireIn,
            }),
        });
    }
}

export default new SessionController();
