import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';

describe('RedirectController', () => {
  let sut: RedirectController;
  let mockRedirectService: jest.Mocked<RedirectService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RedirectController).compile();

    sut = unit;
    mockRedirectService = unitRef.get(RedirectService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should redirect to original url', async() => {
    // Arrange
    const shortUrl = 'short-url';
    const originalUrl = 'original-url';
    const mockResponse = createMock<Response>();
    mockRedirectService.execute.mockResolvedValue(originalUrl);

    // Act
    await sut.getShortUrl(shortUrl, mockResponse);

    // Assert
    expect(mockRedirectService.execute).toHaveBeenCalledWith(shortUrl);
    expect(mockResponse.redirect).toHaveBeenCalledWith(originalUrl);
  });
});
