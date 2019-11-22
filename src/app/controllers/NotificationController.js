import Notification from '../schemas/Notification';
import User from '../models/Users';

class NotificationController {
    async index(req, res) {
        const isProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!isProvider) {
            return res.status(401).json({ error: 'Provedor sem notificação' });
        }

        const notications = await Notification.find({
            user: req.userId,
        })
            .sort({
                createdAt: 'desc',
            })
            .limit(20);

        return res.json(notications);
    }

    async update(req, res) {
        const notication = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        return res.json(notication);
    }
}

export default new NotificationController();
