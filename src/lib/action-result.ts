export type ActionResult<T = undefined> = {
  ok: boolean;
  message: string;
  data?: T;
};

export const ok = <T>(message: string, data?: T): ActionResult<T> => ({
  ok: true,
  message,
  data,
});

export const fail = <T = undefined>(message: string): ActionResult<T> => ({
  ok: false,
  message,
});
