import { Url } from './url.vo';

it('should create a Url value object containing both the original and short urls', () => {
  // Arrange
  const originalUrl = 'https://teddydigital.io';

  // Act
  const url = new Url(originalUrl);

  // Assert
  expect(url.originalUrl).toBe(originalUrl);
  expect(url.shortUrl).not.toBeNull();
});

it('should generate a short url without including the original url', () => {
  // Arrange
  const originalUrl = 'https://teddydigital.io';

  // Act
  const url = new Url(originalUrl);

  // Assert
  expect(url.shortUrl).not.toContain(originalUrl);
});

it('should generate a 6-character random string for the short url', () => {
  // Arrange
  const originalUrl = 'https://teddydigital.io';

  // Act
  const url = new Url(originalUrl);

  // Assert
  expect(url.shortUrl).toHaveLength(6);
});
