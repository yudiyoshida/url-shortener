import { TestBed } from '@automock/jest';
import { GetAllUrlsUseCase } from './get-all-urls.service';

describe('GetAllUrlsUseCase', () => {
  let sut: GetAllUrlsUseCase;

  beforeEach(() => {
    const { unit } = TestBed.create(GetAllUrlsUseCase).compile();

    sut = unit;
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
