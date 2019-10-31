import * as Yup from 'yup';
import User from '../models/Users';
import Appointment from '../models/Appointment';

class AppointmentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validação appointmet' });
        }

        const { provider_id, date } = req.body;

        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider) {
            return res.status(401).json({ error: 'Não és Provider' });
        }

        const appointmet = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });

        return res.json(appointmet);
    }
}

export default new AppointmentController();
