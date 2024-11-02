/*
  a value object must be immutable,
  so we can't change the attributes after creating the object,
  that's why there are no setters in the class.
*/
export class Url {
  private _originalUrl: string;
  private _shortUrl: string;

  constructor(originalUrl: string) {
    this._originalUrl = originalUrl;
    this._shortUrl = this.generateShortUrl();
  }

  private generateShortUrl(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  get originalUrl(): string {
    return this._originalUrl;
  }

  get shortUrl(): string {
    return this._shortUrl;
  }
}
