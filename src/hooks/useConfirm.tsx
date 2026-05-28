import { useCallback, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

interface ConfirmState {
  open: boolean;
  message: string;
  title?: string;
  resolve: ((v: boolean) => void) | null;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false, message: '', resolve: null,
  });

  const confirm = useCallback((message: string, title?: string): Promise<boolean> =>
    new Promise(resolve => setState({ open: true, message, title: title, resolve }))
  , []);

  const close = useCallback((value: boolean) => {
    setState(prev => {
      prev.resolve?.(value);
      return { open: false, message: '', resolve: null };
    });
  }, []);

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      message={state.message}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, dialog };
}
