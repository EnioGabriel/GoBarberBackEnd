import { getMongoRepository, MongoRepository } from "typeorm";

import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";

import Notification from "../../schemas/Notification";

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    /* 1° param: nome da entidade.
    2° param: nome da conexão do banco defindo lá no ormConfig   */
    this.ormRepository = getMongoRepository(Notification, "mongo");
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
