import * as bcrypt from 'bcrypt';

export class Password {
  static compare(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  constructor(password: string) {
    this._value = this.hashPassword(password);
  }

  private readonly _saltRounds = 10;
  private readonly _value: string;

  private hashPassword(password: string): string {
    const salt = this.generateSalt(this._saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  private generateSalt(salt: number): string {
    return bcrypt.genSaltSync(salt);
  }

  public get value(): string {
    return this._value;
  }
}
