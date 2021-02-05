import ICacheProvider from '@shared/container/providers/CacheProvider/modules/ICacheProvider';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKay = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKay,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });
      await this.cacheProvider.save(cacheKay, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
