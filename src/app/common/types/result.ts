// export type Result<T, E> = Success<T> | Failure<E>;

// export class Success<T> {
//   readonly isSuccess = true;
//   readonly isFailure = false;
//   constructor(readonly value: T) {}
// }

// export class Failure<E> {
//   readonly isSuccess = false;
//   readonly isFailure = true;
//   constructor(readonly error: E) {}
// }

export class Result<T> {
  public value: T;
  public isSuccess: boolean;
  public isFailure: boolean;
  constructor(value: T, isSuccess: boolean, isFailure: boolean) {
    this.value = value;
    this.isSuccess = isSuccess;
    this.isFailure = isFailure;
  }

  static success<T>(value: T): Result<T> {
    return new Result<T>(value, true, false);
  }

  static failure<T>(error: T): Result<T> {
    return new Result<T>(error, false, true);
  }
}
