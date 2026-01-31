import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_permissions')
@Index('idx_user_permissions_user', ['userId'])
export class UserPermission {
    @PrimaryColumn({ type: 'uuid' })
    userId: string;

    @PrimaryColumn({ type: 'varchar', length: 100 })
    permissionCode: string;

    @Column({ type: 'uuid', nullable: true })
    grantedBy: string;

    @CreateDateColumn()
    grantedAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
