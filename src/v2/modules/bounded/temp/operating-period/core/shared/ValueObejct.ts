export abstract class ValueObjectBase<T> {
  protected abstract validate(value: T): boolean;

  constructor(
    private primitiveValue: T,
    errorMessage: string,
  ) {
    if (!this.validate(primitiveValue)) throw new Error(errorMessage);
    // if (!this.validate(primitiveValue)) throw new DomainException(errorMessage)
  }

  getValue() {
    return this.primitiveValue;
  }
}
