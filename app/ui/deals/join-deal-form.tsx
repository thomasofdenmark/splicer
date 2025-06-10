'use client';

import { useActionState , useState } from 'react';
import { useFormStatus } from 'react-dom';

import { joinGroupDeal } from '@/app/lib/deal-actions';

import { Button } from '../button';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Joining...' : 'Join Deal'}
    </Button>
  );
}

export default function JoinDealForm({ dealId }: { dealId: string }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(joinGroupDeal, initialState);
  const [quantity, setQuantity] = useState(1);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="deal_id" value={dealId} />
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            aria-describedby="quantity-error"
          />
        </div>
        <div id="quantity-error" aria-live="polite" aria-atomic="true">
          {state.errors?.quantity &&
            state.errors.quantity.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any notes about your participation..."
            aria-describedby="notes-error"
          />
        </div>
        <div id="notes-error" aria-live="polite" aria-atomic="true">
          {state.errors?.notes &&
            state.errors.notes.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <SubmitButton />
      </div>

      <div id="form-error" aria-live="polite" aria-atomic="true">
        {state.message && (
          <div className={`mt-2 text-sm ${
            state.errors && Object.keys(state.errors).length > 0 
              ? 'text-red-500' 
              : 'text-green-600'
          }`}>
            {state.message}
          </div>
        )}
      </div>
    </form>
  );
} 