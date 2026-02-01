import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { ChartOfAccount } from './chart-of-account.entity';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('journal_entry_lines')
export class JournalEntryLine {
    @PrimaryGeneratedColumn('uuid', { name: 'line_id' })
    lineId!: string;

    @Column({ name: 'entry_id', type: 'uuid' })
    @Index()
    entryId!: string;

    @Column({ name: 'account_id', type: 'uuid' })
    accountId!: string;

    @Column({
        type: 'decimal',
        precision: 14,
        scale: 2,
        transformer: numericTransformer,
        default: 0,
    })
    debit!: number;

    @Column({
        type: 'decimal',
        precision: 14,
        scale: 2,
        transformer: numericTransformer,
        default: 0,
    })
    credit!: number;

    @ManyToOne(() => JournalEntry)
    @JoinColumn({ name: 'entry_id' })
    journalEntry!: JournalEntry;

    @ManyToOne(() => ChartOfAccount)
    @JoinColumn({ name: 'account_id' })
    account!: ChartOfAccount;
}
