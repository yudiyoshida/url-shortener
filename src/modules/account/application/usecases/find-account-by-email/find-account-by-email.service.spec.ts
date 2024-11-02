import { TestBed } from '@automock/jest';
import { FindAccountByEmailUseCase } from './find-account-by-email.service';

describe('FindAccountByEmailUseCase', () => {
  let sut: FindAccountByEmailUseCase;

  beforeEach(() => {
    const { unit } = TestBed.create(FindAccountByEmailUseCase).compile();

    sut = unit;
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
