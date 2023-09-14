import { Expose } from 'class-transformer';
import { DateAudit } from '@core/base/date_audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RoleEnum } from '@models/enums/role.enum';
import { LanguageEnum } from '@models/enums';

// @Index()
@Entity({ name: 'user' })
export class UserEntity extends DateAudit {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: string;

  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName: string;

  // @Exclude()
  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @Column({ name: 'role', type: 'varchar', default: RoleEnum.USER })
  role: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'phoneNumber', type: 'varchar', nullable: false })
  phoneNumber: boolean;

  @Column({ name: 'country', type: 'varchar', nullable: false })
  country: boolean;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: boolean;

  @Column({ name: 'language', type: 'varchar', default: LanguageEnum.ES })
  language: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    if (this?.firstName && this?.lastName)
      return `${this?.firstName} ${this?.lastName}`;
  }
}
