import User from '../models/Users';
import File from '../models/File';

class ProviderController {
    async index(req, res) {
        const provider = await User.findAll({
            where: { provider: true },
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.json(provider);
    }
}

export default new ProviderController();
