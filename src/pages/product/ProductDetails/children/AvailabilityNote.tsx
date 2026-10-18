import { AVAILABILITY_LABELS, type TAvailability } from '@/utils/availability.util';

const DOT: Record<TAvailability, string> = {
  'in-stock': 'bg-primary-green',
  'low-stock': 'bg-princeton-orange-c',
  'out-of-stock': 'bg-primary-red',
};

/**
 * What the stock says, in words and with a coloured dot (the words are the meaning, the dot only helps). It is read out
 * when it changes: a shopper who chooses another shade is told whether that one is in stock.
 */
const AvailabilityNote = ({ availability }: { availability: TAvailability }) => (
  <p aria-live="polite" className="flex items-center gap-2 text-sm font-medium">
    <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${DOT[availability]}`} />
    {AVAILABILITY_LABELS[availability]}
  </p>
);

export default AvailabilityNote;
