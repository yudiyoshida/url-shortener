export class UrlService {
  static generateShortUrl(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  static formatShortUrl(domain: string, shortUrl: string): string {
    return `${domain}/${shortUrl}`;
  }
}
