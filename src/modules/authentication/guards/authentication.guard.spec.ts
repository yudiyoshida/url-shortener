import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationGuard } from './authentication.guard';

function contextMockFactory(token?: string) {
  return createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: token ? `Bearer ${token}` : undefined,
        },
      }),
    }),
  });
};

describe('AuthenticationGuard', () => {
  let sut: AuthenticationGuard;
  let mockReflector: jest.Mocked<Reflector>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(AuthenticationGuard).compile();

    sut = unit;
    mockReflector = unitRef.get(Reflector);
    mockJwtService = unitRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('Protection full', () => {
    it('should throw UnauthorizedException if protection level is full and token is not provided', async() => {
      // Arrange
      const context = contextMockFactory();
      mockReflector.getAllAndOverride.mockReturnValue('full');

      // Act & Assert
      expect.assertions(2);
      return sut.canActivate(context).catch((error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(mockJwtService.verifyAsync).not.toHaveBeenCalled();
      });
    });

    it('should throw UnauthorizedException if protection level is full and token provided is invalid', async() => {
      // Arrange
      const context = contextMockFactory('token');
      mockReflector.getAllAndOverride.mockReturnValue('full');
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      // Act & Assert
      expect.assertions(2);
      return sut.canActivate(context).catch((error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(mockJwtService.verifyAsync).toHaveBeenCalled();
      });
    });

    it('should return true if protection level is full and token is valid', async() => {
      // Arrange
      const context = contextMockFactory('token');
      mockReflector.getAllAndOverride.mockReturnValue('full');
      mockJwtService.verifyAsync.mockResolvedValue({});

      // Act
      const result = await sut.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockJwtService.verifyAsync).toHaveBeenCalled();
    });
  });

  describe('Protection partial', () => {
    it('should return true if protection level is partial and token is not provided', async() => {
      // Arrange
      const context = contextMockFactory();
      mockReflector.getAllAndOverride.mockReturnValue('partial');

      // Act
      const result = await sut.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockJwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if protection level is partial and token provided is invalid', async() => {
      // Arrange
      const context = contextMockFactory('token');
      mockReflector.getAllAndOverride.mockReturnValue('partial');
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      // Act & Assert
      expect.assertions(2);
      return sut.canActivate(context).catch((error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(mockJwtService.verifyAsync).toHaveBeenCalled();
      });
    });

    it('should return true if protection level is partial and token is valid', async() => {
      // Arrange
      const context = contextMockFactory('token');
      mockReflector.getAllAndOverride.mockReturnValue('partial');
      mockJwtService.verifyAsync.mockResolvedValue({});

      // Act
      const result = await sut.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockJwtService.verifyAsync).toHaveBeenCalled();
    });
  });
});
