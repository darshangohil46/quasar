"use client";

import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  open?: boolean; // Added the `open` property
  onOpenChange?: (open: boolean) => void; // Added the `onOpenChange` property
} & (
  | {
      variant: "default";
    }
  | {
      variant: "destructive";
    }
);

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

type ToastAction =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const reducer = (state: State, action: ToastAction): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId ? { ...toast, open: false } : toast
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners: ((state: State) => void)[] = [];
let memoryState: State = { toasts: [] };

function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type Toast = Omit<ToasterToast, "id">;

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [state]);

  const addToast = React.useCallback((toast: ToasterToast) => {
    dispatch({ type: actionTypes.ADD_TOAST, toast });
  }, []);

  const updateToast = React.useCallback((toast: Partial<ToasterToast>) => {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast });
  }, []);

  const dismissToast = React.useCallback((toastId?: ToasterToast["id"]) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }, []);

  const removeToast = React.useCallback((toastId?: ToasterToast["id"]) => {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, []);

  return {
    ...state,
    toast: React.useCallback(
      ({ ...props }: Toast) => {
        const id = crypto.randomUUID();

        const update = (props: Partial<ToasterToast>) =>
          updateToast({ id, ...props });
        const dismiss = () => dismissToast(id);
        const remove = () => removeToast(id);

        addToast({
          id,
          ...props,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dismiss();
          },
        });

        return {
          id: id,
          dismiss: dismiss,
          update: update,
          remove: remove,
        };
      },
      [addToast, dismissToast, removeToast, updateToast]
    ),
  };
}

export { useToast, reducer as toastReducer };
