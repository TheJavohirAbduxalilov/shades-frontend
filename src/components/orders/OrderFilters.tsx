import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersFilters } from '../../hooks/useOrders';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface OrderFiltersProps {
  filters: OrdersFilters;
  onChange: (filters: OrdersFilters) => void;
}

const OrderFilters = ({ filters, onChange }: OrderFiltersProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status?.[0] || 'all');

  useEffect(() => {
    onChange({
      search,
      status: status === 'all' ? undefined : [status],
    });
  }, [search, status, onChange]);

  return (
    <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <Input
        label={t('orders.search')}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('orders.search')}
      />
      <Select
        label={t('orders.filters')}
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="all">{t('orders.allStatuses')}</option>
        <option value="new">{t('status.new')}</option>
        <option value="in_progress">{t('status.in_progress')}</option>
        <option value="measured">{t('status.measured')}</option>
        <option value="completed">{t('status.completed')}</option>
      </Select>
    </div>
  );
};

export default OrderFilters;
