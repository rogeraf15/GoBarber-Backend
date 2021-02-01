import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let createAppointment: CreateAppointmentService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1234535',
      user_id: '23123213',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234535');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1234535',
      user_id: '23123213',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1234535',
        user_id: '23123213',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
